# Analyse détaillée — page d'accueil mylegal.ma

Relevé fait le 2026-08-28 sur https://mylegal.ma (viewport 1440px).
Stack confirmée : Next.js 16 (App Router, Turbopack) · React · TypeScript ·
Tailwind CSS · shadcn/ui · hébergé Cloudflare.

---

## 1. Système visuel

### Couleurs
| Rôle | Valeur | Usage |
|---|---|---|
| Bleu primaire | `#1DABFC` (rgb 29,171,252) | boutons pleins, mots accentués dans les titres, eyebrows, icônes, coches |
| Encre | `#061A38` (rgb 6,26,56) | titres, texte fort |
| Texte secondaire | gris-bleu ~`#5B6B82` | paragraphes |
| Fond | `#FFFFFF` pur | base |
| Fond alterné | ~`#F8FAFC` à 40 % d'opacité | 1 section sur 2 |
| Bordure | `#E2E8F0` (slate-200 Tailwind — **défaut shadcn non modifié**) | cartes, table |
| Bandes sombres | dégradé navy | CTA final, carte footer |

`--radius: .5rem` (8px), `--ring: 221 83% 53%` (bleu) → **valeurs shadcn par défaut, non personnalisées**.

### Typographie — une seule police : **Inter** (variable)
| Élément | Taille | Graisse | Interligne | Interlettrage |
|---|---|---|---|---|
| H1 | 48px | 700 | 50,4px (1,05) | **-1,2px** |
| H2 section | 44px | 700 | 50,6px | **-1,1px** |
| Corps | 16px | 400 | 24px (1,5) | 0 |
| Eyebrow | 12px | 600 | — | +0,6px, UPPERCASE, bleu |
| Bouton | 14px | 600 | — | 0 |

→ Gros titres très bold + interlettrage négatif = **l'exact réglage SaaS moderne par défaut**.

### Boutons
- **Primaire** : fond `#1DABFC`, texte blanc, radius 8px, hauteur ~40px, padding `0 16px`, `shadow-sm`, 14px/600, souvent suivi d'une flèche `→`.
- **Secondaire** : fantôme / lien bleu avec flèche (« Découvrir nos offres → »).
- **Tertiaire** : lien texte.

### Header
- Sticky, **transparent** au-dessus du hero (pas de fond, pas de bordure, pas de flou), 58px.
- Logo : mot « MYLEGAL » + pictogramme chevron/montagne, bleu + navy.
- Nav : Accueil · Création d'entreprise · Domiciliation · Tarifs ▾ · Contact · Guides · Rejoignez-nous.
- Droite : « Se connecter » (fantôme) + « Créer mon entreprise » (bleu plein).
- **Fixes bas-droite** : bouton WhatsApp vert rond + bouton retour-haut.

---

## 2. Sections, dans l'ordre

### 1 — Hero (centré)
- Eyebrow pilule « PLATEFORME N°1 AU MAROC » (bleu, uppercase).
- H1 48px « Lancez et gérez votre société simplement. » — « simplement. » en bleu.
- Sous-titre gris : « Création d'entreprise, domiciliation à Casablanca et accompagnement juridique — tout pour votre société, dans une seule plateforme. »
- 2 CTA : « Créer mon entreprise → » (bleu) + « Découvrir nos offres → » (fantôme).
- Ligne de preuve : badge Google ★★★★★ + « Plus de 1000 entreprises accompagnées par MyLegal » + pilule « Satisfait ou remboursé ».
- Fond : léger lavis dégradé bleu clair en haut.

### 2 — Partenaires
- Eyebrow « NOS PARTENAIRES ».
- Rangée de logos institutionnels (OMPIC, Ministère de la Transition numérique, Tamwilcom, ADD…), horizontale, désaturés.

### 3 — Services (onglets)
- Eyebrow « TOUT CE QUE MYLEGAL FAIT POUR VOUS ». H2 44px « Une plateforme, **tous vos services**. »
- Barre d'onglets : **Création d'entreprise** (actif, soulignement bleu) · Domiciliation · Modification — chacun avec petite icône.
- Panneau actif :
  - Gauche : H3 « Créez votre société sans déplacement, sans paperasse. » + **grille 2×2** de 4 blocs (icône bleue + titre gras + texte gris) :
    Création 100 % en ligne · Accompagnement personnalisé · Prise en charge complète · Garantie anti-rejet.
    + bouton bleu « Créer mon entreprise → ».
  - Droite : **photographie** (mains signant un document, personne en orange), coins arrondis, + **pilule flottante** en overlay « → SANS DÉPLACEMENT / 100 % en ligne, depuis chez vous. » + motif pointillé décoratif derrière.

