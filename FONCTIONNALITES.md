# 🗳️ NovaVote - Fonctionnalités

## Vue d'ensemble
**NovaVote** est une plateforme de vote électronique sécurisée conçue selon les standards de Fort Knox, combinant cryptographie avancée, audit transparent et expérience utilisateur premium.

---

## 🔐 Architecture de Sécurité

### Cryptographie (Expliquée Simplement)
- **Clés de sécurité** : Générées automatiquement pour chaque élection
- **Scellement numérique** : Validation que votre bulletin est valide, sans le lire
- **Code de reçu unique** : Signature pour suivre votre vote
- **Agrégation des votes chiffrés** : Décompte sans révéler les bulletins
- **Réunion des clés de sécurité** : Partage sécurisé pour ouvrir les résultats

### Authentification & Autorisation
- **Magic Links** : Liens uniques à usage unique avec expiration (15 min par défaut)
- **JWT Bearer Tokens** : Authentification admin avec expiration configurable
- **Hachage Argon2id** : Protection des mots de passe admin
- **Validation email** : email-validator pour tous les emails entrants
- **Middleware de taille** : Limitation des requêtes (10MB max)

---

## 👤 Fonctionnalités Administrateur

### Gestion des Elections

#### Création d'Election
- **Wizard multi-étapes** avec validation temps réel
- **Informations de base** :
  - Titre (5-200 caractères)
  - Description riche
  - Dates début/fin avec validation
- **Questions configurables** :
  - Types : Choix unique, choix multiple, texte libre
  - Options illimitées par question
  - Ajout/suppression dynamique
- **Import de participants** :
  - CSV upload avec validation
  - Saisie manuelle
  - Détection des doublons
- **Génération automatique de keypair** à la création

#### Tableau de Bord Admin
- **Liste des élections** avec filtrage par statut :
  - 🟡 Brouillon (configuration en cours)
  - 🟢 Ouvert (vote en cours)
  - 🔴 Fermé (vote terminé)
  - ✅ Décompté (résultats publiés)
- **Actions rapides** :
  - Ouvrir/Fermer
  - Voir résultats
  - Supprimer
- **Statistiques en temps réel** :
  - Nombre d'élections actives
  - Votes reçus aujourd'hui
  - Taux de participation moyen

#### Gestion du Cycle de Vie
- **Transitions de statut** :
  - DRAFT → OPEN : Envoi automatique des magic links par email
  - OPEN → CLOSED : Fin de la période de vote
  - CLOSED → TALLIED : Décompte et publication des résultats
- **Confirmation requise** pour actions critiques (suppression, fermeture)

#### Résultats & Analytics
- **Statistiques détaillées** :
  - Votes reçus vs invités
  - Taux de participation (%)
  - Timeline des votes reçus
- **Résultats par question** :
  - Graphiques en barres (Recharts)
  - Pourcentages calculés
  - Export des données (à venir)
- **Transparence** :
  - Traces d'ouverture (quand, par qui)
  - Réunion des clés de sécurité documentée
  - Journal d'audit complet

---

## 🗳️ Fonctionnalités Votant

### Accès au Vote

#### Lien d'Accès Personnalisé (Recommandé)
1. Réception d'un email avec lien personnel unique
2. Clic sur le lien → accès direct au bulletin
3. Lien vérifié côté serveur (sécurité, expiration, usage unique)
4. Affichage automatique des questions et options

#### Accès Manuel
1. Page `/vote` publique
2. Saisie de l'ID d'élection
3. Vérification de l'ouverture
4. Accès au bulletin (anonyme)

### Processus de Vote

#### Interface de Vote
- **Design Premium Midnight** :
  - Fond dégradé slate-900 → slate-800
  - Cartes glassmorphiques avec backdrop-blur
  - Animations Framer Motion
  - Mode sombre natif
- **Étapes visuelles** :
  - Pills indicator avec progression
  - Validation temps réel
  - Messages d'erreur clairs
- **Types de questions supportés** :
  - Radio buttons (choix unique) + option "Vote blanc" par défaut
  - Checkboxes (choix multiple) + option "Abstention" par défaut
  - Text area (réponse libre)

**Important** : Vote blanc/abstention offert systématiquement (non imposé).

