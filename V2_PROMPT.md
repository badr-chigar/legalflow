# Prompt V2 — LegalFlow complet et fonctionnel

À coller dans la session Claude Code (dossier legalflow/). Le backend Django et le
scaffolding front existent déjà. Django tourne sur http://127.0.0.1:8000, Next sur :3000.

Deux objectifs, dans cet ordre :
1. **Tout fonctionne de bout en bout** : un visiteur crée un dossier, un client/juriste
   le traite dans l'espace admin (documents, signature OTP, validation, changement de statut).
2. **Design ambitieux** : une direction artistique forte et assumée, nettement au-dessus
   de la version actuelle (trop plate) ET distincte de MyLegal.

Lis `design-system.md` — les tokens restent la base. Mais le §5 « pas de hero » ne vise
que le back-office ; la vitrine a droit à une vraie mise en scène.

---

## PARTIE A — Fonctionnel (à faire EN PREMIER, ne pas passer au design avant)

### A1. Back-office : les vrais écrans (remplacer les placeholders)

**/dashboard** — 3 statistiques réelles (Fraunces, gros chiffres) :
sociétés (`GET /api/companies/` → count), documents en attente de signature,
documents signés. En-dessous, tableau des 5 dernières sociétés (nom, forme, statut
= pastille + libellé, date). Bouton « Nouvelle société ».

**/companies** — tableau dense triable : raison sociale, forme, capital, statut, date.
Recherche texte côté client. Bouton « Nouvelle société » → ouvre un formulaire
(nom, forme juridique en select, capital) → `POST /api/companies/` → redirige vers
`/companies/[id]`. Actions par ligne : Ouvrir · Supprimer (confirmation).

**/companies/[id]** — en-tête éditable (nom, forme, capital, statut). Le statut est
modifiable par juriste/admin via un select (`PATCH` : brouillon → en_revue → depose →
immatricule). En-dessous : liste des documents du dossier (`GET /api/documents/?company=<id>`
ou filtrer côté client), chacun avec son statut. Bouton « Ajouter un document »
(type de document en select) → `POST /api/documents/`.

**/documents/[id]** — détail du document + **bloc signature** :
- Si aucune demande en cours : bouton « Demander la signature »
  → `POST /api/documents/{id}/request-signature/` → afficher le champ
  `otp_code_debug` renvoyé, dans un encart mono clairement marqué « code de test (dev) ».
- Champ code à 6 chiffres (inputmode numeric) → `POST /api/documents/{id}/verify-signature/`.
- Gérer les réponses : 200 → document passe « signé » + toast succès ;
  400 `code_invalide`, 410 `expire`, 429 `trop_d_essais` → message clair.
- Après signature : afficher la date de signature, masquer le formulaire.

### A2. Parcours public de création — /creer

Route `/creer`, protégée (redirige vers `/login?next=/creer` si non connecté).
Formulaire multi-étapes (comme « CRÉATION SARL — Étape 1/4 » chez MyLegal) :
1. Projet : raison sociale souhaitée + forme juridique (SAS/SASU/SARL/EURL/SCI/MICRO)
2. Capital + informations société
3. Récapitulatif
4. Validation → `POST /api/companies/` puis, en option, création automatique d'un
   document `statuts` en brouillon (`POST /api/documents/`) → redirige vers
   `/companies/[id]` avec un toast « Dossier créé, un juriste va le prendre en charge ».