### 4 — Pourquoi nous faire confiance
- Eyebrow « POURQUOI NOUS FAIRE CONFIANCE ». H2 « La création d'entreprise, **sans friction**. »
- Sous-ligne : « Une plateforme pensée pour les entrepreneurs marocains et MRE qui veulent aller vite, sans sacrifier la conformité. »
- **4 cartes en rangée** : tuile d'icône bleu clair arrondie + titre gras + description grise.
  Simplicité · Fiabilité · Tarif transparent · Accompagnement.
  Cartes : bordure fine + ombre très légère, rayon ~12px.

### 5 — Comment ça marche
- Eyebrow « COMMENT ÇA MARCHE ». H2 « Les étapes de création de société. »
- Gauche : étapes **01 / 02 / 03 / 04** — pastille ronde bleue pleine avec le numéro + titre gras + description grise, liste verticale.
  (01 Vous renseignez vos informations · 02 Un juriste dédié vous accompagne · 03 Vous signez vos documents · 04 Votre société est créée)
- Droite : **photographie** (personne signant) + **maquette produit en overlay** : carte « ⚡ CRÉATION SARL — Étape 1/4 / Renseignez votre projet en quelques minutes / [SARL][SARLAU] (toggle segmenté) » + badge « ✦ SATISFAIT OU REMBOURSÉ ».
  + pilule sombre flottante « DÉLAI MOYEN / Société livrée en 10 jours ».
- CTA bleu « Démarrer maintenant → ».

### 6 — Domiciliation
- Eyebrow « DOMICILIATION » (icône épingle). H2 « Une adresse à Casablanca, sans louer de bureau. »
- Gauche : paragraphe + 3 points à coche bleue (Adresse de prestige · Gestion du courrier · Contrat conforme) + 2 CTA (« Domicilier ma société → » bleu + « Voir les tarifs » fantôme).
- Droite : **photographie** de l'immeuble de bureaux + petites cartes flottantes (adresse, « Quartier Maarif », « Bureau 304 », « Centre d'affaires moderne ») + motif pointillé.

### 7 — MRE & investisseurs
- Eyebrow « MRE ET INVESTISSEURS ». H2 « Créez votre société au Maroc, depuis n'importe où. »
- Gauche : paragraphe + **checklist 6 items** (coches bleues) + CTA bleu « Créer ma société à distance → ».
- Droite : **photographie** (homme en costume).

### 8 — Accompagnement personnalisé (côtés inversés)
- Eyebrow « ACCOMPAGNEMENT PERSONNALISÉ ». H2 « Un seul interlocuteur pour toutes vos formalités. »
- Gauche : **photographie** (poignée de main au bureau).
- Droite : paragraphe + 2 points à coche + CTA fantôme « Contacter l'équipe → ».

### 9 — Comparatif
- Eyebrow « MYLEGAL VS CABINET TRADITIONNEL ». H2 centré « Pourquoi nos clients ne reviennent pas en arrière. »
- Sous-titre centré.
- **Tableau** dans une carte arrondie : colonnes CRITÈRE / **MYLEGAL** (colonne teintée bleu clair) / CABINET TRADITIONNEL.
  6 lignes. MyLegal = pastilles rondes bleues pleines avec ✓ ; Cabinet = ✕ gris (une coche bleu clair pour « Documents conformes »).

### 10 — Témoignages
- Eyebrow « ILS NOUS FONT CONFIANCE ». H2 « Des entrepreneurs comme vous. »
- **3 cartes d'avis en rangée** : ★★★★★ bleues + citation grise + bas de carte : rond initiales (SA / AZ / DB) + nom + « Avis Google · il y a X mois ». Bordure + ombre légère.

