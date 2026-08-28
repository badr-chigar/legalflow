# Prompt — ajouter les mécaniques « finies » de MyLegal à la vitrine LegalFlow

À coller dans la session Claude Code. On reprend de mylegal.ma : l'occupation
pleine largeur, un vrai logo, l'en-tête transparent qui se solidifie au scroll,
un système de couleurs plus présent, et une typo de titres plus affirmée.
On NE copie PAS leur bleu ni Inter — on reste sur les tokens de `design-system.md`
(Fraunces, ardoise #1F3A5F, laiton #B8863B, papier chaud #FBFAF7).
Voir `MYLEGAL_TEARDOWN.md` pour le détail de leur page.

Cible : la vitrine publique (`/` + pages `(marketing)`). Le back-office n'est pas concerné ici.

---

## 1. Pleine largeur (« il prend toute la page »)

- Chaque section a un **fond pleine largeur** (edge-to-edge) qui alterne :
  `bg-page` (#FBFAF7) / `bg-surface` (#FFFFFF) / une teinte `#F4F1EA` très légère.
  Séparation par un filet 1px `border-soft`, pas par du vide.
- Le CONTENU reste dans un conteneur centré, mais plus large :
  `mx-auto w-full max-w-[84rem] px-6 lg:px-12 2xl:max-w-[90rem]`.
- Éléments qui débordent volontairement plus large que le texte :
  - la carte « Dossier » du hero,
  - le **tableau comparatif** (pleine largeur du conteneur, `w-full`, colonnes réparties),
  - la bande de stats (« 10 j / 1 000+ / 0 »),
  - la bande CTA finale (fond ardoise **edge-to-edge**, contenu centré).
- Supprimer tous les `max-w-2xl` / `max-w-3xl` internes aux colonnes de contenu ;
  garder `max-w-[65ch]` uniquement sur les paragraphes de description.

## 2. Vrai logo (mark + wordmark)

Créer `components/brand/logo.tsx` — un SVG inline, pas d'image :
- **Mark** : une forme géométrique simple évoquant un document plié / un cachet /
  un flux. Ex. : un carré aux coins 2px avec un coin replié (dog-ear) + une barre
  horizontale = ligne signée. Trait 1.5px, `currentColor`, 20×20.
  Sobre, reconnaissable en petit, mono-chromatique.
- **Wordmark** : « LegalFlow » en Fraunces 600, `-0.01em` de tracking.
  « Legal » en `ink`, « Flow » en `brand-slate` (ou l'inverse) — un seul niveau de contraste.
- Props : `variant?: "full" | "mark"`, `className`.
- Utiliser dans `site-header.tsx` (full) et `site-footer.tsx` (full),
  et `mark` seul pour un favicon SVG (`app/icon.svg`).

## 3. En-tête transparent → solidifié au scroll

`components/marketing/site-header.tsx` (client component) :
- État initial (en haut de page) : `bg-transparent`, pas de bordure, pas d'ombre.
  Le hero doit donc avoir un fond clair (garder `bg-page`) pour que le logo/nav
  en `ink` restent lisibles.
- Au scroll > 8px : `bg-surface/85 backdrop-blur-md border-b border-border-soft`,
  transition `transition-[background,border] duration-200`.
- Implémentation : `useEffect` + `window.addEventListener("scroll", ...)` avec
  `requestAnimationFrame` / passive listener, ou un `IntersectionObserver` sur une
  sentinelle de 1px en haut du `<main>`. Nettoyer le listener au démontage.
- Header en `sticky top-0 z-50`, hauteur `h-16`.
- Respecter `prefers-reduced-motion` (pas de transition si réduit).
- Menu mobile : le panneau déroulant prend un fond plein `bg-surface` (jamais transparent).

## 4. Système de couleurs plus présent

- **Hero** : ajouter un lavis très discret en fond — un dégradé linéaire de
  `#FBFAF7` vers `#F4F1EA` (haut → bas) OU un aplat `#F4F1EA` sur toute la section
  hero, pour la détacher du reste. Pas de dégradé coloré.
- **Laiton assumé** : le numéro de section (01, 02…) en `brand-brass` **plus gros**
  (font-mono, 14px, à côté de l'eyebrow) ; le filet actif de la timeline hero en
  `brand-brass` ; un mot-clé par section-titre peut passer en `brand-slate` (jamais laiton).
- **États** : définir explicitement dans le thème / les composants —
  liens nav : `text-ink` → hover `text-brand-slate` + soulignement 1px `brand-brass` ;
  bouton primaire : `bg-brand-slate` → hover `bg-brand-slate-hover`, focus ring
  `ring-2 ring-brand-slate/40` ; bouton secondaire : `border-ink/20` → hover `border-ink/40`.
- **Bande CTA finale** : `bg-brand-slate` pleine largeur, texte `bg-page`,
  « sans engagement » en `brand-brass`.
- Footer : fond `#F4F1EA`, colonnes en `ink-muted`, titres de colonne en mono.

## 5. Typographie de titres plus affirmée (esprit MyLegal, exécution Fraunces)

- H1 hero : Fraunces `clamp(2.75rem, 5vw, 4rem)` (44→64px), poids 600,
  `leading-[1.05]`, `tracking-[-0.02em]`, `text-balance`.
- H2 de section : Fraunces `clamp(2rem, 3.2vw, 2.75rem)` (32→44px), poids 600,
  `leading-[1.1]`, `tracking-[-0.015em]`.
- Eyebrow : `font-mono text-xs uppercase tracking-[0.18em] text-ink-muted`,
  précédé du numéro en `brand-brass`.
- Paragraphes d'intro de section : `text-lg text-ink-muted max-w-[60ch] leading-[1.7]`.
- Ne PAS dépasser poids 600 sur les titres (pas de 700/800).

## 6. Détails repris de MyLegal (adaptés)

- **Preuve chiffrée dans le hero** : garder la ligne « + de 1 000 dossiers · Satisfait
  ou remboursé » mais l'ancrer avec un filet au-dessus, `font-mono text-xs`.
- **Maquette produit** : la carte « Dossier » du hero est notre équivalent de leur
  mock « CRÉATION SARL — Étape 1/4 ». La rendre un peu plus vivante : la barre de
  progression de statut avec l'étape courante en `brand-slate` pulsant très
  légèrement (ou pas d'animation si reduced-motion), 4 libellés dessous.
- **Boutons flottants** : un seul, discret, en bas à droite — « Aide » ou
  « Parler à un juriste » (lien vers `/contact`), `bg-brand-slate`, rond, 44px,
  apparaît après 400px de scroll. Pas de WhatsApp.
- **Header nav** : Création d'entreprise · Domiciliation · Tarifs · Guides · Contact
  + « Se connecter » (lien) + « Créer mon entreprise » (bouton plein) → `/creer`.

## 7. Vérification

- `npm run build` + `npm run lint` verts.
- Screenshots pleine page **1920** et **390** de `/`, plus un zoom sur l'en-tête
  en haut de page (transparent) ET après 200px de scroll (solidifié).
- Vérifier : aucune section ne laisse de bande blanche latérale ; le fond de
  section va bien d'un bord à l'autre ; le logo SVG s'affiche net en 20px et en 32px ;
  le header ne « saute » pas à la solidification (transition douce).
- `prefers-reduced-motion` : plus aucune animation.

Commence par le logo (§2) + l'en-tête transparent/solidifié (§3) + la pleine
largeur des sections (§1), montre un screenshot 1920 de `/` haut de page et après
scroll, puis on fait le reste.
