# Prompt à coller dans ta session Claude Code (dossier legalflow/)

Assure-toi d'abord que les plugins sont actifs : `/plugin` → onglet Installed →
frontend-design, context7. Puis colle ce qui suit.

---

Lis d'abord le fichier `design-system.md` à la racine. Tu dois respecter STRICTEMENT
ses tokens (couleurs hex, polices, rayons, densité) et ses interdits.

Crée un frontend dans un dossier `frontend/` à la racine du projet :

STACK (identique à MyLegal, la boîte visée)
- Next.js (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- Client API centralisé qui parle à l'API Django REST déjà en place sur
  http://127.0.0.1:8000 (voir README.md et openapi-schema via /api/schema/)

CONFIG
- Variable d'env NEXT_PUBLIC_API_URL (défaut http://127.0.0.1:8000)
- Polices via next/font/google : Fraunces (titres), IBM Plex Sans (UI), IBM Plex Mono (mono)
- Thème Tailwind : mappe les couleurs de design-system.md sur des tokens nommés
  (brand-slate, brand-brass, ink, ink-muted, surface, page, border-soft, success, danger)

AUTH
- Page /login : email + mot de passe → POST /api/auth/login/ → stocke access + refresh
  (cookie httpOnly via route handler Next, PAS localStorage)
- Middleware Next : redirige vers /login si pas de token
- Refresh automatique sur 401 via POST /api/auth/refresh/
- Bouton déconnexion

ÉCRANS (back-office, barre latérale gauche fixe — voir §5 du design system)
1. /dashboard : 3 compteurs (sociétés, documents en attente, documents signés) + tableau
   des 5 derniers dossiers. Pas de hero.
2. /companies : tableau dense triable (raison sociale, forme, statut = pastille+libellé,
   date). Bouton « Nouvelle société » → formulaire (nom, forme juridique, capital).
   Actions par ligne : voir / éditer / supprimer (confirm).
3. /companies/[id] : détail éditable + liste des documents rattachés + bouton
   « Ajouter un document ».
4. /documents/[id] : détail du document + bloc signature :
   - bouton « Demander la signature » → POST .../request-signature/ (affiche le code
     otp_code_debug en dev, dans un encart mono)
   - champ code à 6 chiffres → POST .../verify-signature/ → passe le statut à « signé »
   - gère les codes retour : 400 code invalide, 410 expiré, 429 trop d'essais

EXIGENCES DESIGN
- Après CHAQUE écran généré, lance le skill avoid-ai-design sur les fichiers créés,
  applique ses corrections, et montre-moi un avant/après.
- Tableaux, pas grilles de cartes. Densité compacte. Rayons 6/10px. Aucune ombre
  sauf modales. Aucun dégradé. Fraunces pour les titres uniquement.
- Statuts toujours pastille + texte.

QUALITÉ
- Types TS pour toutes les réponses API (dérivés de openapi-schema.yml si possible via context7)
- Gestion des états loading / erreur / vide sur chaque écran
- README frontend/README.md : lancement, variables d'env, comment se connecter

Commence par le scaffolding + la config Tailwind/polices + le client API + /login,
puis arrête-toi pour que je vérifie avant les écrans suivants.
