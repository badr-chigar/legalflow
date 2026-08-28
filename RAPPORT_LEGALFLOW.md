# LegalFlow - Rapport detaille du projet, de zero a la mise en ligne

## 0. Vue d'ensemble

| Element | Valeur |
|---|---|
| Depot GitHub (public) | https://github.com/badr-chigar/legalflow |
| App live (frontend) | https://legalflow-umber.vercel.app |
| API live (backend) | https://chigarbadr.pythonanywhere.com - Swagger : /api/docs/ |
| Tag de version | v1.0.0 |
| Stack backend | Python 3.11 - Django 5.1 - Django REST Framework - SimpleJWT - drf-spectacular - SQLite |
| Stack frontend | Next.js 16.3 (App Router, Turbopack) - TypeScript - Tailwind CSS v4 - composants type shadcn |
| Hebergement | Backend : PythonAnywhere (gratuit) - Frontend : Vercel (Hobby, gratuit) - aucune carte bancaire |
| Tests automatises | 11 tests pytest - tous verts |
| Emplacement local | C:\Users\shadow\Downloads\newww\legalflow |

## 1. Etape 1 - Conception et generation du backend Django

### 1.1 Ce qui a ete fait

Creation d'un projet Django REST "LegalFlow" (plateforme d'accompagnement a la creation d'entreprise), inspire du domaine de MyLegal mais avec du code 100 % original.

Outillage verifie en premier (commande shell) : git 2.54, Python 3.11.9, Node 24, npm 11, pip 26 - pas de Docker (d'ou le choix d'un fallback SQLite).

Environnement Python isole :

```
mkdir legalflow && cd legalflow && git init
python -m venv .venv
./.venv/Scripts/python.exe -m pip install -r requirements.txt
```

requirements.txt initial : Django 5.1.4, djangorestframework 3.15.2, djangorestframework-simplejwt 5.3.1, drf-spectacular 0.28.0, django-environ, psycopg2-binary, django-cors-headers, pytest, pytest-django, factory-boy.

### 1.2 Architecture creee (50 fichiers)

3 applications separees :

| App | Contenu |
|---|---|
| accounts | Modele User authentifie par e-mail (USERNAME_FIELD = email), roles client / juriste / admin. Endpoints : register, me, + JWT login / refresh |
| companies | Modele Company (raison sociale, forme juridique, capital, statut). ModelViewSet CRUD. Permission objet IsOwnerLawyerOrAdmin : un client ne voit que ses societes |
| documents | Modeles LegalDocument + SignatureRequest. Actions custom request-signature/ (genere un OTP 6 chiffres) et verify-signature/ (verifie, passe le doc a signe). Logique OTP dans SignatureRequest.verify() qui renvoie (ok, reason) mappe sur les codes HTTP |

Configuration (config/settings.py) :

- Lecture par variables d'environnement (django-environ), fichier .env
- Fallback en cascade : DATABASE_URL vers POSTGRES_* vers SQLite (permet de tourner sans rien installer)
- JWT : access 30 min, refresh 1 jour
- Swagger/OpenAPI auto via drf-spectacular
- Reglages de securite prod (SECURE_SSL_REDIRECT, cookies secure...) conditionnes a "if not DEBUG" pour ne pas casser le local

Fichiers annexes : docker-compose.yml (PostgreSQL), Dockerfile, .env.example, pytest.ini, conftest.py (fixtures : client_user, other_client, lawyer_user, company, document), README.md, requests.http (12 requetes pretes pour tester tous les verbes), .claude/CLAUDE.md.

### 1.3 Difficulte rencontree

Persistance du repertoire de travail du shell : apres le premier "cd legalflow", les commandes suivantes avec "cd legalflow" echouaient ("No such file or directory") car on etait deja dedans. Resolu en passant aux chemins absolus partout.

## 2. Etape 2 - Tests du backend

### 2.1 Migrations et controles

