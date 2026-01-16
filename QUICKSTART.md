# 🚀 Quick Start Guide - Sprint Features

## ⚡ Installation Rapide (5 minutes)

### Option 1: Script Automatique (Recommandé)

#### Linux/Mac:
```bash
chmod +x install-features.sh
./install-features.sh
```

#### Windows (PowerShell):
```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope CurrentUser
.\install-features.ps1
```

---

### Option 2: Installation Manuelle

#### Étape 1: Frontend Dependencies
```bash
npm install
npm install -D @playwright/test
npx playwright install --with-deps
```

#### Étape 2: Backend Dependencies
```bash
cd backend
pip install -r requirements.txt
cd ..
```

---

## 🎯 Développement Local

### Terminal 1: Backend FastAPI
```bash
cd backend
python -m uvicorn app.main:app --reload --port 8000
```

**Vérification**:
```bash
curl http://localhost:8000/api/health
# Expect: {"status": "ok"}
```

### Terminal 2: Frontend Next.js
```bash
npm run dev
```

**Ouvrir**: http://localhost:3000

### Terminal 3: Tests E2E (optionnel)
```bash
npm run test:e2e:ui
```

---

## 🧪 Exécution des Tests

### Tous les tests
```bash
npm run test:e2e
```

### Mode UI (Interactif)
```bash
npm run test:e2e:ui
```

### Avec Navigateur Visible
```bash
npm run test:e2e:headed
```

### Debug Mode
```bash
npm run test:e2e:debug
```

---

## ✅ Tests Manuels (Smoke Tests)

### 1️⃣ Validation des Dates

```bash
# Test 1: Dates valides (doit passer)
curl -X POST http://localhost:8000/api/v1/elections \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Valid Election",
    "start_date": "2024-02-15T10:00:00",
    "end_date": "2024-02-15T18:00:00",
    "questions": []
  }'
# Expect: 200 OK

# Test 2: Dates invalides - end < start (doit échouer)
curl -X POST http://localhost:8000/api/v1/elections \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Invalid Election",
    "start_date": "2024-02-15T18:00:00",
    "end_date": "2024-02-15T10:00:00",
    "questions": []
  }'
# Expect: 400 Bad Request with "end_date must be after start_date"
```

### 2️⃣ Rate Limiting

```bash
# Faire 6 tentatives login rapides
for i in {1..6}; do
  echo "Attempt $i:"
  curl -X POST http://localhost:8000/api/v1/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}' \
    -w "\nStatus: %{http_code}\n"
  sleep 0.5
done

# Expect:
# Tentatives 1-5: 401 Unauthorized
# Tentative 6: 429 Too Many Requests
```

### 3️⃣ Email Confirmation

```bash
# Dans le navigateur:
# 1. Aller à http://localhost:3000/admin
# 2. Créer une élection
# 3. Ajouter voter email: "test@example.com"
# 4. Ouvrir l'élection (envoyer magic links)
# 5. Vote via magic link
# 6. Vérifier logs backend pour confirmation email

# Terminal check:
grep -i "email sent\|confirmation" backend.log
```

### 4️⃣ Export Résultats

```bash
# 1. Via navigateur admin
# - Aller à /admin/elections/{id}
# - Cliquer "📥 Exporter CSV"
# - Vérifier fichier téléchargé

# 2. Via API
curl -X GET "http://localhost:8000/api/v1/elections/{id}/export?format=csv" \
  -H "Authorization: Bearer {token}" \
  -o results.csv

cat results.csv
# Expect: CSV formaté avec électeurs et votes
```

### 5️⃣ Skeleton Screens

```bash
# 1. Dans navigateur
# 2. Ouvrir DevTools (F12)
# 3. Aller à http://localhost:3000/admin/elections
# 4. Observer le chargement
# Expect: Skeleton animate-pulse visible pendant 1-2 secondes
```

### 6️⃣ Tests E2E

```bash
# Lancer dans UI interactive
npm run test:e2e:ui

# Cliquer sur chaque test pour voir détails
```

---

## 📊 Vérification Checklist

Après installation, vérifiez:

```bash
# ✅ Backend imports
python -c "from slowapi import Limiter; print('✓ slowapi installed')"

# ✅ Pydantic validators
python -c "from app.schemas.schemas import ElectionBase; print('✓ Validators available')"

# ✅ Email service
python -c "from app.services.email_service import email_service; print('✓ Email service ready')"

# ✅ Frontend components
npx tsc --noEmit src/components/ui/SkeletonLoader.tsx 2>/dev/null && echo "✓ SkeletonLoader compiles"

# ✅ Playwright
npx playwright --version

# ✅ All dependencies
npm list @playwright/test 2>/dev/null | grep -q playwright && echo "✓ Playwright installed"
```

---

## 🐛 Troubleshooting

### "Module not found: @playwright/test"
```bash
npm install -D @playwright/test
npx playwright install --with-deps
```

### "slowapi not found"
```bash
cd backend
pip install slowapi==0.1.9
```

### "Pydantic field_validator not found"
```bash
pip install --upgrade pydantic>=2.0
```

### "Email not sending"
```bash
# Check backend .env
cat backend/.env | grep MAIL_ENABLED
# Should be: MAIL_ENABLED=true

# Check logs
docker logs platforme-web  # or your container name
```