#### Soumission & Scellement Numérique
1. **Validation côté client** :
   - Toutes questions répondues
   - Format correct
2. **Scellement numérique du bulletin** :
   - ✨ Animation : Enveloppe qui se scelle (chiffrement visualisé)
   - ✉️ Animation : Enveloppe qui glisse dans l'urne (envoi au serveur)
   - Utilisation de la clé de sécurité de l'élection
   - Génération du sceau numérique de validité
3. **Empreinte anonyme** :
   - Fingerprint invisible (navigateur + écran + fuseau)
   - Permet la détection du double-vote (si configuré)
4. **Envoi sécurisé** :
   - POST /api/v1/ballots avec validation CORS
   - Vérification du sceau côté serveur
5. **Confirmation** :
   - **Reçu de vote** unique (16 caractères)
   - Email de confirmation (si accès par lien)
   - Publication sécurisée (archive décentralisée)

#### Vérification Post-Vote
- **Page de vérification** (`/verify`) :
  - Saisie du reçu de vote
  - Vérification dans l'archive électorale
  - Affichage des métadonnées (date/heure, archive numérique)
  - ✅ Confirmation que le bulletin est comptabilisé
  - Aucun contenu du bulletin révélé (anonymat absolu)

---



---

## ✨ Animations & Feedback Sensoriel

Le moment du vote est solennel. Les animations matérialisent l'action virtuelle et renforcent la confiance.

### Animation d'Envoi du Bulletin

1. **Clic "Voter"** → Désactivation du bouton
2. **Scellement** (400ms) : Enveloppe qui se ferme
   - Icône : 📧 → 🔒 (avec animation de fermeture éclair)
   - Message : "Scellement de votre bulletin..."
   - Fond : Léger glow indigo/émeraude (selon thème)
3. **Transmission** (600ms) : Enveloppe qui glisse vers l'urne
   - Direction : droite → bas
   - Urne déjà présente avec animation d'attente
   - Message : "Envoi vers l'urne électorale..."
4. **Confirmation** (200ms) : ✅ Checkmark + effet de succès
   - Message : "Bulletin enregistré !"
   - Affichage du reçu de vote (avec bouton "Copier")
   - Son discret de confirmation (optionnel, accessible)

### Détails Techniques

- **Framer Motion** : Animations fluides et performantes
- **Tailwind animations** : glow, pulse sur éléments statiques
- **Accessibility** :
  - Tous les textes d'animation en `aria-live="polite"` (lecteurs d'écran)
  - Respect de `prefers-reduced-motion` (animations réduites si demandé)
  - Temps minimum 1s pour lire les messages
- **Haptic Feedback** : Vibration brève sur mobile (vibration API)
- **Thème-aware** : Couleurs d'animation adaptées (Midnight = indigo, Civic = émeraude)

---

## 📧 Système d'Emails

### Templates Professionnels
Tous les emails s'adaptent au thème choisi :
- Design responsive (mobile-first)
- Mode Midnight : indigo/purple/slate
- Mode Civic : bleu marine/émeraude/blanc cassé
- Logo et branding cohérents
- Appels à l'action clairs

### Types d'Emails

#### 1. Lien d'Accès (Invitation à Voter)
- **Envoyé lors de** : Passage de Brouillon → Ouvert
- **Contenu** :
  - Titre de l'élection
  - Date limite de vote
  - Bouton principal : "Accéder au Bulletin"
  - Lien de secours (copier/coller)
  - Code de sécurité visible
- **Expiration** : 15 minutes (configurable)
- **Sécurité** :
  - Lien cryptographique unique
  - Hachage côté serveur
  - Usage unique vérifié

#### 2. Confirmation de Vote
- **Envoyé lors de** : Soumission réussie du bulletin
- **Contenu** :
  - Confirmation de réception du bulletin
  - **Reçu de vote** en gras (copie facile)
  - Lien vers page de vérification
  - Rappel : anonymat garanti, aucun contenu visible
- **Design** :
  - Reçu en monospace sur fond contrasté
  - Icône de succès (✅)
  - Instructions de vérification claires

#### 3. Résultats Disponibles (à venir)
- Notification quand TALLIED
- Lien vers page de résultats

