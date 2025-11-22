# Validation des sources de données Google Sheet

## URL du Google Sheet

**URL CSV utilisée** :
```
https://docs.google.com/spreadsheets/d/1w9ni9chAIuGjorkZzLlYiqcy9hHl_cmUDDSiQPGiAx8/gviz/tq?tqx=out:csv&gid=619171879
```

- **ID du document** : `1w9ni9chAIuGjorkZzLlYiqcy9hHl_cmUDDSiQPGiAx8`
- **GID (onglet)** : `619171879`

## Structure CSV attendue

Le Google Sheet doit exporter un CSV avec **4 colonnes** :
1. **Section** : Numéro ou identifiant (ex: "1", "2", "EXCHANGE_RATES")
2. **Label** : Libellé du service (ex: "Corporate Report Project Workshop")
3. **Type** : Type de tarification (ex: "fixed", "per_spread")
4. **Unit Price (USD)** : Prix en USD (ex: "300", "53")

## Correspondance Labels → Clés de prix

Le code fait correspondre les labels du sheet aux clés internes via le mapping `labelToKey` :

### Pour index.html (spreads)

| Label dans Google Sheet | Clé interne | Description |
|-------------------------|-------------|-------------|
| `Corporate Report Project Workshop` | `workshop_fixed` | Workshop fixe |
| `Report Creative Concept & Design` | `design_per_spread` | Design par spread |
| `Digital-First Integrated Report Layout – English` | `layout_en_per_spread` | Layout EN par spread |
| `Digital-First Integrated Report Layout – Arabic` | `layout_ar_per_spread` | Layout AR par spread |
| `Project Management` | `pm_per_spread` | PM par spread (ignoré, calculé à 25%) |
| `Native Interactive PDF` | `interactive_pdf_per_spread` | PDF interactif par spread |
| `Interactive Flipbook` | `flipbook_per_spread` | Flipbook par spread |
| `Microsite` | `microsite_fixed` | Microsite fixe |
| `English Proofreading` | `proofreading_per_spread` | Proofreading par spread |

### Pour pages.html (pages)

Même structure mais avec les clés `_per_page` au lieu de `_per_spread`.

## Normalisation des labels

Le code utilise `normalizeLabel()` qui :
1. Convertit en minuscules
2. Supprime les accents
3. Supprime tous les caractères non alphanumériques

**Exemple** :
- Sheet : `"Digital-First Integrated Report Layout – English"`
- Normalisé : `"digitalfirstintegratedreportlayoutenglish"`
- Mapping : `"digital-first integrated report layout – english"` → normalisé → correspondance

## Table de conversion de devise

**Section spéciale** : `EXCHANGE_RATES` (ou `EXCHANGE_RATE` ou `RATES`)

| Section | Label | Type | Unit Price (USD) |
|---------|-------|------|------------------|
| `EXCHANGE_RATES` | `AED` | (peu importe) | `3.67` |

Le code cherche :
- Section en majuscules = `EXCHANGE_RATES`, `EXCHANGE_RATE`, ou `RATES`
- Label = code devise ISO (USD, AED, EUR, GBP, JPY, CHF, CAD, AUD)
- Unit Price = ratio de conversion (1 USD = X devise)

## Données actuelles du Google Sheet

D'après le dernier fetch (2025-11-08) :

```
Section,Label,Type,Unit Price (USD)
1,Corporate Report Project Workshop,fixed,300
2,Report Creative Concept & Design,per_spread,53
3,Digital-First Integrated Report Layout – English,per_spread,83
4,Digital-First Integrated Report Layout – Arabic,per_spread,40
5,Project Management,per_spread,25%
6,Native Interactive PDF,optional_per_spread,33
7,Interactive Flipbook,optional_per_spread,45
8,Microsite,optional_fixed,3800
8,ENGLISH PROOFREADING,optional_per_spread,37
```

## Problèmes potentiels

1. **Casse différente** : Le sheet utilise "Digital-First" avec majuscule, le code cherche "digital-first" (normalisé)
2. **Tirets différents** : Le sheet peut utiliser `–` (tiret long) vs `-` (tiret court)
3. **Section 5** : Le prix "25%" est ignoré (calculé dynamiquement)
4. **Lignes vides** : Les lignes avec Section vide sont filtrées

## Validation

Pour valider que tout fonctionne :

1. Vérifier que les labels du sheet correspondent exactement (après normalisation) aux clés dans `labelToKey`
2. Vérifier que la section `EXCHANGE_RATES` existe pour les taux de change
3. Tester avec un fetch direct de l'URL CSV
4. Vérifier la console du navigateur pour les erreurs

## Debug

Pour déboguer, ajouter dans la console :

```javascript
// Voir les données parsées
console.log('Labels trouvés:', Array.from(byLabel.keys()));
console.log('Taux de change:', exchangeRates);
console.log('Prix finaux:', PRICES);
```

