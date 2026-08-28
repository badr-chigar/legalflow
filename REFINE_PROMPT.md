# Prompt de raffinage — exploiter l'espace sur grand écran + resserrer le vertical

À coller dans la session Claude Code. Ne touche PAS aux tokens de `design-system.md`
ni à la direction artistique déjà en place (Fraunces display, laiton, filets, papier chaud).
C'est purement du **layout, de la densité et du responsive desktop**. La page publique `/`
et les pages secondaires sont concernées ; le back-office aussi (section 6).

## Problème constaté (capture 1920px)

- Le hero a une marge basse énorme : ~250px de vide entre les CTA et la trust bar,
  puis encore un trou avant « 01 SERVICES ».
- La colonne droite du hero (carte Dossier) ne descend pas assez ; déséquilibre.
- Les sections « Pourquoi », « Étapes », « Domiciliation », « Accompagnement », « FAQ »
  utilisent `max-w-3xl` → sur un écran large, toute la moitié droite est vide.
- Rien n'exploite les breakpoints `xl:` / `2xl:`.

## 1. Conteneur global

- Shell des sections : passer de `max-w-6xl` à `max-w-7xl` (1280px), padding
  `px-6 lg:px-10`. Centrer.
- Sur `2xl` (≥1536px) : `max-w-[88rem]`, pour respirer sans devenir illisible.
- Largeur de lecture des PARAGRAPHES : garder `max-w-[65ch]` — mais le paragraphe
  vit désormais DANS une colonne d'une grille, pas seul au milieu du vide (voir §3).

## 2. Hero

- Réduire le padding vertical : `py-16 lg:py-20` (au lieu de py-24/28). Supprimer
  toute marge/hauteur fixe qui crée le trou sous les CTA.
- Grille : `lg:grid-cols-[minmax(0,1fr)_26rem] gap-12 xl:gap-20`. La carte Dossier
  à droite, alignée en haut sur le H1 (pas sur l'eyebrow), et qui peut être un peu
  plus haute (ajouter 2 lignes : « Prochaine étape : signature des statuts » +
  « Délai estimé : 8 jours ouvrés »).
- Sous les CTA : la ligne de preuve (« + de 1 000 dossiers… ») directement, `mt-10`,
  pas de grand vide.
- La trust bar : coller au hero (`border-t`, `py-5`), pas de gros gap.

## 3. Sections de contenu — passer en 2 colonnes sur desktop

Pour CHAQUE section « Pourquoi », « Domiciliation », « Accompagnement », « MRE »,
« FAQ », « Services » :

- Grille `lg:grid-cols-[20rem_minmax(0,1fr)] gap-12 xl:gap-16`.
- Colonne GAUCHE (sticky sur `lg`, `lg:sticky lg:top-24 h-max`) : l'eyebrow numéroté
  + le H2 Fraunces + éventuellement une phrase d'intro. Reste visible pendant qu'on
  scrolle le contenu de la section.
- Colonne DROITE : le contenu (liste à filets, accordéon, checklist, tableau…),
  qui prend toute la largeur restante. Fini le `max-w-3xl` isolé.
- « Comment ça marche » garde son rail, mais dans la colonne droite ; la gauche
  devient le titre sticky.
- « Comparatif » : le tableau prend toute la largeur de la colonne droite
  (`w-full`), colonnes réparties, pas de `max-w-3xl`.

## 4. Espacement vertical entre sections

- Sections : `py-20 lg:py-24` (au lieu de py-28/32). Le filet 1px suffit à séparer,
  pas besoin de 128px de vide.
- Supprimer les `mt-10`/`mt-16` orphelins qui s'ajoutent au padding de section.

## 5. Stats, CTA final, footer

- Bande stats : 3 colonnes `sm:grid-cols-3`, chiffres alignés à gauche, la bande
  s'étend sur `max-w-7xl`.
- CTA final (bande ardoise) : contenu en 2 colonnes sur `lg` — accroche à gauche,
  boutons à droite alignés au centre vertical. Padding `py-16 lg:py-20`.
- Footer : 4 colonnes déjà OK ; les étaler sur `max-w-7xl`, ajouter une colonne
  « Contact » (email, téléphone fictif, « Lun–Ven 9h–18h »).

## 6. Back-office (dashboard, /companies, /companies/[id], /documents/[id])

- Le contenu ne doit plus être en colonne étroite : `max-w-7xl` + `px-6 lg:px-10`.
- `/dashboard` : les 3 stats sur une rangée pleine largeur `lg:grid-cols-3`,
  le tableau des derniers dossiers dessous en pleine largeur.
- `/companies/[id]` : layout 2 colonnes sur `lg` — `lg:grid-cols-[1fr_20rem]` :
  colonne principale = en-tête + documents ; colonne latérale = encart statut
  du dossier + métadonnées (créé le, propriétaire, forme).
- `/documents/[id]` : bloc signature dans une colonne de ~28rem à droite,
  détails du document à gauche.
- Tableaux : `w-full`, colonnes qui remplissent, pas de largeur max.

## 7. Divers

- `<body>` dans `app/layout.tsx` : ajouter `suppressHydrationWarning` (l'antivirus
  Bitdefender injecte des attributs `bis_skin_checked` / `__processed_…` qui
  déclenchent un warning d'hydratation inoffensif — c'est la façon propre de le taire).
- Vérifier qu'aucune section n'a de `min-h-screen` / `h-[…]` fixe résiduelle.
- `npm run build` + `npm run lint` verts.
- Screenshots pleine page à **1440** ET **1920** de : `/`, `/tarifs`, `/dashboard`,
  `/companies/[id]`. Montrer l'avant/après sur le vide vertical du hero.

Commence par le hero + les sections en 2 colonnes (§2, §3, §4), montre-moi un
screenshot 1920 de `/`, puis on fait le back-office (§6).
