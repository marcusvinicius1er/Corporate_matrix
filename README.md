# OXO Corporate Reporting – Pricing Matrix

Site de matrice de tarification pour les rapports d'entreprise.

## Structure du projet

Le projet est organisé en deux sites distincts :

### `matrix-spreads/`
- **Fichier principal** : `index.html`
- **URL** : `https://matrix.oxo-reporting.ae/`
- **Type** : Matrice de tarification basée sur les **spreads** (USD par défaut)
- **Configuration Cloudflare Pages** :
  - Root directory : `/matrix-spreads`
  - Build output directory : `/`

### `matrix-pages/`
- **Fichier principal** : `index.html` (anciennement `pages.html`)
- **URL** : `https://quote.oxo-reporting.ae/`
- **Type** : Matrice de tarification basée sur les **pages** (AED par défaut)
- **Configuration Cloudflare Pages** :
  - Root directory : `/matrix-pages`
  - Build output directory : `/`

## Déploiement sur Cloudflare Pages

### Application 1 : matrix-spreads

1. Créez un nouveau projet Pages dans Cloudflare
2. Connectez le repository Git
3. Configuration :
   - **Root directory** : `matrix-spreads`
   - **Build output directory** : `/` (ou laisser vide)
   - **Build command** : (laisser vide)
4. Ajoutez le domaine personnalisé : `matrix.oxo-reporting.ae`

### Application 2 : matrix-pages

1. Créez un nouveau projet Pages dans Cloudflare
2. Connectez le **même** repository Git
3. Configuration :
   - **Root directory** : `matrix-pages`
   - **Build output directory** : `/` (ou laisser vide)
   - **Build command** : (laisser vide)
4. Ajoutez le domaine personnalisé : `quote.oxo-reporting.ae`

## Structure des données

Les prix sont chargés dynamiquement depuis un Google Sheet :
- `matrix-spreads/index.html` utilise le GID `619171879`
- `matrix-pages/index.html` utilise le GID `441790827`
- Les taux de change sont chargés depuis l'onglet "Devises" (GID `1246682262`)

Voir `GOOGLE_SHEET_STRUCTURE.md` pour plus de détails sur la structure attendue.