Barre de progression « Étape X/4 ». État conservé entre les étapes (useState, pas d'URL).

### A3. Tous les liens fonctionnels

Aucun bouton ne doit mener à un 404. Créer les pages secondaires (contenu réel,
même gabarit que la home, sobres) :
- `/tarifs` : 3 forfaits en tableau (Création / Création + domiciliation / Sur-mesure),
  lignes de prestations avec coches, CTA « Créer mon entreprise » → `/creer`.
- `/creation-entreprise` : page détaillée du service création (reprend les sections
  4 blocs + étapes + FAQ ciblée), CTA → `/creer`.
- `/domiciliation` : page service domiciliation, CTA → `/creer`.
- `/contact` : coordonnées + formulaire (nom, email, message) qui fait un
  `console.log` + toast « Message envoyé » (pas de backend mail — c'est une démo, l'indiquer).
- `/guides` : liste de 4–5 articles factices (titre + extrait + date), liens vers
  `/guides/[slug]` avec un corps d'article lorem crédible.
Header et footer : chaque lien pointe vers une page qui existe. CTA « Créer mon
entreprise » partout → `/creer`. « Se connecter » → `/login`.

### A4. Vérif fonctionnelle (à me livrer sous forme de tableau)

Scénario complet à exécuter et documenter :
login juriste → /creer → 4 étapes → société créée → /companies/[id] → ajouter un
document → /documents/[id] → demander signature → saisir le code → document signé →
retour /companies/[id] → passer le statut de la société à « depose » → /dashboard
montre les compteurs à jour.
+ vérifier : `/` et pages marketing accessibles sans login ; `/dashboard`, `/companies`,
`/creer` redirigent vers /login si anonyme ; `npm run build` et `npm run lint` verts.

---

## PARTIE B — Design (une fois la PARTIE A finie et vérifiée)

Charge le skill `frontend-design`. Analyse d'abord la page d'accueil de MyLegal
(mylegal.ma) : structure, hiérarchie, ce qui marche (parcours clair, preuve sociale,
délai chiffré) et ce qui fait générique (bleu ciel indigo, Inter, cartes à icônes,
carrousel de logos). On veut **mieux, pas pareil**.

### Direction artistique à tenir (choix ferme, pas un panachage)

**Registre : éditorial-institutionnel.** Une publication juridique sérieuse qui aurait
un très bon studio produit. Références mentales : Stripe (rigueur), Mercury (retenue),
un journal (hiérarchie typographique).

- **Typo** : exploiter Fraunces à fond — display 44–56px sur les ouvertures de section,
  optical sizing, poids 600, leading serré (1.05–1.15). IBM Plex Sans 15–16px, leading 1.6.
  Fort contraste de taille entre titre et corps. Les eyebrows en IBM Plex Mono, 12px,
  lettre-spacing large, en `ink-muted`.
- **Couleur** : fond `page` #FBFAF7 partout (papier chaud, pas blanc). Ardoise #1F3A5F
  pour le texte fort, les CTA pleins, les bandes. **Laiton #B8863B en filet et en
  numéro de section** (01 / 02 …), jamais en aplat large. Une seule bande sombre
  (#1F3A5F) : le CTA final.
- **Rythme** : sections `py-28` à `py-32`, séparées par un filet 1px `border-soft`.
  Largeur de lecture max 72ch pour les paragraphes. Grille 12 colonnes, contenu sur 6–8.
- **Éléments dessinés maison** (pas d'icônes Lucide par défaut) :
  - « Comment ça marche » = un vrai rail vertical : ligne continue, 4 nœuds numérotés
    en laiton, chaque étape avec un petit schéma SVG inline (dossier, juriste, signature,
    tampon RC) dessiné simplement au trait 1.5px, couleur `ink`.
  - Hero : garder le panneau « Compris dans le forfait » mais lui donner de la présence —
    un mini-aperçu de dossier avec une timeline de statut (Brouillon → En revue → Déposé
    → Immatriculé), l'étape courante en ardoise, les suivantes en `border-soft`.
  - Comparatif : tableau pleine largeur, en-tête collant, lignes alternées `#F1EEE8`/
    transparent, coche laiton vs tiret `ink-muted`, colonne LegalFlow légèrement mise en avant.
  - Témoignages : traitement pull-quote — citation en Fraunces 20px, generous, initiales
    dans un rond `#F1EEE8`, filet laiton au-dessus.
  - Stats : « 10 jours ouvrés », « 1 000+ dossiers », « 0 déplacement » en gros chiffres
    Fraunces sur une bande à filets.
- **Motion** (discret, `prefers-reduced-motion` respecté) : apparition en fondu +
  léger translateY au scroll pour les blocs de section ; labels de section qui restent
  collés en haut pendant le scroll de leur section.
- **Pas de** : dégradé, ombre portée (sauf le panneau hero et les toasts), Inter,
  grille de 3 cartes à icônes identiques, carrousel de logos, emoji, coins > 10px.

### Livrables design

- Home refaite selon la DA ci-dessus, section par section.
- Les pages secondaires alignées sur la même DA (plus sobres, moins de sections).
- Le back-office reste dans les tokens `design-system.md` (dense, filets, pas de fioriture)
  mais soigné : espacements cohérents, états hover/focus visibles, pastilles de statut
  propres, tableaux alignés.
- Screenshots pleine page (desktop 1440 + mobile 390) de : `/`, `/tarifs`,
  `/creation-entreprise`, `/dashboard`, `/companies/[id]`, `/documents/[id]`.
- Avant/après des corrections anti-slop.

---

## Ordre d'exécution

1. PARTIE A entière (A1 → A4), puis STOP : me montrer le tableau de vérif fonctionnelle
   + screenshots bruts des écrans back-office.
2. Après mon feu vert : PARTIE B.

Ne commence pas le design tant que le parcours « créer un dossier → le traiter →
le signer » ne marche pas réellement contre l'API.