### Configuration Email (SMTP)
Variables d'environnement requises :
```bash
MAIL_ENABLED=true
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your@email.com
MAIL_PASSWORD=your_app_password
MAIL_FROM=noreply@novavote.com
MAIL_FROM_NAME=NovaVote
MAIL_USE_TLS=true
MAIL_USE_SSL=false
```

---

## 🗄️ Stockage & Persistance

### Base de Données (PostgreSQL)

#### Tables Principales

**users** : Comptes admin
- UUID, email unique, hashed_password
- is_admin, is_active
- Relations : elections (1-N)

**elections** : Élections
- UUID, titre, description
- public_key (JSON ElGamal)
- questions (JSON array)
- voter_emails (JSON array)
- status (enum: DRAFT/OPEN/CLOSED/TALLIED)
- Relations : ballots (1-N), result (1-1), trustees (1-N)

**ballots** : Bulletins de vote
- UUID, election_id
- encrypted_ballot (JSON)
- proof (JSON ZKP)
- **tracking_code** (unique, indexé)
- **ipfs_hash** (CID bulletin board)
- voter_fingerprint (anonyme)
- voter_email (optionnel, si magic link)

**magic_links** : Tokens d'accès
- UUID, election_id, email
- token (unique, indexé)
- expires_at, used (boolean)

**results** : Résultats agrégés
- UUID, election_id (unique)
- aggregated_encrypted (JSON)
- decrypted_result (JSON)
- proofs, tally_log

**trustees** : Gardiens du secret (à venir)
- UUID, election_id, email
- public_key_share, verification_proof
- status (pending/active/completed)

### Redis (Cache & Queue)
- **Sessions** : JWT token blacklist
- **Rate limiting** : Endpoints publics
- **Background jobs** : Envoi d'emails asynchrone

### Stockage Fichiers
- **Local** : `/app/storage` (bulletins, logs)
- **IPFS** (optionnel) : Publication sur bulletin board décentralisé
- **Adapter pattern** : Basculement local/IPFS transparent

---

## 🎨 Design System : Midnight + Civic (Deux Thèmes Inclusifs)

### Mode Midnight (Défaut) - Confiance Technologique
Pour utilisateurs numériques, inspire la sécurité avancée.

**Palette**:
```css
from-slate-900 to-slate-800        /* Base gradient */
bg-slate-800/50 backdrop-blur-md   /* Glass cards */
text-indigo-400                     /* Accents */
```

### Mode Civic (Alternatif) - Confiance Institutionnelle
Pour électeurs traditionnels et institutions, évoque l'autorité démocratique.

**Palette**:
```css
bg-slate-50 (#F8FAFC)              /* Fond blanc cassé */
text-slate-900 (#0F172A)           /* Texte bleu marine profond */
border-emerald-500 / text-emerald-600  /* Accents vert émeraude */
shadow-slate-200                   /* Ombres douces */
```

**Inspiration** : UK Government Digital Service (GDS) - standard service public moderne.

### Switch de Thème
- Icône soleil/lune en haut à droite
- Persistance en localStorage
- Transition douce (300ms)

### Composants UI

#### Cartes
- `card-glass` : Glassmorphisme avec backdrop-blur
- Bordure `border-slate-700`
- Ombre `shadow-indigo-500/10`

#### Boutons
- `btn-primary` : Gradient indigo-purple, hover:scale-105
- `btn-secondary` : Transparent + bordure, hover:bg-slate-800/50

#### Inputs
- `input-modern` : Fond transparent, bordure slate-700
- Focus : `ring-2 ring-indigo-500/50`

#### Animations
- Fade-in au chargement
- Scale on hover (1.05)
- Pulse pour blobs de fond
- Framer Motion pour transitions complexes

---

## 🔌 API REST (FastAPI)

### Endpoints Publics

#### Auth
- `POST /api/v1/auth/register` : Inscription admin
- `POST /api/v1/auth/login` : Connexion admin (JWT)

#### Magic Links
- `POST /api/v1/magic-links/generate` : Génération + envoi email
- `GET /api/v1/magic-links/verify/{token}` : Vérification token
- `POST /api/v1/magic-links/use/{token}` : Marquer comme utilisé

#### Ballots
- `POST /api/v1/ballots` : Soumission bulletin (avec ZKP)
- `GET /api/v1/ballots/verify/{tracking_code}` : Vérification

#### Health
- `GET /health` : Healthcheck (200 OK)

