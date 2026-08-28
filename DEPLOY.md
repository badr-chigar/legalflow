# Déployer LegalFlow

Architecture :

| Composant | Hébergeur | Détail |
|---|---|---|
| Backend Django REST | **Render** | Web Service + PostgreSQL (offres gratuites), blueprint `render.yaml` |
| Frontend Next.js | **Vercel** | Root Directory = `frontend` |

Le frontend n'appelle jamais le backend depuis le navigateur : ses route
handlers (`/api/auth/*`), le proxy et les composants serveur l'appellent
**côté serveur**. L'URL du backend est la variable d'environnement `API_URL`
sur Vercel.

---

## 1. Backend — Render

1. **New + → Blueprint**.
2. Connecter ce dépôt Git. Render lit `render.yaml` et propose de créer :
   - la base `legalflow-db` (PostgreSQL, plan free) ;
   - le service web `legalflow-api` (plan free).
3. **Apply**. Le build lance `./build.sh` :
   `pip install` → `collectstatic` → `migrate` → `seed_demo`.
4. Une fois « Live », noter l'URL publique, du type
   **`https://legalflow-api.onrender.com`**.
5. Vérifier la santé : `https://legalflow-api.onrender.com/api/schema/`
   doit renvoyer `200`.

Variables déjà gérées par le blueprint : `DJANGO_SECRET_KEY` (générée),
`DATABASE_URL` (depuis la base), `DJANGO_ALLOWED_HOSTS=.onrender.com`,
`DJANGO_DEBUG=False`, `OTP_*`. `RENDER_EXTERNAL_HOSTNAME` est injecté
automatiquement par Render et ajouté à `ALLOWED_HOSTS` par `settings.py`.

`CORS_ALLOWED_ORIGINS` et `CSRF_TRUSTED_ORIGINS` restent vides pour l'instant
(`sync: false`) — on les renseigne à l'étape 3.

## 2. Frontend — Vercel

1. **New Project → Import** ce dépôt.
2. **Root Directory** : `frontend` (Next.js est auto-détecté, pas de
   `vercel.json`).
3. **Environment Variables** → ajouter :

   | Name | Value |
   |---|---|
   | `API_URL` | `https://legalflow-api.onrender.com` |

4. **Deploy**. Noter l'URL, du type **`https://legalflow.vercel.app`**.

## 3. Boucler la configuration CORS / CSRF

Sur Render → service `legalflow-api` → **Environment** :

| Key | Value |
|---|---|
| `CORS_ALLOWED_ORIGINS` | `https://legalflow.vercel.app` |
| `CSRF_TRUSTED_ORIGINS` | `https://legalflow.vercel.app` |

**Save, changes → Manual Deploy → Deploy latest commit** (ou attendre le
redéploiement automatique).

> Les déploiements de *preview* Vercel (`*.vercel.app`) sont déjà couverts par
> `CORS_ALLOWED_ORIGIN_REGEXES` dans `settings.py`.

## 4. Vérifier le parcours complet

1. Ouvrir `https://legalflow.vercel.app`.
2. « Se connecter » →
   `juriste.demo@legalflow.test` / `demo-passphrase-2026`.
3. Parcours : `/creer` (4 étapes) → société créée → fiche société →
   ajouter un document → ouvrir le document → « Demander la signature » →
   saisir le code affiché → document signé → revenir à la société →
   passer le statut à « Déposé au greffe » → le tableau de bord reflète
   les compteurs à jour.

Compte client également disponible : `client.demo@legalflow.test`
(même mot de passe), avec deux sociétés d'exemple pré-remplies.

## 5. Note pour le recruteur

L'offre gratuite Render **met le service en veille après ~15 min**
d'inactivité. Le **premier appel après veille prend ~30 s** (démarrage à
froid), puis tout est instantané. Si la connexion semble bloquée, réessayer
une fois après une trentaine de secondes.

---

## Développement local (inchangé)

```
python -m venv .venv && .venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_demo          # comptes + données de démo
python manage.py runserver          # http://127.0.0.1:8000

cd frontend
npm install
npm run dev                          # http://localhost:3000
```

Sans `DATABASE_URL` ni `POSTGRES_DB`, Django utilise SQLite. Le frontend
tombe sur `http://127.0.0.1:8000` si `API_URL` n'est pas défini.
