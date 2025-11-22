function initPricingMatrix(config) {
  const {
    defaultPrices,
    sheetCsv,
    baseServices,
    optionalServices,
    labelToKey,
    inputId,
    inputLabel,
    inputHint,
    inputPlaceholder,
    unitLabel,
    defaultCurrency = 'USD',
    currencies = ['USD', 'AED']
  } = config;

  let PRICES = { ...defaultPrices };
  let currentCurrency = defaultCurrency;
  let exchangeRates = { USD: 1, AED: 1 };
  let includeArabic = true;
  const toggles = {};
  optionalServices.forEach(svc => { toggles[svc.id] = false; });

  const inputEl = document.getElementById(inputId);
  const exportBtn = document.getElementById('exportBtn');
  const controlsBox = document.getElementById(inputId + 'Control');
  const hintEl = document.getElementById(inputId + 'Hint');
  const currencySelect = document.getElementById('currencySelect');
  const rowsEl = document.getElementById('rows');
  const rowsOptEl = document.getElementById('rowsOptional');
  const optionalTable = document.getElementById('optionalTable');
  const totalBaseEl = document.getElementById('totalBase');
  const totalOptionsEl = document.getElementById('totalOptions');
  const totalGrandEl = document.getElementById('totalGrand');

  // Vérification que tous les éléments DOM sont présents
  if (!inputEl || !exportBtn || !controlsBox || !rowsEl || !rowsOptEl || !optionalTable || !totalBaseEl || !totalOptionsEl || !totalGrandEl) {
    console.error('Missing DOM elements:', {
      inputEl: !!inputEl,
      exportBtn: !!exportBtn,
      controlsBox: !!controlsBox,
      rowsEl: !!rowsEl,
      rowsOptEl: !!rowsOptEl,
      optionalTable: !!optionalTable,
      totalBaseEl: !!totalBaseEl,
      totalOptionsEl: !!totalOptionsEl,
      totalGrandEl: !!totalGrandEl
    });
    return;
  }

  function normalizeLabel(str) {
    return str.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '');
  }

  function fmt(n, currency = currentCurrency) {
    const locale = currency === 'AED' ? 'ar-AE' : 'en-US';
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0
    }).format(n);
  }

  function convertAmount(amount) {
    return amount * exchangeRates[currentCurrency];
  }


  function formatQuantity(service, quantity) {
    if (typeof service.quantity === 'function') {
      return service.quantity(quantity);
    }
    if (service.type.includes('per_spread') || service.type.includes('per_page')) {
      if (quantity <= 0) return '—';
      const unit = quantity === 1 ? unitLabel.singular : unitLabel.plural;
      return `${quantity} ${unit}`;
    }
    if (service.type.includes('fixed')) {
      if (quantity <= 0) return '—';
      return '1 project';
    }
    return '—';
  }

  function linkList(items) {
    if (!items || !items.length) return '';
    return `<ul class="link-list">${items.map(([label, url]) => `<li><a href="${url}" target="_blank" rel="noopener">${label}</a></li>`).join('')}</ul>`;
  }

  function row(title, desc, includeHtml, qty, amount) {
    return `<tr>
      <td>
        <div class="section-label">${title}</div>
        ${desc ? `<div class="section-note">${desc}</div>` : ''}
      </td>
      <td class="include-cell">${includeHtml}</td>
      <td class="right">${qty}</td>
      <td class="right mono">${fmt(amount)}</td>
    </tr>`;
  }

  function optRow(service, detail, qty, amount, include) {
    return `<tr class="opt-row${include ? ' opt-row--active' : ''}">
      <td>
        <div class="section-label">${service.title} <span class="opt-flag">OPTIONAL</span></div>
        ${detail ? `<div class="section-note">${detail}</div>` : ''}
      </td>
      <td class="include-cell">
        <label class="include-toggle">
          <input type="checkbox" id="${service.id}" ${include ? 'checked' : ''}>
          <span>Include</span>
        </label>
      </td>
      <td class="right opt-quantity">${qty}</td>
      <td class="right mono">${fmt(amount)}</td>
    </tr>`;
  }

  function renderBaseRows(quantity, optionalTotals = {}) {
    let subtotal = 0;
    const amountByIdUSD = {};
    const html = baseServices.map(service => {
      const unit = PRICES[service.key];
      const isOptionalArabic = service.id === 'base4';
      const isIncluded = isOptionalArabic ? includeArabic : true;
      const includeMarkup = isOptionalArabic
        ? `<label class="include-toggle"><input type="checkbox" id="includeArabic" ${includeArabic ? 'checked' : ''}><span>Include</span></label>`
        : '<span class="tag-included">Included</span>';
      const qtyRaw = formatQuantity(service, quantity);
      let qtyDisplay = isIncluded ? qtyRaw : '—';
      let amountUSD = 0;
      let description = service.description;

      if (service.id === 'base3' && quantity > 0 && typeof description === 'string') {
        const quantityText = `${quantity} ${quantity === 1 ? unitLabel.singular : unitLabel.plural}`;
        description = description.replace(/50–75 spreads/gi, quantityText);
      }

      if (isIncluded) {
        if (service.id === 'base5') {
          const eligibleTotalUSD =
            (amountByIdUSD['base2'] || 0) +
            (amountByIdUSD['base3'] || 0) +
            (amountByIdUSD['base4'] || 0) +
            (optionalTotals['opt6'] || 0) +
            (optionalTotals['opt7'] || 0) +
            (optionalTotals['opt8'] || 0);
          amountUSD = eligibleTotalUSD * 0.25;
          qtyDisplay = '25%';
        } else {
          if (service.id === 'base2' && quantity > 0) {
            const rawAmountUSD = service.type.includes('fixed') ? unit : unit * quantity;
            amountUSD = Math.max(rawAmountUSD, 1800);
          } else {
            amountUSD = service.type.includes('fixed') ? unit : unit * quantity;
          }
          if (quantity <= 0 && service.type.includes('fixed')) {
            amountUSD = 0;
          }
        }
      }
      amountByIdUSD[service.id] = amountUSD;
      const amountDisplay = convertAmount(amountUSD);
      subtotal += amountDisplay;
      return row(service.title, description, includeMarkup, qtyDisplay, amountDisplay);
    }).join('');

    const subtotalRow = `<tr class="summary-row"><td colspan="3" class="right">TOTAL SECTIONS 1 TO 5</td><td class="right mono">${fmt(subtotal)}</td></tr>`;
    return { html: html + subtotalRow, subtotal };
  }

  function renderOptionalRows(quantity) {
    let total = 0;
    let hasActive = false;
    const totalsById = {};
    const html = optionalServices.map(service => {
      const unit = PRICES[service.key];
      const quantityRaw = formatQuantity(service, quantity);
      const include = Boolean(toggles[service.id]);
      const qty = include ? quantityRaw : '—';
      let amountUSD = 0;
      if (include) {
        amountUSD = service.type.includes('fixed') ? unit : unit * quantity;
      }
      const amountDisplay = convertAmount(amountUSD);
      totalsById[service.id] = amountUSD;
      if (include) {
        total += amountDisplay;
        hasActive = true;
      }
      const detail = service.description + (service.links ? linkList(service.links) : '');
      return optRow(service, detail, qty, amountDisplay, include);
    }).join('');
    return { html, total, hasActive, totalsById };
  }

  function attachBaseHandlers() {
    const checkbox = document.getElementById('includeArabic');
    if (checkbox) {
      checkbox.addEventListener('change', (event) => {
        includeArabic = event.target.checked;
        render();
      });
    }
  }

  function attachOptionHandlers() {
    optionalServices.forEach(service => {
      const checkbox = document.getElementById(service.id);
      if (checkbox) {
        checkbox.addEventListener('change', (event) => {
          toggles[service.id] = event.target.checked;
          render();
        });
      }
    });
  }

  function render() {
    const raw = (inputEl.value || '').trim();
    const parsed = Number(raw);
    const missing = raw === '' || Number.isNaN(parsed) || parsed <= 0;
    const quantity = missing ? 0 : Math.max(0, parsed);

    controlsBox.classList.toggle('is-missing', missing);
    if (hintEl) hintEl.classList.toggle('hidden', !missing);
    exportBtn.disabled = missing;

    const optional = renderOptionalRows(quantity);
    const base = renderBaseRows(quantity, optional.totalsById);

    rowsEl.innerHTML = base.html;
    rowsOptEl.innerHTML = optional.html;
    optionalTable.classList.toggle('optional-empty', !optional.hasActive);

    totalBaseEl.textContent = fmt(base.subtotal);
    totalOptionsEl.textContent = fmt(optional.total);
    totalGrandEl.textContent = fmt(base.subtotal + optional.total);

    attachBaseHandlers();
    attachOptionHandlers();
  }

  ['input','change','keyup','blur','paste'].forEach(evt => inputEl.addEventListener(evt, render));

  exportBtn.addEventListener('click', () => {
    window.print();
  });

  if (currencySelect) {
    currencySelect.addEventListener('change', (event) => {
      currentCurrency = event.target.value;
      render();
    });
  }

  (async function loadPrices() {
    try {
      const res = await fetch(sheetCsv, { cache: 'no-store' });
      if (!res.ok) throw new Error('fetch failed');
      const csv = await res.text();
      const lines = csv.trim().split(/\r?\n/);
      lines.shift();
      const rows = lines.map(line => line.split(/,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/).map(cell => cell.replace(/^\"|\"$/g, '').trim()))
        .filter(cols => cols.length >= 4);

      const byLabel = new Map();
      rows.forEach(([section, label, type, price]) => {
        const cleaned = price.replace(/[^\d.-]/g, '');
        const numeric = cleaned === '' ? NaN : Number(cleaned);
        const sectionUpper = (section || '').toUpperCase().trim();
        const labelUpper = (label || '').toUpperCase().trim();
        
        // Table de conversion de devise
        // Format attendu: Section = "EXCHANGE_RATES" ou "EXCHANGE_RATE"
        // Label = code devise (ex: "AED", "EUR")
        // Unit Price = ratio de conversion (ex: 3.67 pour 1 USD = 3.67 AED)
        // Les prix USD seront multipliés par ce ratio quand la devise est sélectionnée
        if (sectionUpper === 'EXCHANGE_RATES' || sectionUpper === 'EXCHANGE_RATE' || sectionUpper === 'RATES') {
          const currencyCode = labelUpper.match(/\b(USD|AED|EUR|GBP|JPY|CHF|CAD|AUD)\b/);
          if (currencyCode && !Number.isNaN(numeric)) {
            exchangeRates[currencyCode[1]] = numeric;
          }
        } else if (!Number.isNaN(numeric)) {
          // Prix des services (toujours en USD)
          byLabel.set(normalizeLabel(label), { type, price: numeric });
        }
      });

      Object.entries(labelToKey).forEach(([label, key]) => {
        const record = byLabel.get(normalizeLabel(label));
        if (record && key !== 'pm_per_spread' && key !== 'pm_per_page') {
          PRICES[key] = record.price;
        }
      });
    } catch (err) {
      console.warn('Unable to load Google Sheet:', err);
    }
    render();
  })();

  // Rendu initial pour afficher les tableaux même sans données
  render();
}

