# Déployer LegalFlow — sans carte bancaire

**Backend Django** → PythonAnywhere (compte *Beginner* gratuit, disque
persistant → SQLite).
**Frontend Next.js** → Vercel (*Hobby*, sans carte).

Le frontend n'appelle jamais le backend depuis le navigateur : ses route
handlers (`/api/auth/*`), le proxy et les composants serveur l'appellent
**côté serveur**. L'URL du backend est la variable `API_URL` sur Vercel.

> Les exemples utilisent le nom d'utilisateur `badrchigar` → domaine
> `https://badrchigar.pythonanywhere.com`. Remplacer partout si besoin.

---

## 0. Rien à changer dans le code

`config/settings.py` retombe sur **SQLite** quand ni `DATABASE_URL` ni
`POSTGRES_DB` ne sont définis — sur PythonAnywhere on ne les définit pas, et
`db.sqlite3` persiste sur leur disque. Les réglages de sécurité prod
(`SECURE_SSL_REDIRECT`, `SESSION_COOKIE_SECURE`, `CSRF_COOKIE_SECURE`) sont
gardés derrière `if not DEBUG`, et `SECURE_PROXY_SSL_HEADER =
("HTTP_X_FORWARDED_PROTO", "https")` évite la boucle de redirection derrière
le proxy TLS de PythonAnywhere. `whitenoise` sert les fichiers statiques.

---

## 1. Backend — PythonAnywhere

### A. Créer le compte

1. [pythonanywhere.com](https://www.pythonanywhere.com/) → **Pricing & signup**
   → **Create a Beginner account** (gratuit, aucune carte).
2. Choisir un nom d'utilisateur (ex. `badrchigar`). Le domaine sera
   `https://badrchigar.pythonanywhere.com`.

### B. Cloner le dépôt — onglet **Consoles → Bash**

```bash
git clone https://github.com/badr-chigar/legalflow.git
cd legalflow
python3.11 -m venv .venv
./.venv/bin/pip install --upgrade pip
./.venv/bin/pip install -r requirements.txt
```

### C. Fichier `.env` — dans `~/legalflow/.env`

Générer d'abord une clé secrète :

```bash
./.venv/bin/python -c "import secrets; print(secrets.token_urlsafe(64))"
```

Puis créer le fichier (coller la clé à la place de la valeur ci-dessous) :

```bash
cat > .env <<'EOF'
DJANGO_SECRET_KEY=COLLER_LA_CLE_GENEREE_ICI
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=badrchigar.pythonanywhere.com
CORS_ALLOWED_ORIGINS=https://legalflow.vercel.app
CSRF_TRUSTED_ORIGINS=https://legalflow.vercel.app
OTP_TTL_MINUTES=10
OTP_MAX_ATTEMPTS=5
EOF
```

> L'URL Vercel exacte n'est connue qu'à l'**étape 2**. Revenir alors éditer
> `CORS_ALLOWED_ORIGINS` et `CSRF_TRUSTED_ORIGINS`, puis **Reload** la web app.

### D. Base de données + statiques + comptes de démo

```bash
./.venv/bin/python manage.py migrate
./.venv/bin/python manage.py seed_demo
./.venv/bin/python manage.py collectstatic --no-input
```

`seed_demo` est idempotent : il crée les comptes
`juriste.demo@legalflow.test` et `client.demo@legalflow.test`
(mot de passe `demo-passphrase-2026`), deux sociétés d'exemple pour le
compte client et un document `statuts` en brouillon.

### E. Créer la Web App — onglet **Web**

1. **Add a new web app** → accepter le domaine par défaut →
   **Manual configuration** → **Python 3.11**.
2. Renseigner :
   - **Source code** : `/home/badrchigar/legalflow`
   - **Working directory** : `/home/badrchigar/legalflow`
   - **Virtualenv** : `/home/badrchigar/legalflow/.venv`
3. **WSGI configuration file** (cliquer le lien pour l'éditer) — remplacer
   **tout** le contenu par :

   ```python
   import os, sys

   path = "/home/badrchigar/legalflow"
   if path not in sys.path:
       sys.path.insert(0, path)

   os.environ["DJANGO_SETTINGS_MODULE"] = "config.settings"

   from django.core.wsgi import get_wsgi_application

   application = get_wsgi_application()
   ```

4. **Static files** — ajouter une entrée :
   | URL | Directory |
   |---|---|
   | `/static/` | `/home/badrchigar/legalflow/staticfiles` |
   | `/media/`  | `/home/badrchigar/legalflow/media` |

5. Cliquer **Reload**.
6. Tester : `https://badrchigar.pythonanywhere.com/api/docs/` doit afficher
   Swagger, et `/api/schema/` doit renvoyer `200`.

### F. Maintenance

- Le bandeau *« Your web app will be disabled on … »* apparaît toutes les
  trois semaines : cliquer **Run until 3 months from today**.
- **Redéployer après un `git push`** — Bash :

  ```bash
  cd ~/legalflow && git pull \
    && ./.venv/bin/pip install -r requirements.txt \
    && ./.venv/bin/python manage.py migrate \
    && ./.venv/bin/python manage.py collectstatic --no-input
  ```

  puis onglet **Web → Reload**.

---

## 2. Frontend — Vercel

1. [vercel.com](https://vercel.com/) → **Add New → Project** → importer
   `badr-chigar/legalflow`.
2. **Root Directory** : `frontend` (Next.js auto-détecté, pas de `vercel.json`).
3. **Environment Variables** :
   | Name | Value |
   |---|---|
   | `API_URL` | `https://badrchigar.pythonanywhere.com` |
4. **Deploy**. Noter l'URL, du type `https://legalflow.vercel.app`.
5. **Boucler la config** : retourner sur PythonAnywhere, mettre cette URL
   dans `~/legalflow/.env` (`CORS_ALLOWED_ORIGINS` **et**
   `CSRF_TRUSTED_ORIGINS`) → onglet **Web → Reload**.

> Les déploiements de *preview* Vercel (`*.vercel.app`) sont déjà couverts
> par `CORS_ALLOWED_ORIGIN_REGEXES` dans `settings.py`.

---

## 3. Vérification finale

- `https://badrchigar.pythonanywhere.com/api/docs/` → Swagger s'affiche.
- `https://legalflow.vercel.app` → la vitrine s'affiche ;
  `/login` → connexion `juriste.demo@legalflow.test` /
  `demo-passphrase-2026` → tableau de bord.
- **Parcours complet** : `/creer` (4 étapes) → société créée → fiche société
  → « Ajouter un document » → ouvrir le document → « Demander la signature »
  → saisir le code affiché → document signé → revenir à la société →
  passer le statut à « Déposé au greffe » → le tableau de bord montre les
  compteurs à jour.
- En local : `pytest` (11 tests) et `npm run build` (dans `frontend/`)
  restent verts.

---

## 4. Message pour le recruteur

> **Démo en ligne :** https://legalflow.vercel.app
> Identifiants : `juriste.demo@legalflow.test` / `demo-passphrase-2026`
> (un compte client, `client.demo@legalflow.test`, existe aussi.)
>
> **Code et tests :** https://github.com/badr-chigar/legalflow
> — `python -m pytest` → 11 tests.
>
> Le backend est sur un hébergement gratuit : le **premier appel** après une
> période d'inactivité peut prendre **~5 s** le temps que le serveur
> redémarre, puis tout est instantané.
