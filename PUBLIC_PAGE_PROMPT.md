# Prompt à coller dans ta session Claude Code (après les écrans back-office)

Objectif : ajouter une **page publique « client »** au frontend Next.js, qui reprend
TOUTES les sections de la page d'accueil de MyLegal (mylegal.ma) mais refaite avec
NOTRE système de design et notre angle éditorial. On garde le back-office (dashboard,
sociétés, documents) tel quel.

C'est l'exercice « on refait leur page, notre design, notre point de vue » — pas un
clone visuel. Même promesse métier, exécution différente.

---

## 0. Lecture obligatoire

Lis `design-system.md` à la racine. Respecte STRICTEMENT ses tokens (couleurs hex,
polices Fraunces / IBM Plex Sans, rayons 6/10px, densité, interdits).

**Exception au §5 « Pas de hero » :** cette règle vise le back-office connecté.
La page publique PEUT avoir un hero — mais distinctif, pas le hero générique
« Transformez votre business » centré + 3 cartes. Hero éditorial : titre Fraunces
fort à gauche, sous-titre, 2 boutons, une ligne de preuve. Pas de dégradé, pas
d'illustration SaaS générique.

## 1. Routing

- `/` = page publique (marketing), **pas d'authentification**. Le middleware / `proxy.ts`
  ne doit PAS protéger `/`, `/tarifs`, `/creation-entreprise`, `/domiciliation`,
  `/contact`, `/login`.
- `/dashboard`, `/companies`, `/documents` restent protégés.
- Structure : `app/(marketing)/page.tsx` + `app/(marketing)/layout.tsx`
  (header public + footer public), séparé de `app/(app)/layout.tsx`.

## 2. Header public

Logo « LegalFlow » (wordmark Fraunces). Nav : Création d'entreprise · Domiciliation ·
Tarifs · Guides · Contact. À droite : lien « Se connecter » (vers /login) + bouton
plein « Créer mon entreprise » (vers /creer ou /login).
Barre fine, fond surface `#FFFFFF`, bordure basse 1px `#E4E0D8`. Sticky.

## 3. Sections de la page `/` (dans cet ordre — équivalents des 13 sections MyLegal)

1. **Hero** — eyebrow mono « Accompagnement juridique · 100% en ligne » ;
   H1 Fraunces « Créez et pilotez votre société sans passer par le guichet. » ;
   sous-titre (création, domiciliation, secrétariat juridique en une plateforme) ;
   bouton plein « Créer mon entreprise » + bouton contour « Voir les tarifs » ;
   ligne de preuve « + de 1 000 dossiers accompagnés · Satisfait ou remboursé ».
2. **Bandeau confiance** — au lieu d'un carrousel de logos : une ligne sobre de
   4–5 mentions (« Statuts rédigés par des juristes », « Signature électronique
   conforme », « Forfait tout inclus », « Suivi en temps réel »). Filet 1px, pas de cartes.
3. **Services** — titre « Une plateforme, trois services. » ; 3 entrées
   (Création d'entreprise / Domiciliation / Secrétariat juridique) en **onglets**
   ou en **liste-accordéon** (pas 3 cartes à icônes identiques). Sous « Création » :
   4 points — Procédure 100% en ligne · Juriste dédié · Prise en charge A→Z
   (certificat négatif, statuts, RC, IF, ICE, CNSS) · Garantie anti-rejet.
3. **Pourquoi nous** — « La création d'entreprise, sans friction. » ; 4 piliers
   en **tableau 2 colonnes** ou liste à filets (Simplicité, Fiabilité, Tarif
   transparent, Accompagnement) — description en 1 phrase chacun. Pas de grille de cartes.
4. **Comment ça marche** — « Les étapes, du nom à l'immatriculation. » ;
   4 étapes numérotées 01→04 en **timeline verticale à filets** (numéro en mono,
   titre Fraunces, 1 phrase). À côté : petite carte « Délai moyen · société livrée
   en 10 jours ouvrés » (seule ombre autorisée : cette carte peut être plate aussi).
5. **Domiciliation** — « Une adresse professionnelle, sans louer de bureau. » ;
   3 avantages en liste à filets (Adresse reconnue · Gestion du courrier scannée ·
   Contrat conforme sous 24 h) ; 2 boutons (Domicilier ma société / Voir les tarifs).
6. **MRE & investisseurs** — « Créez votre société au Maroc, depuis n'importe où. » ;
   checklist de 6 items (✓ en `#2F7A55`, pas d'emoji) ; 1 bouton.
7. **Accompagnement** — « Un seul interlocuteur pour toutes vos formalités. » ;
   2 lignes (joignable WhatsApp / e-mail / téléphone · suivi jusqu'au RC) ; 1 bouton contour.
8. **Comparatif** — « Le même résultat juridique, sans les rendez-vous. » ;
   **vrai tableau** `<table>` : colonne Critère / LegalFlow / Cabinet traditionnel,
   6 lignes (démarches en ligne, tarif annoncé, suivi temps réel, délai en jours,
   documents conformes, domiciliation incluse). Coches `#2F7A55` / tirets `#5B6470`.
9. **Témoignages** — « Des entrepreneurs comme vous. » ; 3 avis en blocs citation
   sobres (texte, initiales dans un rond `#F1EEE8`, nom, « Avis vérifié »). Invente
   3 témoignages crédibles et neutres (projet démo — ne pas copier ceux de MyLegal).
10. **FAQ** — 5 questions en accordéon (délai réel, prix, documents fournis,
    domiciliation obligatoire ?, remboursement).
11. **CTA final** — « Une question avant de vous lancer ? » ; 2 boutons
    (Créer mon entreprise / Contacter l'équipe). Bande fond `#1F3A5F`, texte blanc,
    accent laiton `#B8863B` autorisé ici sur un mot.
12. **Footer** — 4 colonnes de liens (Services / Ressources / Entreprise / Légal),
    ligne du bas : « LegalFlow — projet de démonstration. Non affilié à un cabinet
    d'avocats. » + année.

## 4. Contenu

Projet démo → rédige une copy française crédible de legaltech, neutre, sans nom de
personne réel, sans logo de tiers. Garde les mêmes promesses métier que MyLegal
(100% en ligne, juriste dédié, forfait tout inclus, garantie anti-rejet,
domiciliation, MRE, comparatif cabinet). Ton institutionnel et précis, pas
« growth hacker ».

## 5. Anti-slop — obligatoire

Après avoir généré la page, lance le skill `frontend-design` (et `avoid-ai-design`
s'il est installé), applique les corrections, montre un avant/après.
Vérifie la checklist `design-system.md` §6 :
- Cache le logo : la page se distingue-t-elle de mylegal.ma et de 2 concurrents ?
- Zéro dégradé, zéro Inter, zéro grille de 3 cartes à icônes identiques,
  zéro carrousel de logos « Trusted by ».
- Tableaux et listes à filets plutôt que cartes partout.
- Fraunces sur les titres uniquement, poids 600 max.

## 6. Vérification

- `npm run build` vert, `npm run lint` vert.
- Ouvre `/` sans être connecté → la page s'affiche (pas de redirection /login).
- Ouvre `/dashboard` sans être connecté → toujours redirigé vers /login.
- Screenshot pleine page de `/` (desktop + mobile 375px) pour revue.

Commence, puis arrête-toi après la page `/` complète pour que je vérifie avant
les pages secondaires (/tarifs, /creation-entreprise, /domiciliation).