```
./.venv/Scripts/python.exe manage.py makemigrations
# accounts/0001, companies/0001, documents/0001
./.venv/Scripts/python.exe manage.py migrate
./.venv/Scripts/python.exe manage.py check          # 0 probleme
./.venv/Scripts/python.exe -m pytest                # 11 passed
```

Les 11 tests couvrent :

- Cycle CRUD complet d'une societe (POST 201, GET liste, GET detail, PUT 200, PATCH 200, DELETE 204)
- Cloisonnement par role : un client ne peut pas lire le dossier d'un autre client (404), un juriste voit tout, un anonyme est rejete (401)
- Logique OTP exhaustive : generation, code correct vers document signe, code faux vers attempts incremente, expiration (410), verrouillage apres N essais (429), non-reutilisation apres signature (409), un client ne peut pas signer le document d'un autre

### 2.2 Test end-to-end reel avec curl

Serveur lance sur le port 8765, puis script curl complet :

| Verbe | Endpoint | Code obtenu |
|---|---|---|
| POST | /api/auth/register/ | 201 |
| POST | /api/auth/login/ | token JWT |
| POST | /api/companies/ | 201 (id 1) |
| GET | /api/companies/ (liste) | 200 |
| GET | /api/companies/1/ | 200 |
| PUT | /api/companies/1/ | 200 |
| PATCH | /api/companies/1/ | 200 |
| POST | /api/documents/ | 201 |
| POST | /api/documents/1/request-signature/ | 201 - OTP 006311 |
| POST | /api/documents/1/verify-signature/ | 200 - "Document signe." |
| DELETE | /api/companies/1/ | 204 |
| GET | sans token | 401 |

### 2.3 Test manuel dans Swagger UI (/api/docs/)

Scenario complet execute a la main dans le navigateur : login, "Authorize", CRUD societes, creation document, demande de signature, saisie du code, document signe, suppression.

Difficultes rencontrees pendant les tests Swagger :

1. Expiration du token JWT (30 min) : en plein test, tous les appels renvoyaient 401 "Token is invalid or expired". Il faut refaire un POST /api/auth/login/ et re-Authorize.

2. Erreur de collage dans le champ "Authorize" : on avait colle tout le JSON { "refresh": "...", "access": "..." } au lieu de la seule valeur de access. Resultat : 401 "Authorization header must contain two space-delimited values". Ne coller que la chaine du token access (3 blocs separes par des points), sans guillemets ni "Bearer".

3. Valeurs bidon pre-remplies par Swagger : le formulaire arrivait avec "share_capital": "-" et "file": "string". Resultat : 400 ("Un nombre valide est requis.", "La donnee soumise n'est pas un fichier."). Ce n'etait pas un bug - la validation faisait son travail. Vider la boite "Edit Value" (Ctrl+A, Suppr) et n'envoyer que les champs voulus.

4. Warning cosmetique "id untyped" dans le schema OpenAPI : corrige en ajoutant lookup_value_regex = r"\d+" sur les deux ViewSets, {id} type en entier, schema propre.

### 2.4 Securisation de la cle secrete

La cle par defaut (dev-insecure-change-me, 22 caracteres) declenchait un InsecureKeyLengthWarning de SimpleJWT. Generation d'une cle de 64 caracteres et ecriture dans un fichier .env (git-ignore) :

```
KEY=$(python -c "import secrets;print(secrets.token_urlsafe(64))")
```

## 3. Etape 3 - Frontend Next.js (plusieurs iterations)

### 3.1 Analyse prealable de MyLegal

Inspection de mylegal.ma et mylegal.fr via navigateur :

- mylegal.ma = le vrai produit : Next.js 15 (App Router, Turbopack) + React + TypeScript + Tailwind + shadcn/ui, couleur #1DABFC, police Inter, mode sombre, heberge Cloudflare, tres instrumente (GTM, Meta/TikTok Pixel, Google Ads).
- mylegal.fr = simple vitrine WordPress + Elementor Pro, a ignorer.

Confirmation en entretien : backend Python/Django, frontend React. Notre projet colle exactement.

