# Prompt — rendre LegalFlow déployable (backend Render + frontend Vercel)

À coller dans la session Claude Code. Objectif : que le recruteur ouvre une URL,
se connecte avec un compte démo, et fasse tout le parcours (créer un dossier,
ajouter un document, signer, changer le statut). Aucun secret en dur ; tout par
variables d'environnement.

Architecture cible :
- **Frontend** Next.js → Vercel (Root Directory = `frontend`).
- **Backend** Django REST → Render (Web Service + PostgreSQL gratuit).
- Le frontend appelle le backend **côté serveur** via ses route handlers
  (`/api/auth/*`) — l'URL du backend est une variable d'env Vercel.

---

## 1. Backend — dépendances (`requirements.txt`)

Ajouter :
```
gunicorn==23.0.0
whitenoise==6.8.2
dj-database-url==2.3.0
```

## 2. Backend — `config/settings.py`

- **Base de données** : si `DATABASE_URL` est présent (Render le fournit), l'utiliser
  via `dj_database_url.parse(env("DATABASE_URL"), conn_max_age=600, ssl_require=True)`.
  Sinon garder le fallback `POSTGRES_*` puis SQLite (dev local inchangé).
- **ALLOWED_HOSTS** : lire `DJANGO_ALLOWED_HOSTS` (déjà fait) et **ajouter
  automatiquement** `RENDER_EXTERNAL_HOSTNAME` s'il est défini (Render l'injecte).
- **Static** : insérer `whitenoise.middleware.WhiteNoiseMiddleware` juste après
  `SecurityMiddleware` ; `STORAGES["staticfiles"]["BACKEND"] =
  "whitenoise.storage.CompressedManifestStaticFilesStorage"`.
- **CORS** : `CORS_ALLOWED_ORIGINS` depuis env (déjà) ; ajouter aussi
  `CORS_ALLOWED_ORIGIN_REGEXES = [r"^https://.*\.vercel\.app$"]` pour couvrir les
  déploiements de preview.
- **CSRF_TRUSTED_ORIGINS** : lire une var `CSRF_TRUSTED_ORIGINS` (liste), y mettre
  l'URL Vercel de prod.
- **Sécurité prod** (si `DEBUG` est False) :
  `SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")`,
  `SECURE_SSL_REDIRECT = True`, `SESSION_COOKIE_SECURE = True`,
  `CSRF_COOKIE_SECURE = True`.
- Ne PAS changer le comportement en local (tout doit rester conditionné aux env vars).

## 3. Backend — script de build Render (`build.sh` à la racine, exécutable)

```bash
#!/usr/bin/env bash
set -o errexit
pip install -r requirements.txt
python manage.py collectstatic --no-input
python manage.py migrate
python manage.py seed_demo
```

## 4. Backend — commande de seed idempotente

`accounts/management/commands/seed_demo.py` :
- Crée si absents : `juriste.demo@legalflow.test` (rôle juriste) et
  `client.demo@legalflow.test` (rôle client), mot de passe `demo-passphrase-2026`.
- Crée 1–2 sociétés d'exemple pour le compte client + 1 document `statuts` en
  brouillon, pour que le dashboard ne soit pas vide.
- Réexécutable sans doublon (get_or_create). Affiche un résumé.
- (Prévoir aussi `accounts/management/__init__.py` et
  `accounts/management/commands/__init__.py`.)

## 5. Backend — `render.yaml` (blueprint à la racine)

```yaml
databases:
  - name: legalflow-db
    plan: free

services:
  - type: web
    name: legalflow-api
    runtime: python
    plan: free
    buildCommand: "./build.sh"
    startCommand: "gunicorn config.wsgi:application"
    healthCheckPath: /api/schema/
    envVars:
      - key: PYTHON_VERSION
        value: "3.11.9"
      - key: DJANGO_DEBUG
        value: "False"
      - key: DJANGO_SECRET_KEY
        generateValue: true
      - key: DATABASE_URL
        fromDatabase:
          name: legalflow-db
          property: connectionString
      - key: DJANGO_ALLOWED_HOSTS
        value: ".onrender.com"
      - key: CORS_ALLOWED_ORIGINS
        sync: false          # à renseigner avec l'URL Vercel après coup
      - key: CSRF_TRUSTED_ORIGINS
        sync: false
      - key: OTP_TTL_MINUTES
        value: "10"
      - key: OTP_MAX_ATTEMPTS
        value: "5"
```

## 6. Frontend — URL du backend

- Vérifier que `lib/api.ts` et les route handlers `app/api/auth/*` lisent
  `process.env.NEXT_PUBLIC_API_URL` (ou une var serveur dédiée `API_URL`).
  Si l'appel est **server-side uniquement**, préférer une var **sans**
  `NEXT_PUBLIC_` : `API_URL`, avec fallback sur `NEXT_PUBLIC_API_URL` puis
  `http://127.0.0.1:8000`.
- `frontend/.env.example` : documenter `API_URL=https://legalflow-api.onrender.com`.
- Pas de `vercel.json` nécessaire (Next.js auto-détecté). Root Directory Vercel = `frontend`.
- Bannière discrète en bas des pages publiques uniquement si `NODE_ENV !==
  "production"` — retirer toute mention d'URL d'API visible en prod.

## 7. Docs — `DEPLOY.md` à la racine

Rédiger un guide pas-à-pas :
1. **Render (backend)** : New + → Blueprint → connecter le repo → Render lit
   `render.yaml`, crée la base + le service. Après le 1er déploiement, noter l'URL
   `https://legalflow-api.onrender.com`.
2. **Vercel (frontend)** : New Project → importer le repo → Root Directory =
   `frontend` → var d'env `API_URL = https://legalflow-api.onrender.com` → Deploy.
   Noter l'URL `https://legalflow.vercel.app`.
3. **Boucler la config** : sur Render, renseigner
   `CORS_ALLOWED_ORIGINS = https://legalflow.vercel.app` et
   `CSRF_TRUSTED_ORIGINS = https://legalflow.vercel.app` → redeploy.
4. **Vérifier** : ouvrir l'URL Vercel, se connecter avec
   `juriste.demo@legalflow.test` / `demo-passphrase-2026`, faire le parcours complet.
5. Note : l'offre gratuite Render **met le service en veille** après ~15 min
   d'inactivité ; le premier appel après veille prend ~30 s. Le préciser au recruteur.

## 8. Vérification

- `npm run build` (frontend) + `pytest` (backend) toujours verts.
- `python manage.py check --deploy` : lister ce qui reste (acceptable en démo).
- `./build.sh` exécutable (`chmod +x` ; sous Windows, s'assurer que le fichier a
  des fins de ligne LF — ajouter `build.sh text eol=lf` dans `.gitattributes`).
- Commit : « Make deployable: Render blueprint, whitenoise, seed_demo, DEPLOY.md ».

Fais tout ça, commit, puis donne-moi le récap. Le déploiement lui-même (clics sur
Render et Vercel) est manuel — le guide `DEPLOY.md` le couvre.