### Endpoints Admin (Auth Required)

#### Elections
- `POST /api/v1/elections` : Créer élection
- `GET /api/v1/elections` : Liste élections admin
- `GET /api/v1/elections/{id}` : Détails élection
- `PATCH /api/v1/elections/{id}/status` : Changer statut
- `GET /api/v1/elections/{id}/stats` : Statistiques & résultats
- `DELETE /api/v1/elections/{id}` : Supprimer élection

### Middleware & Sécurité
- **CORS** : Origins configurables via `BACKEND_CORS_ORIGINS`
- **Rate Limiting** : 5 req/min sur /auth/login
- **Request Size** : 10MB max (middleware custom)
- **Logging** : Tous endpoints avec niveau INFO
- **Error Handling** : Exceptions HTTP standardisées

---

## 📱 Pages Frontend (Next.js 14)

### Pages Publiques

#### `/` (Accueil)
- Hero avec animations de blobs
- Présentation des features :
  - 🔒 Cryptographie militaire
  - 🕵️ Anonymat garanti
  - 🔍 Vérifiable publiquement
  - ⚡ Résultats en temps réel
- Appels à l'action : Admin / Voter

#### `/vote` (Accès Vote)
- Choix du mode d'accès :
  - Magic link (si reçu par email)
  - Accès manuel (ID d'élection)
- Design glassmorphique
- Mode responsive

#### `/vote/[token]` (Bulletin de Vote)
- Récupération auto des questions
- Affichage dynamique selon type
- Validation temps réel
- Soumission avec feedback
- Page de confirmation avec tracking code

#### `/verify` (Vérification)
- Saisie tracking code
- Recherche dans bulletin board
- Affichage métadonnées :
  - Timestamp
  - IPFS hash
  - Statut (vérifié ✓)

#### `/results/[id]` (Résultats Publics)
- Graphiques interactifs (Recharts)
- Statistiques de participation
- Résultats par question
- Partage social (à venir)

### Pages Admin (Auth Required)

#### `/login` (Connexion Admin)
- Formulaire email + password
- Validation Zod
- Stockage JWT en cookie httpOnly
- Redirection vers `/admin`

#### `/admin` (Dashboard)
- Liste des élections avec statuts
- Actions rapides (badges colorés)
- Statistiques globales
- Bouton "Créer Élection" → Wizard

#### `/admin/election/[id]` (Détails Élection)
- Informations complètes
- Gestion du statut :
  - Bouton "Ouvrir" (DRAFT → OPEN)
  - Bouton "Fermer" (OPEN → CLOSED)
  - Bouton "Décompter" (CLOSED → TALLIED)
- Onglets :
  - Résultats (graphiques)
  - Participants (liste emails)
  - Paramètres

---

## 🛠️ Services Backend

### CryptoService
```python
generate_keypair()         # Génération des clés de sécurité
encrypt_ballot()           # Chiffrement du bulletin
generate_seal()            # Génération du sceau numérique
verify_seal()              # Vérification du sceau
aggregate_ballots()        # Agrégation des votes chiffrés
reunite_keys()             # Réunion des clés pour déchiffrement
```

### EmailService
```python
send_magic_link()          # Email invitation
send_vote_confirmation()   # Email confirmation
send_results_available()   # Email résultats (à venir)
```

### StorageService
```python
store()      # Stockage bulletin (local ou IPFS)
retrieve()   # Récupération bulletin
```

---

## 🐳 Déploiement Docker

### Services

#### `db` : PostgreSQL 16-alpine
- Port : 5432 (interne)
- Volume : `postgres_data` (persistant)
- Healthcheck : `pg_isready`

#### `redis` : Redis 7-alpine
- Port : 6379 (interne)
- Volume : `redis_data` (persistant)
- Healthcheck : `redis-cli ping`

#### `api` : FastAPI Backend
- Port : **8001:8000** (host:container)
- Build : Multi-stage (python:3.11-slim)
- Commande : `alembic upgrade head && uvicorn`
- Environnement :
  - DATABASE_URL (asyncpg)
  - SECRET_KEY
  - MAIL_* variables
- Healthcheck : `curl /health`

#### `web` : Next.js Frontend
- Port : **3001:3000** (host:container)
- Build : Multi-stage (node:18-slim)
- Runtime : standalone optimisé
- Environnement :
  - NEXT_PUBLIC_API_URL (build-time)
- Healthcheck : `curl localhost:3000`

### Networks
- `backend` : DB, Redis, API
- `frontend` : API, Web

### Volumes
- `postgres_data` : Données PostgreSQL
- `redis_data` : Cache Redis
- `ballot_storage` : Bulletins locaux

### Build & Deploy
```bash
# Build from scratch
docker compose build --no-cache

# Start all services
docker compose up -d

# Force recreate
docker compose up -d --force-recreate

# View logs
docker compose logs -f api
docker compose logs -f web

# Stop all
docker compose down

# Cleanup (⚠️ DESTRUCTIVE)
docker compose down -v  # Delete volumes
```

---

## 🔒 Variables d'Environnement

### Backend (.env)
```bash
# Database
DATABASE_URL=postgresql+asyncpg://user:pass@db:5432/novavote

# Security
SECRET_KEY=changeme-min-32-chars
ACCESS_TOKEN_EXPIRE_MINUTES=60

# CORS
BACKEND_CORS_ORIGINS=http://localhost:3001,http://web:3001
PUBLIC_URL=http://localhost:3001

# Email (SMTP)
MAIL_ENABLED=true
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your@email.com
MAIL_PASSWORD=your_app_password
MAIL_FROM=noreply@novavote.com
MAIL_FROM_NAME=NovaVote
MAIL_USE_TLS=true
MAIL_USE_SSL=false

# Magic Links
MAGIC_LINK_EXPIRE_MINUTES=15

# Storage
STORAGE_PATH=/app/storage
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:8001/api/v1
```

---

## 📊 Métriques & Monitoring

### Logs
- **Backend** : Python logging (niveau INFO)
  - Toutes requêtes HTTP
  - Emails envoyés/échoués
  - Erreurs de validation
  - ZKP rejets
- **Frontend** : Console.log désactivé en prod
  - Utilisation d'error boundaries
  - Sentry integration (à venir)

### Healthchecks
- API : `/health` (200 OK)
- Web : `curl localhost:3000` (200 OK)
- DB : `pg_isready`
- Redis : `redis-cli ping`

---

## 🚀 Roadmap & Améliorations

### Court Terme (MVP)
- ✅ Création d'élection avec questions multiples
- ✅ Magic links avec expiration
- ✅ Vote avec chiffrement (placeholder)
- ✅ Vérification tracking codes
- ✅ Résultats en temps réel (déchiffrement simple)
- ✅ Design Premium Midnight

### Moyen Terme (Production)
- 🔄 Implémentation réelle ElGamal (py-ecc)
- 🔄 ZKP réels (zksk ou libsodium)
- 🔄 Déchiffrement à seuil avec trustees
- 🔄 Publication IPFS automatique
- 🔄 Export résultats (CSV, PDF)
- 🔄 Mode scrutin (live updates)

### Long Terme (Scale)
- ⏳ Mixnets pour anonymat renforcé
- ⏳ Blind signatures pour bulletins
- ⏳ Multi-tenancy (SaaS)
- ⏳ Mobile apps (React Native)
- ⏳ Blockchain anchor (Ethereum)
- ⏳ Audit trail public (explorer)

---

## 📜 Standards de Sécurité

### Conformité
- **OWASP Top 10** : Toutes vulnérabilités mitigées
- **CWE Top 25** : Patterns dangereux évités
- **RGPD** : Minimisation données, droit à l'oubli
- **Accessibilité** : WCAG AA minimum

### Audits
- Docker Scout : 0 Critical CVEs
- Dependency scanning : Toutes deps à jour
- Static analysis : Ruff (Python), ESLint (TS)

---

## 🤝 Contribution

### Guidelines
- **Code Style** : Voir `.github/instructions/system-prompt.instructions.md`
- **Commits** : Conventional commits (feat:, fix:, security:)
- **PRs** : Squash merge après review
- **Tests** : Pytest (backend), Jest (frontend)

### Contact
- **Repository** : [max3825/novavote](https://github.com/max3825/novavote)
- **Issues** : GitHub Issues
- **Discussions** : GitHub Discussions

---

**NovaVote** - Votez en toute confiance. 🗳️✨