Un teardown detaille de la page d'accueil MyLegal (13 sections, systeme de couleurs, typo, ce qui marche vs ce qui fait generique) a ete ecrit dans MYLEGAL_TEARDOWN.md.

### 3.2 Construction (dans la session Claude Code de l'utilisateur)

Le frontend a ete bati dans la session interactive claude de l'utilisateur (et non ici) pour beneficier des plugins frontend-design et context7 installes (/plugin install ...@claude-plugins-official).

Livre :

- Scaffolding Next.js + config Tailwind/polices (Fraunces pour les titres, IBM Plex Sans pour l'UI, IBM Plex Mono - Geist par defaut supprime)
- lib/auth.ts + lib/api.ts : session par cookies httpOnly (lf_access / lf_refresh), jamais localStorage
- app/api/auth/login|refresh|logout/route.ts : route handlers Next cote serveur, le navigateur ne parle jamais directement a Django, pas de CORS a gerer
- proxy.ts (ex-middleware.ts, renomme pour Next 16) : rafraichissement automatique du token sur 401, protection des routes
- Ecrans back-office : /dashboard (3 compteurs reels + tableau), /companies (tableau dense triable + creation), /companies/[id] (detail + statut modifiable par juriste + documents), /documents/[id] (bloc signature OTP complet)
- Parcours public /creer : assistant 4 etapes qui cree un vrai dossier via l'API
- Vitrine publique / : 13 sections + pages /tarifs, /creation-entreprise, /domiciliation, /contact, /guides + /guides/[slug] (5 articles), /mentions-legales, /a-propos

### 3.3 Iterations de design (le point qui a demande le plus d'allers-retours)

| Iteration | Probleme signale | Correction |
|---|---|---|
| v1 vitrine | "trop simple, aucun effort de design", titres a 28px, pas de schemas, hero vide | PARTIE B : direction artistique ferme (editorial-institutionnel), Fraunces display 44-64px, numeros de section en laiton, 4 schemas SVG dessines maison pour "Comment ca marche", hero avec timeline de statut de dossier, comparatif en vrai table, temoignages en pull-quotes, bande de stats |
| v2 | "il faut profiter de l'espace en mode large" : grand vide vertical, colonnes max-w-3xl isolees au milieu du vide | REFINE : conteneurs max-w-7xl (+ max-w-[88rem] au-dela de 1536px), sections en 2 colonnes (titre sticky a gauche, contenu a droite), py des sections reduit de py-32 a py-20 |
| v3 | "prendre les traits de MyLegal : pleine largeur, logo, transparence" | ADD_MYLEGAL_TRAITS : vrai logo SVG (components/brand/logo.tsx + app/icon.svg), en-tete transparent qui se solidifie au scroll (bg-surface/85 backdrop-blur border-b), fonds de section edge-to-edge alternes |
| v4 contenu | copy generique, termes francais hors-Maroc (M0, DNC...) | CONTENT_AND_STORY : recherche juridique marocaine integree (7 etapes reelles : certificat negatif OMPIC 90 j, enregistrement DGI 30 j, guichet unique du CRI, RC, IF/ICE, CNSS, capital 1 DH, loi 24-10), page /a-propos "Notre histoire" (fondation 2023, mission, equipe fictive, encadre demo), FAQ completes, 5 guides rediges |
| Login | page a moitie vide, ligne de debug "API : http://..." visible | Refonte split-screen : panneau ardoise plein a gauche (logo blanc, mini-carte "Dossier" avec timeline), formulaire centre a droite, gestion d'erreur role=alert, encart identifiants demo (dev only), lien "Retour au site" + "Creer mon entreprise" |

Difficultes de design :

- Warnings "hydration mismatch" dans la console Next : attributs bis_skin_checked, __processed_..., bis_register injectes par l'antivirus Bitdefender (extension navigateur). Ce n'est pas un bug - confirme par inspection du DOM (contenu present, opacity: 1). Corrige proprement avec suppressHydrationWarning sur body. Se verifie en fenetre InPrivate (les warnings disparaissent).
- Captures blanches de l'outil de navigation : le volet navigateur affichait des sections vides alors que le DOM confirmait le contenu present, artefact de l'outil de capture, pas du site.
- next lint supprime dans Next 16, verifications faites avec eslint . + tsc --noEmit directement.

### 3.4 Verifications frontend

```
tsc --noEmit        # 0 erreur
eslint .            # 0 erreur
next build          # succes, 24 routes
```

Routes testees sur le serveur de dev : toutes les pages publiques, 200 ; /dashboard sans session, 307 vers /login.

Test fonctionnel E2E (run Playwright par la session Claude Code) - scenario en 18 etapes, toutes vertes : login juriste, /creer (4 etapes), societe #3 (SAS, 50 000) creee via l'API, document statuts auto en brouillon, ajout d'un 2e document, /documents/5, "Demander la signature", OTP 006109 affiche, saisie, document signe, retour fiche, statut societe, depose, /dashboard compteurs a jour (2/2/1 vers 3/3/2).

## 4. Etape 4 - Mise sur GitHub (comment on a pushe)

### 4.1 Commits locaux

git init des le debut. Tous les commits avec le trailer :

```
Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
```

Commits principaux :

- 7f6f7c8 Scaffold LegalFlow (backend)
- 4f25bb3 Typage des path params {id} en entier
- 80787ba design-system.md + prompt frontend
- 46ddc7f Frontend : logo, en-tete transparent, pleine largeur, contenu marocain, /a-propos (26 fichiers, +1187/-542)
- 63d5fbc Rendre deployable : whitenoise, dj-database-url, render.yaml, seed_demo
- Tag v1.0.0 annote
- 886903f, 97e78cc Guides de deploiement PythonAnywhere

### 4.2 Difficulte : gh non authentifie

```
gh auth status  ->  "You are not logged into any GitHub hosts."
```

Flux interactif gh auth login :

1. GitHub.com puis HTTPS puis Authenticate Git : Yes puis Login with a web browser
2. Code a usage unique affiche (2646-4F3C) puis Entree puis ouverture du navigateur
3. Collage du code sur github.com/login/device puis Authorize
4. "Authentication complete" - connecte en tant que badr-chigar

### 4.3 Creation du depot et push

```
gh repo create legalflow --private --source=. --remote=origin --push
```

Resultat :

```
Created repository badr-chigar/legalflow on github.com
Added remote https://github.com/badr-chigar/legalflow.git
Enumerating objects: 265, done.
Writing objects: 100% (265/265), 208.41 KiB
branch 'master' set up to track 'origin/master'
Pushed commits
```

```
git tag -a v1.0.0 -m "LegalFlow v1.0.0 - backend + frontend + vitrine"
git push origin v1.0.0
```

### 4.4 Passage du depot en public

Necessaire pour que PythonAnywhere puisse git clone sans identifiants, et pour que le recruteur lise le code :

```
gh repo edit badr-chigar/legalflow --visibility public --accept-visibility-change-consequences
# visibility: PUBLIC, isPrivate: false
```

Verifie avant bascule : aucun secret expose - seuls .env.example et frontend/.env.example sont suivis ; db.sqlite3, .venv/, node_modules/, .env sont dans .gitignore ; les seules valeurs "en clair" sont le defaut de dev dev-insecure-change-me et le mot de passe de demo demo-passphrase-2026, volontairement publics.

Difficultes Windows tout au long :

- PowerShell bloque l'execution des scripts (.ps1) : claude.ps1, npm.ps1, Activate.ps1 - "l'execution de scripts est desactivee". Contournements : utiliser CMD au lieu de PowerShell, ou appeler npm.cmd / claude.cmd / .venv\Scripts\python.exe directement, ou (permanent) Set-ExecutionPolicy -Scope CurrentUser RemoteSigned.
- claude en ligne de commande pas installe au depart (l'utilisateur utilisait l'app Desktop) - npm install -g @anthropic-ai/claude-code, puis nouvelle fenetre de terminal obligatoire (cache du PATH).
- Les commandes /plugin install ... ne marchent que dans le REPL Claude Code, pas dans CMD/PowerShell.
- Auto-update de claude.exe en echec ("claude.exe in use") : sans consequence, se fait au prochain lancement.

## 5. Etape 5 - Choix de l'hebergement (les impasses)

### 5.1 Render - BLOQUE (carte bancaire)

Tentative de deploiement via Blueprint (render.yaml cree : service web + PostgreSQL gratuit). Au clic sur "New Blueprint Instance", Render a affiche "Add Card - Add credit card to verify your identity" (empreinte temporaire de 1 $).

Impossible pour moi de saisir une carte (interdiction absolue). L'utilisateur n'a pas de carte bancaire. Render abandonne (Railway et Fly.io demandent aussi une carte en 2026).

### 5.2 Firebase - non viable

Etudie a la demande de l'utilisateur. Verdict :

- Firebase Hosting ne fait pas tourner un serveur Django (statique + Cloud Functions seulement)
- Firestore est NoSQL - l'ORM Django ne fonctionne pas avec - il faudrait reecrire tout le backend
- Cloud Run (Google Cloud) peut faire tourner Django en conteneur mais exige un compte de facturation = carte (plan Blaze)

### 5.3 Solution retenue : PythonAnywhere + Vercel

Le point cle : PythonAnywhere a un disque persistant (contrairement au serverless) - SQLite fonctionne directement, aucune base externe, aucune carte. Le settings.py retombe deja sur SQLite quand aucune base n'est configuree.

Contraintes du plan gratuit "Beginner" (verifiees sur la page de comparaison) :

- 1 web app, 1 worker, console Bash - OK
- Pas de SSH - on utilise la console Bash web
- Pas de MySQL - on utilise SQLite (notre cas)
- Acces internet sortant restreint a une whitelist - PyPI est dessus (pip install marche), et notre app n'appelle aucun site externe
- 100 secondes-CPU/jour (largement suffisant pour une demo ; si depasse, le site ralentit, il ne casse pas)
- 512 Mo de stockage
- Il faut cliquer "Run until 1 month from today" dans l'onglet Web une fois par mois

## 6. Etape 6 - Deploiement du backend sur PythonAnywhere (detaille)

Pilote dans le vrai Chrome de l'utilisateur (deja connecte a PythonAnywhere).

### 6.1 Compte

Creation d'un compte Beginner gratuit - username chigarbadr - domaine https://chigarbadr.pythonanywhere.com. (A noter : chigarbadr, pas badrchigar - utilise partout ensuite : /home/chigarbadr/legalflow.)

### 6.2 Console Bash - clonage et environnement

Ouverture d'une console Bash (onglet Consoles). Verif : python3.11 --version vers 3.11.11, git --version vers 2.34.1.

```
cd ~ && rm -rf legalflow && git clone https://github.com/badr-chigar/legalflow.git && cd legalflow \
  && python3.11 -m venv .venv \
  && ./.venv/bin/pip install --upgrade pip -q \
  && ./.venv/bin/pip install -r requirements.txt \
  && echo "==INSTALL_DONE=="
```

Le clone a reussi (depot public). L'install a telecharge et pose 29 paquets (Successfully installed Django-5.1.4 ... whitenoise-6.8.2).

### 6.3 Fichier .env (avec cle secrete generee)

```
cat > .env <<EOF
DJANGO_SECRET_KEY=$(./.venv/bin/python -c "import secrets;print(secrets.token_urlsafe(64))")
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=chigarbadr.pythonanywhere.com
CORS_ALLOWED_ORIGINS=https://legalflow.vercel.app
CSRF_TRUSTED_ORIGINS=https://legalflow.vercel.app
OTP_TTL_MINUTES=10
OTP_MAX_ATTEMPTS=5
EOF
```

La substitution $(...) a bien injecte une cle de 64 caracteres (verifie avec un sed qui masque la valeur). Les URLs Vercel etaient un placeholder, mises a jour a l'etape 8.

### 6.4 Base, comptes de demo, fichiers statiques

```
./.venv/bin/python manage.py migrate --no-input      # toutes les migrations OK
./.venv/bin/python manage.py seed_demo               # cree juriste.demo + client.demo + 2 societes + 1 document
./.venv/bin/python manage.py collectstatic --no-input # 163 fichiers copies, 469 post-traites (whitenoise manifest)
```

### 6.5 Web app - configuration manuelle

Onglet Web puis "Add a new web app" puis domaine par defaut puis "Manual configuration" puis "Python 3.11".

Reglages saisis via l'interface :

- Source code : /home/chigarbadr/legalflow
- Virtualenv : /home/chigarbadr/legalflow/.venv
- Static files : URL /static/ vers Directory /home/chigarbadr/legalflow/staticfiles

### 6.6 Difficulte : le fichier WSGI

L'editeur web de PythonAnywhere est un CodeMirror qui auto-indente - risque reel de casser l'indentation Python et d'obtenir une IndentationError.

Contournement : ecrire le fichier depuis la console Bash avec un heredoc quote (pas d'expansion, indentation preservee) :

```
cat > /var/www/chigarbadr_pythonanywhere_com_wsgi.py <<'EOF'
import os, sys
path = "/home/chigarbadr/legalflow"
if path not in sys.path:
    sys.path.insert(0, path)
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
EOF
```

Test d'import avant reload (dans la console) :

```
./.venv/bin/python -c "import os,sys; sys.path.insert(0,'/home/chigarbadr/legalflow'); os.environ.setdefault('DJANGO_SETTINGS_MODULE','config.settings'); from django.core.wsgi import get_wsgi_application; get_wsgi_application(); from django.conf import settings; print('WSGI_OK DEBUG=',settings.DEBUG,'HOSTS=',settings.ALLOWED_HOSTS)"
# WSGI_OK DEBUG= False HOSTS= ['chigarbadr.pythonanywhere.com']
```

### 6.7 Reload et test du backend live

Onglet Web puis "Reload chigarbadr.pythonanywhere.com".

Test 1 - Swagger : ouverture de https://chigarbadr.pythonanywhere.com/api/docs/ - la page Swagger complete s'affiche (CSS/JS statiques servis correctement par whitenoise).

Test 2 - API via curl (console Bash) :

```
curl -s -o /dev/null -w "login:%{http_code}\n" -X POST https://chigarbadr.pythonanywhere.com/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"juriste.demo@legalflow.test","password":"demo-passphrase-2026"}'
curl -s -o /dev/null -w "companies_noauth:%{http_code}\n" https://chigarbadr.pythonanywhere.com/api/companies/
```

Resultat :

```
login:200
companies_noauth:401
```

Backend live et fonctionnel.

## 7. Etape 7 - Deploiement du frontend sur Vercel (detaille)

Pilote dans le Chrome de l'utilisateur, deja connecte a Vercel (compte "Badr Chigar" Hobby, equipe tera-informatique-s-projects).

### 7.1 Import du depot

vercel.com/new puis import de badr-chigar/legalflow, branche master.

### 7.2 Difficulte : mauvais preset detecte

Vercel a auto-detecte "Django" comme Application Preset (a cause du manage.py a la racine) et Root Directory ./.

Edit sur Root Directory puis selection du dossier frontend (qui portait l'icone Next.js) - le preset est automatiquement passe a "Next.js".

### 7.3 Difficulte : variables d'environnement parasites

Vercel a detecte 6 variables depuis les .env.example (toutes des variables backend : DJANGO_SECRET_KEY, DJANGO_DEBUG, DJANGO_ALLOWED_HOSTS, CORS_ALLOWED_ORIGINS, OTP_TTL_MINUTES, OTP_MAX_ATTEMPTS) - inutiles pour le frontend Next.js.

La premiere ligne a ete renommee en API_URL avec la valeur https://chigarbadr.pythonanywhere.com, et les 5 autres supprimees (bouton -) une par une, jusqu'a ne garder que :

```
API_URL = https://chigarbadr.pythonanywhere.com   (Production and Preview)
```

### 7.4 Deploy

Clic sur Deploy. Build : "Running TypeScript..." (2 warnings, pas d'erreur), puis succes.

- Deployment de prod : legalflow-k52k8x9r3-tera-informatique-s-projects.vercel.app
- Domaine de production : https://legalflow-umber.vercel.app
- Statut : Ready, source master commit 886903f

L'apercu affiche montrait bien la vitrine ("Creez votre societe au Maroc sans passer par le guichet." + carte Dossier).

## 8. Etape 8 - Test end-to-end de l'app en production

### 8.1 Page de connexion

Ouverture de https://legalflow-umber.vercel.app/login - la nouvelle page split-screen s'affiche : panneau ardoise a gauche (logo, "ESPACE PROFESSIONNEL", "Votre dossier, du premier acte a l'immatriculation.", mini-carte Dossier avec timeline Brouillon vers En revue vers Depose vers Immatriculee, 3 lignes Societes/Documents/Signatures), formulaire "Connexion" a droite.

### 8.2 Login

Saisie de juriste.demo@legalflow.test / demo-passphrase-2026 puis clic "Se connecter" puis redirection vers /dashboard.

### 8.3 Dashboard charge avec les vraies donnees

- Connecte en tant que "Ines Bennani - juriste.demo@legalflow.test - Juriste"
- Compteurs : 2 Societes - 1 Document a signer - 0 Documents signes
- Tableau "5 DERNIERES SOCIETES" : Medina Studio (SASU, 10 000 DH, Brouillon) - Atlas Conseil (SARL, 50 000 DH, En revue) - les donnees de seed_demo

Chaine complete verifiee en live : navigateur vers frontend Vercel vers route handler Next cote serveur vers API Django PythonAnywhere vers SQLite vers retour vers rendu du dashboard.

### 8.4 Reglage final

Mise a jour du .env sur PythonAnywhere avec l'URL Vercel reelle, puis reload :

```
sed -i 's#https://legalflow.vercel.app#https://legalflow-umber.vercel.app#g' .env
# CORS_ALLOWED_ORIGINS=https://legalflow-umber.vercel.app
# CSRF_TRUSTED_ORIGINS=https://legalflow-umber.vercel.app
```

(Note : le login fonctionnait deja avant cette mise a jour, car settings.py contient CORS_ALLOWED_ORIGIN_REGEXES = [r"^https://.*\.vercel\.app$"] et parce que les appels API passent cote serveur, sans CORS navigateur. La mise a jour est faite par proprete et pour l'admin Django.)

## 9. Recapitulatif des difficultes et de leur resolution

| # | Difficulte | Resolution |
|---|---|---|
| 1 | Repertoire de travail du shell persistant, cd en echec | Chemins absolus partout |
| 2 | PowerShell bloque .ps1 (npm, claude, activate) | CMD, ou .cmd/.exe direct, ou Set-ExecutionPolicy RemoteSigned |
| 3 | claude CLI absent, /plugin inconnu dans CMD | npm i -g @anthropic-ai/claude-code, nouvelle fenetre, /plugin dans le REPL |
| 4 | Token JWT expire (30 min) pendant les tests Swagger | Re-login + re-Authorize |
| 5 | Collage du JSON entier dans "Authorize" | Ne coller que la valeur access |
| 6 | Valeurs bidon Swagger ("-", "string") vers 400 | Vider la boite, n'envoyer que les champs voulus |
| 7 | Warnings hydration Next | = antivirus Bitdefender ; suppressHydrationWarning sur body ; se voit disparaitre en InPrivate |
| 8 | Captures blanches de l'outil navigateur | Artefact d'outil ; DOM verifie, contenu present |
| 9 | Design "trop simple", vide sur grand ecran | Iterations PARTIE B puis REFINE puis ADD_MYLEGAL_TRAITS (2 colonnes, max-w-7xl, SVG maison, logo, en-tete transparent) |
| 10 | gh non authentifie | gh auth login par device-code navigateur |
| 11 | Depot prive, git clone sans identifiants impossible | gh repo edit --visibility public (aucun secret expose) |
| 12 | Render exige une carte bancaire | Abandon Render/Railway/Fly |
| 13 | Firebase incompatible avec Django/SQL | PythonAnywhere retenu (disque persistant, SQLite, sans carte) |
| 14 | Editeur WSGI CodeMirror auto-indente | Ecriture du fichier via cat > ... <<'EOF' en Bash |
| 15 | Vercel detecte "Django" comme preset | Root Directory = frontend, preset, Next.js |
| 16 | Vercel importe 6 env vars backend inutiles | Renommer 1 en API_URL, supprimer les 5 autres |
| 17 | next lint supprime dans Next 16 | eslint . + tsc --noEmit |
| 18 | Auto-update claude.exe en echec | Sans consequence |

## 10. Comment tester - identifiants de connexion

### Ouvrir l'application

https://legalflow-umber.vercel.app

Premier chargement : si le backend PythonAnywhere etait en veille, la premiere requete peut prendre 5 a 30 secondes. Les suivantes sont rapides.

### Comptes de demonstration

| Role | E-mail | Mot de passe | Ce qu'il voit |
|---|---|---|---|
| Juriste | juriste.demo@legalflow.test | demo-passphrase-2026 | tous les dossiers, peut changer les statuts et valider |
| Client | client.demo@legalflow.test | demo-passphrase-2026 | uniquement ses societes et documents |

### Parcours de test recommande (2-3 min)

1. Aller sur https://legalflow-umber.vercel.app puis cliquer "Se connecter"
2. Se connecter avec juriste.demo@legalflow.test / demo-passphrase-2026
3. Depuis le dashboard, cliquer "Nouvelle societe" (ou le bouton "Creer mon entreprise" de la vitrine, assistant 4 etapes)
4. Sur la fiche de la societe creee, "Ajouter un document" (type : Statuts)
5. Ouvrir le document, "Demander la signature", un code a 6 chiffres s'affiche dans un encart "code de test"
6. Saisir ce code, le document passe a "Signe" (date horodatee)
7. Revenir sur la fiche societe, changer le statut en "Depose au greffe"
8. Retourner sur /dashboard, les compteurs ont bouge

### Tester l'API directement

- Swagger interactif : https://chigarbadr.pythonanywhere.com/api/docs/
  POST /api/auth/login/ avec un compte demo, copier la valeur access, bouton "Authorize", coller le token, tester tous les endpoints (GET / POST / PUT / PATCH / DELETE)
- Schema OpenAPI : https://chigarbadr.pythonanywhere.com/api/schema/

### Lancer les tests unitaires (depuis le code source)

```
git clone https://github.com/badr-chigar/legalflow.git
cd legalflow
python -m venv .venv && .venv/bin/pip install -r requirements.txt   # Windows : .venv\Scripts\...
.venv/bin/python manage.py migrate
.venv/bin/python -m pytest        # 11 passed
```

## 11. Maintenance

- Garder le backend actif : se connecter sur pythonanywhere.com puis onglet Web puis cliquer "Run until 1 month from today" (une fois par mois ; mail d'alerte 1 semaine avant desactivation).
- Redeployer apres modification du code :
  - Frontend : automatique a chaque git push origin master (Vercel).
  - Backend : console Bash PythonAnywhere :

```
cd ~/legalflow && git pull \
  && ./.venv/bin/pip install -r requirements.txt \
  && ./.venv/bin/python manage.py migrate \
  && ./.venv/bin/python manage.py collectstatic --no-input
```

    puis onglet Web puis Reload.

- Fichiers de reference dans le depot : README.md, DEPLOY_PYTHONANYWHERE.md, MYLEGAL_TEARDOWN.md, design-system.md, et les prompts d'iteration (FRONTEND_PROMPT.md, V2_PROMPT.md, REFINE_PROMPT.md, ADD_MYLEGAL_TRAITS.md, CONTENT_AND_STORY_PROMPT.md, LOGIN_PROMPT.md).
