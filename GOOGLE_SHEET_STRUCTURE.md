# Structure Google Sheet pour Pricing Matrix

## Format CSV attendu

Le Google Sheet doit exporter un CSV avec les colonnes suivantes :
- **Section** : Numéro ou identifiant de section
- **Label** : Libellé du service
- **Type** : Type de tarification (`fixed`, `per_spread`, `per_page`, etc.)
- **Unit Price (USD)** : Prix unitaire en USD

## Table de conversion de devise

**Tous les prix dans le sheet sont en USD par défaut.** Pour activer la conversion vers d'autres devises, ajoutez une section dédiée dans votre Google Sheet :

| Section | Label | Type | Unit Price (USD) |
|---------|-------|------|-------------------|
| **EXCHANGE_RATES** | **AED** | (peu importe) | **3.67** |
| **EXCHANGE_RATES** | **EUR** | (peu importe) | **0.92** |

### Format de la table de conversion

- **Section** : Doit être exactement `EXCHANGE_RATES` (ou `EXCHANGE_RATE` ou `RATES`)
- **Label** : Code devise ISO (AED, EUR, GBP, JPY, CHF, CAD, AUD)
- **Type** : Peu importe (peut être vide)
- **Unit Price (USD)** : **Ratio de conversion** = nombre d'unités de la devise cible pour **1 USD**

**Exemple** : Si `AED = 3.67`, cela signifie **1 USD = 3.67 AED**
- Quand l'utilisateur sélectionne AED, tous les prix USD sont **multipliés par 3.67**

## Structure complète recommandée

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
9,English Proofreading,optional_per_spread,37
EXCHANGE_RATES,AED,,3.67
EXCHANGE_RATES,EUR,,0.92
```

## Notes importantes

- **Tous les prix dans le sheet sont en USD** (colonne "Unit Price (USD)")
- La table `EXCHANGE_RATES` permet de convertir ces prix USD vers d'autres devises
- Le taux de change est mis à jour automatiquement à chaque chargement de la page
- Si un taux n'est pas trouvé, la valeur par défaut est `1` (pas de conversion)
- USD est toujours la devise de base (taux = 1, pas besoin de le définir)

