# LegalFlow — instructions projet

Plateforme d'accompagnement juridique à la création d'entreprise (projet de démonstration).
Backend Django REST Framework + (à venir) frontend React séparé.

## Stack & conventions

- Python 3.11, Django 5.1, DRF 3.15, SimpleJWT, drf-spectacular.
- Auth par e-mail (`accounts.User`, `USERNAME_FIELD = "email"`), rôles : `client` / `juriste` / `admin`.
- Apps : `accounts`, `companies`, `documents`. Une responsabilité par app.
- BDD : SQLite par défaut (aucune install), PostgreSQL si `POSTGRES_DB` défini (docker-compose).
- Tests : `pytest` + `pytest-django`. Lancer `python -m pytest` avant tout commit.
- Migrations : append-only. Ne jamais éditer une migration déjà appliquée ; en créer une nouvelle.
- Config par variables d'environnement uniquement (voir `.env.example`). Pas de secret en dur.

## Commandes

```
.venv\Scripts\activate
python manage.py migrate
python manage.py runserver
python -m pytest
python manage.py spectacular --file openapi-schema.yml   # régénère le schéma OpenAPI
```

Swagger : http://127.0.0.1:8000/api/docs/

## Règles de contribution

- Endpoints REST : ViewSet + router, permissions par rôle (un client ne voit que ses dossiers).
- Toute nouvelle règle métier sensible (OTP, transitions de statut) doit avoir un test.
- Logique OTP : `SignatureRequest.verify()` renvoie `(ok, reason)` ; les vues mappent `reason` sur un code HTTP.
- Frontend : lire `design-system.md` AVANT de générer un écran. Ne jamais introduire couleur/police/rayon hors de ce fichier. Passer le skill `avoid-ai-design` après chaque écran.

## Ne pas faire

- Pas de `secret` / clé API dans le code ou les commits.
- Pas de dépendance ajoutée sans l'inscrire dans `requirements.txt` avec version épinglée.
- Pas de modification des migrations existantes.