### "Tests hang/timeout"
```bash
# Increase timeout in playwright.config.ts
timeout: 60000  # 60 seconds

# Run with verbose output
PWDEBUG=1 npm run test:e2e:headed
```

---

## 🌐 URLs de Développement

| Service | URL | Port |
|---------|-----|------|
| Frontend | http://localhost:3000 | 3000 |
| Backend API | http://localhost:8000 | 8000 |
| API Docs (Swagger) | http://localhost:8000/docs | 8000 |
| Playwright Report | file://path/to/playwright-report/index.html | - |

---

## 📁 Structure Fichiers Importants

```
# Features
FEATURES_IMPLEMENTED.md     ← Référence feature complète
SPRINT_SUMMARY.md           ← Résumé sprint
API_ENDPOINTS.md            ← API documentation
FILES_MANIFEST.md           ← Liste fichiers modifiés

# Testing
tests/e2e/README.md         ← Guide testing
tests/e2e/complete_workflow.spec.ts ← Test suite
playwright.config.ts        ← Configuration

# Configuration
.env.test                   ← Test environment
install-features.sh         ← Installation (Unix)
install-features.ps1        ← Installation (Windows)

# Code
backend/app/schemas/schemas.py         ← Date validators
backend/app/main.py                    ← Rate limiting setup
backend/app/api/v1/auth.py             ← Rate limited endpoints
backend/app/api/v1/elections.py        ← Export endpoint
src/components/ui/SkeletonLoader.tsx   ← Skeleton components
src/components/admin/ResultsViewer.tsx ← Export buttons
```

---

## 📚 Documentation à Lire

1. **Débutants**: Commencez par `SPRINT_SUMMARY.md`
2. **Développeurs Backend**: Lire `API_ENDPOINTS.md`
3. **Développeurs Frontend**: Vérifier `SkeletonLoader.tsx` + `ResultsViewer.tsx`
4. **QA/Testing**: Consulter `tests/e2e/README.md`
5. **DevOps**: Check `FILES_MANIFEST.md` + `.env.test`

---

## 🎯 Prochaines Étapes

### Immédiat (Aujourd'hui)
- [ ] Exécuter `install-features.sh` ou `.ps1`
- [ ] Démarrer backend + frontend
- [ ] Exécuter `npm run test:e2e`
- [ ] Lire `FEATURES_IMPLEMENTED.md`

### Court Terme (Demain)
- [ ] Tests manuels smoke tests
- [ ] Intégrer à CI/CD
- [ ] Setup email service (Sendgrid)
- [ ] Tests de load

### Moyen Terme (Semaine)
- [ ] Deployer staging
- [ ] UAT avec utilisateurs
- [ ] Fix bugs/ajustements
- [ ] Production deployment

---

## 💡 Tips & Tricks

### Développement Rapide
```bash
# 1. Garder terminals ouverts
# Terminal 1: Backend avec reload auto
# Terminal 2: Frontend avec Hot Module Replacement
# Terminal 3: Tests avec watch mode

# 2. Utiliser Playwright UI mode
npm run test:e2e:ui

# 3. Browser DevTools
# Frontend: F12
# API: http://localhost:8000/docs (Swagger UI)
```

### Debugging
```bash
# Logs Python détaillés
export LOG_LEVEL=DEBUG
python -m uvicorn app.main:app --reload

# Frontend logs
# DevTools > Console tab

# Tests avec screenshots
# playwright-report/index.html
```

### Optimisation
```bash
# Cache dependencies
npm ci  # Use package-lock.json
pip install --cache-dir=/tmp ...

# Parallel test runs
npm run test:e2e -- --workers=4

# Reduce verbosity
npm run test:e2e -- --reporter=dot
```

---

## 🚨 Emergency Troubleshooting

```bash
# 1. Reset everything
rm -rf node_modules .next
rm -rf backend/__pycache__ backend/.pytest_cache
npm install
cd backend && pip install -r requirements.txt

# 2. Fresh database
docker compose down -v
docker compose up -d

# 3. Check logs
docker compose logs -f web backend

# 4. Rebuild images
docker compose build --no-cache
```

---

## ✨ Success Indicators

You'll know everything works when:

- ✅ `npm run test:e2e` runs without errors
- ✅ Skeleton screens visible during load
- ✅ Export buttons download CSV/JSON files
- ✅ Date validation prevents invalid elections
- ✅ Rate limiting blocks 6th login attempt
- ✅ Email confirmation sent post-vote
- ✅ All 9 E2E tests pass

---

## 📞 Support

**Problem with setup?**
- Check `VERIFICATION_CHECKLIST.md` section "Problèmes Courants"
- Review `API_ENDPOINTS.md` for endpoint validation
- Run `npm run test:e2e:debug` for detailed output

**Need API examples?**
- See `API_ENDPOINTS.md` section "Request/Response Examples"
- Use Postman + collection template

**Testing issues?**
- Review `tests/e2e/README.md`
- Check `playwright.config.ts` settings
- Run `npm run test:e2e:ui` for debugging

---

**Generated**: 2024
**Last Updated**: Today
**Status**: Ready to Go 🚀
