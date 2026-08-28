# LegalFlow — Système de design

> Fichier à lire AVANT de générer toute interface (page ou composant).
> Objectif : éviter le rendu générique « IA » (dégradés violets, Inter, cartes shadcn par défaut).
> Les valeurs ci-dessous sont un **point de départ à valider par Badr** — remplace ce qui ne te convient pas.

## 1. Positionnement visuel

Ton : **institutionnel mais moderne** — on inspire confiance (domaine juridique) sans faire
« cabinet d'avocats poussiéreux ». Références de direction (à confirmer) :
- Pennylane (SaaS compta FR) — dense, sérieux, lisible
- Qonto — neutralité, typographie forte, peu de couleur
- Stripe Docs — hiérarchie, blanc, accents parcimonieux

## 2. Couleurs (hex — À VALIDER)

| Rôle | Hex | Usage |
|---|---|---|
| Primary | `#1F3A5F` | bleu ardoise profond — actions principales, en-têtes |
| Primary hover | `#16304F` | |
| Accent | `#C8A24B` | doré sobre — badges « validé / signé », jamais en aplat large |
| Encre | `#1A1D21` | texte |
| Encre secondaire | `#5B6470` | labels, méta |
| Fond | `#FBFAF7` | fond de page (blanc cassé chaud, PAS gris bleuté) |
| Surface | `#FFFFFF` | cartes, panneaux |
| Bordure | `#E4E0D8` | 1px, discrète |
| Succès | `#2F7A55` | |
| Erreur | `#B23B3B` | |

**Interdits :** dégradé violet→bleu, `indigo-500`, `rounded-2xl` partout, ombres portées molles génériques.

## 3. Typographie (À VALIDER)

- **Titres** : `Fraunces` (serif à caractère) ou `Libre Franklin` — PAS Inter/Roboto/Space Grotesk.
- **Texte** : `Source Sans 3` ou `IBM Plex Sans`.
- **Mono** (numéros de dossier, montants) : `IBM Plex Mono`.
- Échelle : 14 / 16 / 20 / 28 / 40. Interlignage texte 1.6.

## 4. Espacement & formes

- Échelle 8px (4 pour les micro-ajustements).
- Rayon : **6px** sur les éléments interactifs, **10px** sur les cartes. Rien de plus.
- Densité : **plutôt compacte** — c'est un outil de travail, pas une landing page.
- Bordures 1px nettes plutôt qu'ombres. Une seule ombre discrète autorisée pour les modales.

## 5. Composants — règles

- Boutons : plein (primary), contour (secondaire), texte (tertiaire). Pas de bouton « fantôme » dégradé.
- Statuts de dossier : pastille + libellé, couleur = table ci-dessus. Jamais juste une couleur.
- Tableaux avant cartes : la liste des sociétés / documents est un tableau dense triable.
- Formulaires : label au-dessus, aide sous le champ, erreur en rouge encre + icône.

## 6. Checklist anti-slop (à repasser avant chaque livraison d'écran)

1. En cachant le logo, cet écran est-il distinguable de 3 concurrents ?
2. Chaque couleur / police / rayon vient-il de CE fichier ?
3. Zéro dégradé violet, zéro hero « Transformez votre business », zéro grille 3 icônes identiques ?
4. Le skill `avoid-ai-design` est-il passé et ses corrections intégrées ?
