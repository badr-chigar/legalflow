# LegalFlow — Système de design

> À lire AVANT de générer toute interface (page ou composant).
> Objectif : éviter le rendu générique « IA » (dégradés violets, Inter, cartes shadcn par défaut)
> ET ne pas cloner MyLegal (eux : bleu ciel #1DABFC + Inter). Même techno, identité propre.

## 0. Stack imposée (identique à MyLegal)

- **Next.js** (App Router) + **TypeScript**
- **Tailwind CSS** + **shadcn/ui**
- Consomme l'API Django REST de LegalFlow (JWT dans un header `Authorization: Bearer`)

## 1. Positionnement visuel

Ton : **institutionnel, précis, rassurant** — domaine juridique, mais outil de travail moderne.
Pas « cabinet poussiéreux », pas « landing SaaS générique ».
Références de direction : Qonto (neutralité, typo forte), Pennylane (densité lisible), Stripe Docs (hiérarchie, blanc).

## 2. Couleurs (hex — DÉFINITIF)

| Rôle | Hex | Usage |
|---|---|---|
| Primary | `#1F3A5F` | bleu ardoise profond — boutons principaux, en-têtes, liens actifs |
| Primary hover | `#16304F` | état survol |
| Accent | `#B8863B` | ocre/laiton sobre — badges « validé / signé » uniquement, jamais en aplat large |
| Encre | `#1A1D21` | texte principal |
| Encre secondaire | `#5B6470` | labels, métadonnées, texte d'aide |
| Fond page | `#FBFAF7` | blanc cassé chaud (PAS gris bleuté #F9FAFB) |
| Surface | `#FFFFFF` | cartes, panneaux, lignes de tableau |
| Bordure | `#E4E0D8` | 1px, discrète |
| Succès | `#2F7A55` | statut signé/validé |
| Erreur | `#B23B3B` | erreurs de formulaire |

Mode sombre : facultatif pour la v1, mais garder les tokens nommés pour l'ajouter plus tard.

**Interdits stricts :** dégradé violet→bleu, `indigo-500`, bleu ciel type MyLegal, `rounded-2xl` partout,
ombres portées molles génériques, `bg-gradient` décoratif.

## 3. Typographie (DÉFINITIF)

- **Titres** : `Fraunces` (serif à caractère, variable, via next/font/google) — PAS Inter/Roboto/Montserrat/Space Grotesk.
- **Texte / UI** : `IBM Plex Sans`.
- **Mono** (n° de dossier, montants, codes OTP) : `IBM Plex Mono`.
- Échelle : 13 / 14 / 16 / 20 / 28 / 40 px. Interlignage texte 1.6, titres 1.15.
- Titres en poids 600, jamais 800/900.

## 4. Espacement & formes

- Échelle 8px (4 pour micro-ajustements).
- Rayon : **6px** sur boutons/inputs, **10px** sur cartes. Rien au-dessus.
- Densité **compacte** : c'est un back-office, pas une page d'accueil.
- Bordures 1px nettes > ombres. Une seule ombre douce autorisée : les modales/popovers.

## 5. Composants — règles

- Boutons : plein (primary), contour (secondaire), lien (tertiaire). Pas de bouton « ghost » dégradé.
- Statuts (dossier, document) : **pastille colorée + libellé texte**, couleur = table §2. Jamais la couleur seule.
- **Tableaux avant cartes** : la liste des sociétés et des documents est un tableau dense, triable, pas une grille de cartes.
- Formulaires : label au-dessus du champ, texte d'aide dessous, erreur en `#B23B3B` + icône. Un champ par ligne.
- Navigation : barre latérale gauche fixe, fond `#FFFFFF`, item actif = fond `#F1EEE8` + barre `#1F3A5F` à gauche.
- Pas de hero. La page d'accueil connectée = tableau de bord (compteurs + derniers dossiers).

## 6. Checklist anti-slop (repasser avant chaque écran livré)

1. En cachant le logo, cet écran se distingue-t-il de MyLegal et de 2 autres concurrents ?
2. Chaque couleur / police / rayon vient-il de CE fichier ?
3. Zéro dégradé, zéro Inter, zéro grille de 3 cartes à icônes identiques, zéro section « Trusted by » ?
4. Le skill `avoid-ai-design` est-il passé et ses corrections intégrées ?
