# Prompt — refonte de la page /login (et cohérence des écrans d'authentification)

À coller dans la session Claude Code. Respecter `design-system.md`
(Fraunces, ardoise #1F3A5F, laiton #B8863B, papier #FBFAF7, IBM Plex Sans/Mono).
Fichiers concernés : `app/login/page.tsx`, `app/login/login-form.tsx`, et le layout
d'auth si présent.

---

## Problèmes actuels

1. La ligne « API : http://127.0.0.1:8000 » s'affiche en bas de page → **à retirer**
   (ou la mettre en commentaire / derrière `process.env.NODE_ENV === "development"`
   dans un `<span>` visuellement discret hors flux).
2. Le panneau de gauche a du contenu seulement en haut → **grande zone vide**.
3. Le formulaire de droite flotte dans du blanc, pas centré verticalement.
4. Aucun lien de retour vers le site public, aucun lien « créer un compte / mon entreprise ».
5. Copy : « Statuts, M0, DNC » → termes français. Utiliser le vocabulaire marocain
   (« Statuts, procès-verbaux, registre des bénéficiaires effectifs »).

---

## 1. Structure — split écran plein hauteur

- `min-h-dvh grid lg:grid-cols-[1.1fr_1fr]`. Sur mobile : une seule colonne, le
  panneau de marque passe au-dessus, réduit.
- **Colonne gauche = panneau de marque**, fond `bg-brand-slate` (ardoise pleine),
  texte `bg-page`/blanc. C'est le seul écran où on assume un aplat sombre plein.
  Contenu centré verticalement (`flex flex-col justify-between p-10 lg:p-14`) :
  - En haut : le composant `<Logo variant="full" />` en blanc + petit lien
    « ← Retour au site » (vers `/`), discret, en `bg-page/70`.
  - Au centre : eyebrow mono « ESPACE PROFESSIONNEL » (en `brand-brass`) +
    titre Fraunces ~32px « Votre dossier, du premier acte à l'immatriculation. » +
    2 phrases. Puis une **mini-carte « Dossier »** reprise du hero (timeline
    Brouillon → En revue → Déposé → Immatriculée, sur fond `white/5`,
    bordure `white/15`, étape courante en `brand-brass`) — pour montrer le produit.
  - En bas : 3 lignes à filets `white/15` — « Sociétés · de la rédaction des statuts
    à l'immatriculation », « Documents · statuts, procès-verbaux, registre des
    bénéficiaires effectifs », « Signatures · validation par code à usage unique,
    horodatée ». Libellé en blanc, description en `bg-page/70`.
- **Colonne droite = formulaire**, fond `bg-page`, contenu centré
  (`flex items-center justify-center p-6 lg:p-10`), largeur `w-full max-w-sm`.

## 2. Formulaire

- Titre Fraunces « Connexion » (~28px) + sous-titre `text-ink-muted`
  « Accédez à votre espace avec vos identifiants LegalFlow. »
- Champs : label 13px `text-ink-muted` au-dessus, input `h-11 rounded-[6px]
  border-border-soft bg-surface px-3 text-[15px]`, focus `ring-2 ring-brand-slate/30
  border-brand-slate`. `autoComplete` correct (`email`, `current-password`).
- Lien « Mot de passe oublié ? » à droite du label mot de passe, `text-xs`,
  `text-brand-slate hover:underline` (page cible : un simple écran « Fonction non
  disponible sur la démo » ou un toast).
- Bouton `Se connecter` : pleine largeur, `bg-brand-slate hover:bg-brand-slate-hover`,
  `h-11`, état chargement (spinner + « Connexion… », disabled).
- **État d'erreur** : bandeau au-dessus du bouton, `border border-danger/40
  bg-danger/5 text-danger text-sm rounded-[6px] px-3 py-2`, message clair
  (« E-mail ou mot de passe incorrect. » pour un 401 ; message générique sinon).
- Sous le bouton, séparés par un filet : 
  « Pas encore de dossier ? **Créer mon entreprise** » (lien vers `/creer`).
- **Encart démo** (uniquement si `NODE_ENV === "development"`) : petit bloc
  `bg-[#F1EEE8] border border-border-soft rounded-[6px] p-3 text-xs font-mono` :
  « Démo — client.demo@legalflow.test / juriste.demo@legalflow.test ·
  mot de passe : demo-passphrase-2026 ». Retiré en production.

## 3. Détails

- Retirer toute ligne « API : … » visible.
- `<title>` : « Connexion — LegalFlow ».
- Redirection : si déjà connecté → `/dashboard` (déjà géré par `proxy.ts`, vérifier).
- Après succès : rediriger vers `?next=` s'il existe, sinon `/dashboard`.
- Accessibilité : `<form>` avec `aria-describedby` sur l'erreur, `<label htmlFor>`
  reliés, focus visible, le bandeau d'erreur `role="alert"`.
- `prefers-reduced-motion` : pas d'animation sur le spinner (rotation simple OK).
- Mobile (<`lg`) : panneau de marque réduit à logo + titre + 1 phrase, pas la
  mini-carte ni les 3 lignes ; formulaire dessous.

## 4. Cohérence

Appliquer le même gabarit (panneau ardoise à gauche, form à droite) à la page
`/creer` quand l'utilisateur n'est pas connecté et est redirigé vers login —
et vérifier que le wizard `/creer` lui-même garde son plein écran sans sidebar.

## 5. Vérification

- `npm run build` + `npm run lint` verts.
- Screenshots 1440 + 390 de `/login`, état normal ET état erreur (mauvais mot de passe).
- Vérifier : plus de zone vide sur la gauche, form centré verticalement,
  lien retour + lien créer visibles, aucune ligne de debug.
