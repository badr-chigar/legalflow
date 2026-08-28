# LegalFlow — Frontend

Interface back-office de LegalFlow. Next.js (App Router) + TypeScript + Tailwind
CSS v4. Consomme l'API Django REST du dépôt parent.

> Tokens visuels : voir `../design-system.md`. Aucune couleur / police / rayon
> ne doit être introduit hors de ce fichier.

## Prérequis

- Node 20+ (testé sur Node 24).
- L'API Django qui tourne sur `http://127.0.0.1:8000`
  (`python manage.py runserver` depuis la racine du dépôt).

## Lancement

```bash
cd frontend
npm install
cp .env.example .env.local        # copy sur Windows
npm run dev                        # http://localhost:3000
```

Autres scripts : `npm run build`, `npm run start`, `npm run lint`.

## Variables d'environnement

| Variable | Défaut | Rôle |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://127.0.0.1:8000` | Base de l'API Django. Utilisée **uniquement côté serveur** (route handlers Next, `proxy.ts`, composants serveur). |

Le navigateur n'appelle jamais l'API Django directement : il passe par les
routes `/api/auth/*` de Next, qui portent le token depuis un cookie httpOnly.
Aucune configuration CORS supplémentaire n'est donc requise côté Django.

## Se connecter

1. Créer un utilisateur côté API si besoin :

   ```bash
   # depuis la racine du dépôt
   python manage.py shell -c "from django.contrib.auth import get_user_model as g; \
   u=g().objects.create(email='client.demo@legalflow.test', role='client'); \
   u.set_password('demo-passphrase-2026'); u.save()"
   ```

2. Ouvrir `http://localhost:3000` → redirection vers `/login`.
3. Saisir l'e-mail + le mot de passe → redirection vers `/dashboard`.

## Authentification

| Élément | Fichier | Rôle |
|---|---|---|
| `POST /api/auth/login` | `app/api/auth/login/route.ts` | Authentifie auprès de Django, pose `lf_access` + `lf_refresh` en cookies **httpOnly** (jamais `localStorage`). |
| `POST /api/auth/refresh` | `app/api/auth/refresh/route.ts` | Rejoue le refresh token ; appelé par le client API sur `401`. |
| `POST /api/auth/logout` | `app/api/auth/logout/route.ts` | Efface les cookies de session. |
| Garde de session | `proxy.ts` (ex-`middleware.ts`, Next 16) | Redirige vers `/login` sans session ; rafraîchit l'access token en silence quand il a expiré ; renvoie vers `/dashboard` un utilisateur déjà connecté. |
| Client API | `lib/api.ts` | Seul point d'accès à l'API Django. Ajoute le `Bearer`, rejoue une fois après refresh sur `401`, lève `ApiError` (avec `.status` et `.detail`). |
| Cookies | `lib/auth.ts` | Helpers `getAccessToken` / `setSession` / `clearSession`. Durées alignées sur `SIMPLE_JWT` (30 min / 1 jour). |
| Types API | `lib/types.ts` | Types TS dérivés des serializers DRF (`accounts`, `companies`, `documents`). |

## Structure

```
app/
  login/                 écran de connexion (design-system.md)
  (app)/                  zone authentifiée
    layout.tsx           barre latérale gauche fixe + en-tête + déconnexion
    dashboard/           tableau de bord (placeholder — écran complet à venir)
    companies/           placeholder
    documents/           placeholder
  api/auth/              route handlers login / refresh / logout
components/
  ui/                    button, input, label, field (style shadcn, sans Radix)
  app-shell/             sidebar, logout-button
lib/                     api, auth, types, utils
proxy.ts                 garde de session (Edge)
app/globals.css          @theme Tailwind : tokens de design-system.md
```

## État d'avancement

Livré : scaffolding, thème Tailwind + polices (`next/font`), client API typé,
écran `/login` complet, boucle d'authentification de bout en bout, coquille
authentifiée (barre latérale + déconnexion).

À venir : `/dashboard` (compteurs + 5 derniers dossiers), `/companies`
(tableau + formulaire), `/companies/[id]`, `/documents/[id]` (cycle OTP).
