# 🗳️ NovaVote - Plateforme de Vote Électronique Sécurisée

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-green)](https://fastapi.tiangolo.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](https://www.docker.com/)

Plateforme de vote électronique sécurisée basée sur le protocole **Belenios**, offrant une cryptographie vérifiable de bout en bout (end-to-end verifiable encryption).

## ✨ Fonctionnalités

### 🔐 Sécurité de Niveau Militaire
- **Chiffrement ElGamal** : Protocole cryptographique asymétrique avec clés publiques distribuées
- **Preuves Zero-Knowledge (ZKP)** : Vérification sans révélation du contenu du vote
- **Auditabilité complète** : Tous les bulletins sont enregistrés publiquement et vérifiables indépendamment

### 🎯 Fonctionnalités Principales
- ✅ Création et gestion d'élections multi-questions
- ✅ Vote anonyme et chiffré de bout en bout
- ✅ Vérification individuelle des bulletins (ballot tracking)
- ✅ Tableau de bord administrateur avec statistiques en temps réel
- ✅ Export IPFS pour archivage décentralisé
- ✅ Magic Links pour authentification sans mot de passe

### 🎨 Interface Moderne
- Interface utilisateur élégante avec Next.js 14 et Tailwind CSS
- Mode sombre par défaut optimisé
- Animations fluides et feedback visuel (confetti, toasts)
- Responsive design mobile-first
- Accessibilité WCAG 2.1 AA

## 🏗️ Architecture Technique

### Stack Technologique

**Frontend**
- ⚡ **Next.js 14** : App Router, React Server Components
- 🎨 **Tailwind CSS** : Styling moderne et responsive
- 📊 **Chart.js** : Visualisation des résultats
- 🔐 **Crypto-JS** : Chiffrement côté client
- 🎉 **Canvas Confetti** : Animations de célébration

**Backend**
- 🚀 **FastAPI** : Framework async Python haute performance
- 🗄️ **PostgreSQL 16** : Base de données relationnelle
- ⚡ **Redis 7** : Cache et gestion de sessions
- 🔄 **SQLAlchemy 2.0** : ORM avec support async/await
- 📧 **Email** : Magic Links via SMTP

**DevOps**
- 🐳 **Docker** : Multi-stage builds optimisés
- 📦 **Docker Compose** : Orchestration des services
- 🔧 **Alembic** : Migrations de base de données
- 📝 **Pydantic** : Validation et configuration

### Architecture de Sécurité

```
┌─────────────────┐      HTTPS/TLS     ┌──────────────────┐
│   Navigateur    │◄──────────────────►│   Next.js App    │
│   (Frontend)    │                     │   (Port 3001)    │
└─────────────────┘                     └──────────────────┘
        │                                        │
        │ Chiffrement ElGamal                   │ API REST
        │ (clé publique)                        │
        ▼                                        ▼
┌─────────────────┐                     ┌──────────────────┐
│  Vote Chiffré   │────────────────────►│  FastAPI Backend │
│   (Bulletin)    │     POST /vote      │   (Port 8001)    │
└─────────────────┘                     └──────────────────┘
                                                 │
                        ┌────────────────────────┼────────────────────────┐
                        ▼                        ▼                        ▼
                 ┌──────────────┐        ┌──────────────┐        ┌──────────────┐
                 │  PostgreSQL  │        │    Redis     │        │     IPFS     │
                 │   Database   │        │    Cache     │        │   (Export)   │
                 └──────────────┘        └──────────────┘        └──────────────┘
```

## 🚀 Installation et Déploiement

### Prérequis
- Docker 24+ et Docker Compose
- Git
- (Optionnel) Node.js 18+ et Python 3.11+ pour le développement local

### Installation Rapide avec Docker

1. **Cloner le dépôt**
```bash
git clone https://github.com/VOTRE_USERNAME/novavote.git
cd novavote
```

2. **Configurer les variables d'environnement**
```bash
cp .env.example .env
nano .env  # Éditer avec vos paramètres
```

3. **Variables essentielles dans `.env`**
```bash
# Base de données
DB_PASSWORD=votre_mot_de_passe_securise

# Sécurité (minimum 32 caractères)
SECRET_KEY=votre_cle_secrete_tres_longue_et_aleatoire

# URLs (adapter à votre configuration)
PUBLIC_URL=http://votre-domaine.com:3001
NEXT_PUBLIC_API_URL=http://votre-domaine.com:8001/api/v1
BACKEND_CORS_ORIGINS=http://localhost:3001,http://votre-domaine.com:3001

# SMTP (pour Magic Links)
MAIL_ENABLED=true
MAIL_SERVER=smtp.votreserveur.com
MAIL_PORT=587
MAIL_USERNAME=votre@email.com
MAIL_PASSWORD=votre_mot_de_passe_smtp
MAIL_FROM=noreply@votredomaine.com
MAIL_USE_TLS=true
```

4. **Lancer l'application**
```bash
docker compose build
docker compose up -d
```

5. **Vérifier le déploiement**
```bash
docker compose ps
curl http://localhost:8001/health  # Backend health check
curl http://localhost:3001         # Frontend
```

L'application est maintenant accessible :
- 🌐 **Frontend** : http://localhost:3001
- 🔧 **API Backend** : http://localhost:8001
- 📚 **Documentation API** : http://localhost:8001/docs

### Création du Premier Administrateur

À la première utilisation, le premier compte créé devient automatiquement administrateur :

1. Accéder à http://localhost:3001/login
2. Cliquer sur "Créer un Compte"
3. Saisir votre email et mot de passe
4. Vous êtes maintenant administrateur !

## 📖 Guide d'Utilisation

### Pour les Administrateurs

1. **Créer une élection**
   - Accéder au Dashboard Admin (`/admin`)
   - Cliquer sur "Nouvelle Élection"
   - Définir titre, description, questions et options
   - Configurer les dates de début/fin

2. **Ouvrir l'élection**
   - Générer automatiquement les clés cryptographiques
   - Passer le statut de "Draft" à "Open"
   - Les électeurs peuvent maintenant voter

3. **Clôturer et décompter**
   - À la date de fin, clôturer l'élection
   - Lancer le décompte automatique avec décryptage
   - Visualiser les résultats en temps réel

4. **Archivage IPFS**
   - Exporter l'élection vers IPFS pour archivage permanent
   - Conserver le CID pour vérification future

### Pour les Électeurs

1. **Voter**
   - Accéder à la page de vote (`/vote`)
   - Sélectionner l'élection ouverte
   - Répondre aux questions (vote chiffré localement)
   - Soumettre le bulletin

2. **Vérifier son vote**
   - Noter le tracker ID du bulletin
   - Accéder à la page de vérification (`/verify`)
   - Saisir le tracker ID pour confirmer l'enregistrement

3. **Consulter les résultats**
   - Une fois l'élection décomptée, les résultats sont publics
   - Graphiques interactifs avec répartition des votes

## 🔧 Développement Local

### Sans Docker

**Backend**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Configurer .env
export DATABASE_URL="postgresql+asyncpg://novavote:password@localhost:5432/novavote"
export SECRET_KEY="votre-cle-secrete"

# Migrations
alembic upgrade head

# Lancer le serveur
uvicorn app.main:app --reload --port 8000
```

**Frontend**
```bash
npm install
npm run dev  # Port 3000
```

### Tests

```bash
# Backend
cd backend
pytest

# Frontend
npm run test
npm run test:e2e  # Tests end-to-end avec Playwright
```

### Linting et Formatage

```bash
# Backend
ruff check .
ruff format .

# Frontend
npm run lint
npm run format
```

## 🛡️ Sécurité et Conformité

### Cryptographie
- **ElGamal** : Chiffrement asymétrique avec sécurité prouvée
- **SHA-256** : Hachage des bulletins pour intégrité
- **Zero-Knowledge Proofs** : Vérifiabilité sans révélation

### Bonnes Pratiques
- ✅ Variables d'environnement pour secrets (jamais en dur)
- ✅ HTTPS/TLS obligatoire en production
- ✅ CORS configuré strictement
- ✅ Rate limiting sur endpoints sensibles
- ✅ Validation Pydantic côté backend
- ✅ Sanitisation des entrées utilisateur
- ✅ Sessions JWT avec expiration

### Audit et Traçabilité
- Tous les votes sont enregistrés avec horodatage
- Logs structurés pour audit
- Export IPFS pour archivage immuable

## 📊 Performance

### Optimisations Frontend
- ✅ Next.js standalone output (65% réduction de taille)
- ✅ Compression Gzip/Brotli
- ✅ Code splitting automatique
- ✅ Image optimization

### Optimisations Backend
- ✅ Async/await avec asyncpg
- ✅ Connection pooling PostgreSQL
- ✅ Cache Redis pour sessions
- ✅ ORJson pour sérialisation JSON rapide

### Metrics
- 🚀 Time to First Byte : < 100ms
- 📦 Bundle size frontend : ~250KB gzipped
- ⚡ API Response Time : < 50ms (moyenne)

## 🤝 Contribution

Les contributions sont les bienvenues ! Merci de :

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/amazing-feature`)
3. Commit vos changements (`git commit -m 'Add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

### Guidelines
- Suivre les conventions de code existantes
- Ajouter des tests pour les nouvelles fonctionnalités
- Mettre à jour la documentation si nécessaire
- Respecter les principes SOLID et clean code

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🙏 Remerciements

- **Belenios** : Protocole cryptographique de référence
- **FastAPI** : Framework backend moderne et performant
- **Next.js** : Framework React de nouvelle génération
- **Vercel** : Inspiration pour l'UI/UX

## 📧 Support et Contact

- 📫 Email : maxime.pelissier@grenoble-inp.fr
- 🐛 Issues : [GitHub Issues](https://github.com/VOTRE_USERNAME/novavote/issues)
- 📖 Documentation API : http://localhost:8001/docs

## 🗺️ Roadmap

- [ ] Support multi-langues (i18n)
- [ ] Application mobile (React Native)
- [ ] Intégration blockchain pour timestamping
- [ ] Dashboard analytics avancé
- [ ] Export PDF des résultats
- [ ] Support OAuth2 (Google, Microsoft)
- [ ] Notifications push
- [ ] Websockets pour updates temps réel

---

**Fait avec ❤️ pour la démocratie numérique sécurisée**

