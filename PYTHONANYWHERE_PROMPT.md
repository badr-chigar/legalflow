# Prompt — déploiement gratuit sans carte : PythonAnywhere (backend) + Vercel (frontend)

À coller dans la session Claude Code. Objectif : un déploiement **entièrement
fonctionnel** (login + parcours complet) **sans aucune carte bancaire**.
Backend Django sur PythonAnywhere (compte gratuit, disque persistant → SQLite),
frontend Next.js sur Vercel (Hobby, sans carte).

Ne casse rien en local : tout reste conditionné aux variables d'environnement.

---

## 1. Rien à changer dans le code backend

`config/settings.py` retombe déjà sur SQLite quand ni `DATABASE_URL` ni
`POSTGRES_DB` ne sont définis. Sur PythonAnywhere on ne les définit pas → SQLite,
qui persiste sur leur disque. `gunicorn`/`whitenoise`/`dj-database-url` déjà dans
`requirements.txt` ne gênent pas (whitenoise sert les statiques, utile ici).

Vérifier seulement : `SECURE_SSL_REDIRECT`, `SESSION_COOKIE_SECURE`,
`CSRF_COOKIE_SECURE` sont bien gardés derrière `if not DEBUG` **et** que
`SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")` est présent (il
l'est) — sinon boucle de redirection derrière le proxy PythonAnywhere.

## 2. Écrire `DEPLOY_PYTHONANYWHERE.md` à la racine

Guide pas-à-pas, à suivre par Badr :

### A. Créer le compte
- pythonanywhere.com → **Pricing & signup** → **Create a Beginner account** (gratuit,
  aucune carte). Nom d'utilisateur = ex. `badrchigar` → le domaine sera
  `https://badrchigar.pythonanywhere.com`.

### B. Cloner le repo (onglet **Consoles** → **Bash**)
```bash
git clone https://github.com/badr-chigar/legalflow.git
cd legalflow
python3.11 -m venv .venv
./.venv/bin/pip install --upgrade pip
./.venv/bin/pip install -r requirements.txt
```

### C. Fichier `.env` (dans `~/legalflow/.env`)
```bash
cat > .env <<'EOF'
DJANGO_SECRET_KEY=REMPLACER_PAR_UNE_CLE_64_CARACTERES
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=badrchigar.pythonanywhere.com
CORS_ALLOWED_ORIGINS=https://legalflow.vercel.app
CSRF_TRUSTED_ORIGINS=https://legalflow.vercel.app
OTP_TTL_MINUTES=10
OTP_MAX_ATTEMPTS=5
EOF
```
Générer la clé : `./.venv/bin/python -c "import secrets;print(secrets.token_urlsafe(64))"`
puis la coller dans `.env`. (L'URL Vercel exacte sera connue à l'étape E — revenir
mettre à jour `CORS_ALLOWED_ORIGINS` et `CSRF_TRUSTED_ORIGINS` et recharger.)

### D. Base + statiques + comptes démo
```bash
./.venv/bin/python manage.py migrate
./.venv/bin/python manage.py seed_demo
./.venv/bin/python manage.py collectstatic --no-input
```

### E. Créer la Web App (onglet **Web**)
- **Add a new web app** → domaine par défaut → **Manual configuration** →
  **Python 3.11**.
- **Source code** : `/home/badrchigar/legalflow`
- **Working directory** : `/home/badrchigar/legalflow`
- **Virtualenv** : `/home/badrchigar/legalflow/.venv`
- **WSGI configuration file** (cliquer le lien pour l'éditer) : remplacer tout le
  contenu par :
  ```python
  import os, sys
  path = "/home/badrchigar/legalflow"
  if path not in sys.path:
      sys.path.insert(0, path)
  os.environ["DJANGO_SETTINGS_MODULE"] = "config.settings"
  from django.core.wsgi import get_wsgi_application
  application = get_wsgi_application()
  ```
- **Static files** : ajouter une entrée
  URL `/static/`  →  Directory `/home/badrchigar/legalflow/staticfiles`
- **Media files** : URL `/media/`  →  `/home/badrchigar/legalflow/media`
- Cliquer **Reload**.
- Tester : `https://badrchigar.pythonanywhere.com/api/docs/` doit afficher Swagger.

### F. Maintenance
- Le compte gratuit affiche « Your web app will be disabled on … » → cliquer
  **Run until 3 months from today** de temps en temps.
- Pour redéployer après un push : Bash → `cd ~/legalflow && git pull &&
  ./.venv/bin/pip install -r requirements.txt && ./.venv/bin/python manage.py migrate
  && ./.venv/bin/python manage.py collectstatic --no-input` → onglet Web → **Reload**.

## 3. Frontend sur Vercel

Dans `DEPLOY_PYTHONANYWHERE.md`, section finale :
- vercel.com → **Add New → Project** → importer `badr-chigar/legalflow`.
- **Root Directory** : `frontend`.
- **Environment Variables** :
  `API_URL` = `https://badrchigar.pythonanywhere.com`
- **Deploy**. Noter l'URL (ex. `https://legalflow.vercel.app`).
- Retourner sur PythonAnywhere : mettre cette URL dans `.env`
  (`CORS_ALLOWED_ORIGINS`, `CSRF_TRUSTED_ORIGINS`) → Bash → onglet Web → **Reload**.

## 4. Vérification finale (à documenter dans le guide)

- `https://badrchigar.pythonanywhere.com/api/docs/` → Swagger OK.
- `https://legalflow.vercel.app` → vitrine OK, `/login` → connexion
  `juriste.demo@legalflow.test` / `demo-passphrase-2026` → dashboard.
- Parcours complet : `/creer` (4 étapes) → société créée → document → demande de
  signature → saisie du code → document signé → changement de statut → dashboard à jour.
- `npm run build` (frontend) + `pytest` (backend) toujours verts en local.

## 5. E-mail au recruteur (bloc à ajouter dans le guide)

- Démo live : `https://legalflow.vercel.app`
  identifiants : `juriste.demo@legalflow.test` / `demo-passphrase-2026`
- Code + tests : `https://github.com/badr-chigar/legalflow` (`pytest` = 11 tests)
- Note : hébergement gratuit — le backend peut mettre ~5 s à répondre au premier
  appel s'il était en veille.

Commit : « Add PythonAnywhere + Vercel deploy guide (no card, SQLite persistent) ».