### 11 — CTA final
- Eyebrow « UNE QUESTION ? » dans un **panneau navy en dégradé, arrondi** :
  H2 « Notre équipe vous répond rapidement. » + sous-titre + 2 boutons (bleu « Démarrer ma société → » + contour blanc « Contacter l'équipe »).

### 12 — Footer
- Fond bleu-gris clair.
- Gauche : logo MYLEGAL + tagline + contact (tél. +212 6 00 71 00 60, contact@mylegal.ma, adresse Oasis Offices Latitudes…).
- Colonnes « Liens utiles » (Accueil, Création d'entreprise, Domiciliation, Tarifs création, Tarifs domiciliation, Contact, Guides, Rejoignez-nous) + « Liens rapides » (Secteurs d'activités, Mentions légales, Politique de confidentialité, CGU).
- Droite : **carte navy** « Besoin d'être accompagné(e) ? / Ilyass et toute l'équipe MyLegal.ma sont là pour répondre à vos questions, en moyenne en moins d'une heure. » + photo.
- Bas : barre de copyright.

---

## 3. Interactions & motion
- Header sticky (transparent sur le hero, se solidifie probablement au scroll).
- Onglets cliquables dans « Services ».
- Boutons flottants fixes : WhatsApp + retour-haut.
- Apparitions au scroll (fade-up) sur les blocs.
- Cartes/pilules flottantes en overlay sur les photos.

## 4. Instrumentation marketing
GTM · Meta Pixel · TikTok Pixel · Google Ads (conversion) · Cloudflare RUM.
Site très orienté acquisition payante.

---

## 5. Ce qui marche (à garder / adapter dans LegalFlow)
1. **Proposition de valeur limpide** dès le H1, une phrase.
2. **Preuve immédiate** : note Google, « 1000+ entreprises », « Satisfait ou remboursé ».
3. **Maquette produit** dans « Comment ça marche » : on voit la vraie chose (Étape 1/4).
4. **Chiffres concrets** : « 10 jours », « Étape 1/4 ».
5. **Tableau comparatif** : traitement d'objection efficace (MyLegal vs cabinet).
6. **Thème « un seul interlocuteur / juriste dédié »** répété partout — rassure.
7. **Parcours linéaire** explicite 01→04.
8. **Photos** de personnes/bureaux réels — crédibilité pour un service juridique.
9. **Logos institutionnels** (OMPIC, ministère) = caution officielle.
10. Structure ultra-scannable, patterns standards = faible charge cognitive.

## 6. Ce qui fait générique (à battre — c'est là qu'on gagne le « x10 »)
1. **Police unique Inter** + interlettrage négatif sur gros titres bold = réglage SaaS par défaut.
2. **Bleu `#1DABFC`** = le piège du « bleu/indigo par défaut ».
3. **Grille de 4 cartes à icônes** (Pourquoi) — cas d'école.
4. **Tuiles d'icônes bleu clair arrondies**.
5. **shadcn non personnalisé** (`--radius .5rem`, bordures slate-200, `--ring` bleu).
6. **Motifs pointillés** derrière les images.
7. **Pilules flottantes** sur photos de stock.
8. **3 cartes témoignages** en rangée avec étoiles.
9. **Panneau CTA navy en dégradé**.
10. Rien dans la typo, la couleur ou la composition n'est spécifique au **juridique** ni au **Maroc** au-delà du texte. **Cache le logo → c'est n'importe quelle fintech.**

---

## 7. Traduction pour LegalFlow (notre parti pris)
| MyLegal | LegalFlow |
|---|---|
| Inter partout | **Fraunces** (titres, serif à caractère) + IBM Plex Sans + IBM Plex Mono |
| Bleu ciel #1DABFC | **Ardoise #1F3A5F** + laiton #B8863B en filets/numéros |
| Blanc pur | **Papier chaud #FBFAF7** |
| 4 cartes à icônes | **Listes à filets 2 colonnes** (titre sticky + contenu) |
| Tuiles d'icônes | **Schémas SVG au trait 1,5px** dessinés maison |
| Photos + pilules flottantes | **Carte « Dossier » avec timeline de statut** réelle |
| shadcn défaut | tokens `design-system.md`, radius 6/10px, filets 1px, une seule ombre |
| Motifs pointillés | rien de décoratif — la typo et les filets portent le design |
| 3 cartes témoignages étoilées | **pull-quotes pleine largeur**, filet laiton, initiales |
| CTA navy dégradé | **bande ardoise pleine largeur**, aplat, « sans engagement » en laiton |

On garde : proposition de valeur en une phrase, preuve chiffrée, maquette produit,
parcours 01→04, tableau comparatif, thème juriste dédié, pages Tarifs/Guides/Contact.
On change : toute l'exécution visuelle → registre éditorial-institutionnel, pas SaaS.
