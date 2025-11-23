# OXO Corporate Reporting – Pricing Matrix

Site de matrice de tarification pour les rapports d'entreprise.

## Structure

- `index.html` : Matrice de tarification basée sur les spreads (USD par défaut)
- `pages.html` : Matrice de tarification basée sur les pages (AED par défaut)

## Déploiement sur Cloudflare Pages

### Étapes pour créer le projet dans Cloudflare Pages :

1. **Connecter le repository Git** :
   - Allez sur [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Naviguez vers **Pages** > **Create a project**
   - Sélectionnez **Connect to Git**
   - Autorisez Cloudflare à accéder à votre repository GitHub/GitLab

2. **Configuration du build** :
   - **Framework preset** : `None` (site statique)
   - **Build command** : (laisser vide)
   - **Build output directory** : `/` (racine)
   - **Root directory** : `/` (racine)

3. **Variables d'environnement** (si nécessaire) :
   - Aucune variable d'environnement requise pour ce projet

4. **Déploiement** :
   - Cloudflare Pages déploiera automatiquement à chaque push sur la branche principale
   - Vous recevrez une URL de type : `https://votre-projet.pages.dev`

### URLs des pages :

- Page principale (spreads) : `https://votre-projet.pages.dev/index.html`
- Page pages : `https://votre-projet.pages.dev/pages.html`

### Configuration personnalisée (optionnel) :

Si vous souhaitez utiliser un domaine personnalisé :
- Allez dans **Custom domains** dans les paramètres du projet
- Ajoutez votre domaine et suivez les instructions DNS

## Structure des données

Les prix sont chargés dynamiquement depuis un Google Sheet :
- `index.html` utilise le GID `619171879`
- `pages.html` utilise le GID `441790827`
- Les taux de change sont chargés depuis l'onglet "Devises" (GID `1246682262`)

Voir `GOOGLE_SHEET_STRUCTURE.md` pour plus de détails sur la structure attendue.

