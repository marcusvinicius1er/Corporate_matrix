# OXO Corporate Reporting – Pricing Matrix

Site de matrice de tarification pour les rapports d'entreprise.

## Structure du projet

### Application existante (à la racine)
- **Fichier principal** : `index.html`
- **URL** : `https://matrix.oxo-reporting.ae/`
- **Type** : Matrice de tarification basée sur les **spreads** (USD par défaut)
- **Configuration Cloudflare Pages** : Root directory = `/` (racine)

### Nouvelle application : `_quote_pages_reporting/`
- **Fichier principal** : `index.html` (anciennement `pages.html`)
- **URL** : `https://quote.oxo-reporting.ae/`
- **Type** : Matrice de tarification basée sur les **pages** (AED par défaut)
- **Configuration Cloudflare Pages** :
  - **Root directory** : `_quote_pages_reporting`
  - **Build output directory** : `/` (ou laisser vide)
  - **Build command** : (laisser vide)

## Déploiement sur Cloudflare Pages

### Application existante (matrix.oxo-reporting.ae)
- Aucun changement nécessaire
- Continue à utiliser la racine du repository

### Nouvelle application (quote.oxo-reporting.ae)

1. Créez un nouveau projet Pages dans Cloudflare
2. Connectez le **même** repository Git
3. Configuration :
   - **Root directory** : `_quote_pages_reporting`
   - **Build output directory** : `/` (ou laisser vide)
   - **Build command** : (laisser vide)
4. Ajoutez le domaine personnalisé : `quote.oxo-reporting.ae`

## Structure des données

Les prix sont chargés dynamiquement depuis un Google Sheet :
- `index.html` (racine) utilise le GID `619171879`
- `_quote_pages_reporting/index.html` utilise le GID `441790827`
- Les taux de change sont chargés depuis l'onglet "Devises" (GID `1246682262`)

Voir `GOOGLE_SHEET_STRUCTURE.md` pour plus de détails sur la structure attendue.
