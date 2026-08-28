# LegalFlow

API d'accompagnement juridique pour la création d'entreprise en ligne
(sociétés, documents légaux, signature électronique par OTP).

Projet de démonstration — **Django REST Framework**, JWT, PostgreSQL/SQLite,
documentation OpenAPI automatique, tests `pytest`.

---

## Démarrage rapide (SQLite, sans Docker)

```bash
python -m venv .venv
.venv\Scripts\activate            # Windows
# source .venv/bin/activate       # Linux / macOS

pip install -r requirements.txt
copy .env.example .env             # cp sur Linux/macOS

python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

- API : http://127.0.0.1:8000/api/
- Swagger UI : http://127.0.0.1:8000/api/docs/
- Schéma OpenAPI : http://127.0.0.1:8000/api/schema/
- Admin Django : http://127.0.0.1:8000/admin/

## Avec Docker (PostgreSQL)

```bash
docker compose up --build
```

Le service `web` applique les migrations puis démarre sur le port 8000.

## Tests

```bash
python -m pytest
```

Couvre : cycle CRUD complet des sociétés, cloisonnement par rôle
(un client ne voit pas les dossiers d'un autre), et toute la logique OTP
(génération, code faux, expiration, verrouillage après N essais, non-réutilisation).

---

## Rôles

| Rôle | Accès |
|---|---|
| `client` | uniquement ses propres sociétés et documents |
| `juriste` | tous les dossiers (lecture + validation) |
| `admin` | accès complet |

## Endpoints

| Méthode(s) | URL | Rôle |
|---|---|---|
| POST | `/api/auth/register/` | public — crée un compte `client` ou `juriste` |
| POST | `/api/auth/login/` | public — renvoie `access` + `refresh` (JWT) |
| POST | `/api/auth/refresh/` | rafraîchit le token |
| GET / PUT / PATCH | `/api/auth/me/` | profil courant |
| GET / POST | `/api/companies/` | liste / création |
| GET / PUT / PATCH / DELETE | `/api/companies/{id}/` | détail / modif / suppression |
| GET / POST | `/api/documents/` | liste / création (+ upload `multipart`) |
| GET / PUT / PATCH / DELETE | `/api/documents/{id}/` | détail / modif / suppression |
| POST | `/api/documents/{id}/request-signature/` | génère un OTP |
| POST | `/api/documents/{id}/verify-signature/` | vérifie l'OTP → document `signé` |

Codes de réponse de `verify-signature/` : `200` signé · `400` code invalide ·
`409` déjà signé · `410` expiré · `429` trop d'essais.

### Tester à la main

Fichier [`requests.http`](requests.http) (extension *REST Client* de VS Code) :
enchaîne register → login → CRUD société → document → cycle OTP → delete.

> En développement, `request-signature/` renvoie le champ `otp_code_debug`
> pour permettre le test sans SMS/e-mail. À retirer en production.

---

## Structure

```
config/       settings, urls racine, wsgi/asgi
accounts/     User (email + rôle), register, /me, JWT
companies/    modèle Company, ViewSet CRUD, permission par propriétaire
documents/    LegalDocument + SignatureRequest, actions signature, logique OTP
```

## Design (frontend à venir)

Voir [`design-system.md`](design-system.md) : tokens (couleurs hex, polices,
espacement) à respecter pour éviter le rendu générique « IA ». À lire avant
de générer le moindre écran React.
