# ✅ CHECKLIST DE VÉRIFICATION

## 🔍 Validation des Modifications

Vérifiez que tous les fichiers suivants existent et sont correctement modifiés:

### Backend 🔧

#### `/backend/app/schemas/schemas.py`
- [ ] `field_validator` importé de pydantic
- [ ] `ElectionBase` a `validate_end_date()` method
- [ ] `ElectionBase` a `validate_start_date()` method
- [ ] Messages d'erreur en français

#### `/backend/app/main.py`
- [ ] Import: `from slowapi import Limiter`
- [ ] Import: `from slowapi.exceptions import RateLimitExceeded`
- [ ] Instance: `limiter = Limiter(key_func=get_remote_address)`
- [ ] Exception handler pour RateLimitExceeded (returns 429)

#### `/backend/app/api/v1/auth.py`
- [ ] Import: `from slowapi import Limiter`
- [ ] Request parameter dans endpoints
- [ ] `login()` endpoint a `limiter.try_increment("auth:login", 5, 60)`
- [ ] `register()` endpoint a `limiter.try_increment("auth:register", 5, 60)`
- [ ] Erreur 429 retourne message français

#### `/backend/app/api/v1/elections.py`
- [ ] Import: `from fastapi.responses import StreamingResponse`
- [ ] Import: `import csv`, `import io`
- [ ] Endpoint: `GET /elections/{id}/export`
- [ ] Paramètre: `format: str = "csv"`
- [ ] CSV export implémenté
- [ ] JSON export implémenté
- [ ] Admin-only access check (current_user)

#### `/backend/requirements.txt`
- [ ] `slowapi==0.1.9` ajouté

#### `/backend/app/services/email_service.py`
- [ ] Méthode: `send_vote_confirmation()` existe
- [ ] Async implementation
- [ ] HTML template avec code de suivi

#### `/backend/app/api/v1/ballots.py`
- [ ] Ligne ~87-92: Appel à `email_service.send_vote_confirmation()`
- [ ] Condition: `if voter_email:`

---

### Frontend 🎨

#### `/src/components/ui/SkeletonLoader.tsx` (NOUVEAU)
- [ ] Fichier créé
- [ ] 5 composants exportés:
  - [ ] `SkeletonLoader`
  - [ ] `SkeletonCard`
  - [ ] `SkeletonList`
  - [ ] `SkeletonForm`
  - [ ] `SkeletonResults`
- [ ] `animate-pulse` Tailwind classe
- [ ] Dark mode support

#### `/src/components/admin/ResultsViewer.tsx`
- [ ] Import: `{ Button }` from UI
- [ ] Import: `useState`
- [ ] Variable: `const [isExporting, setIsExporting] = useState(false)`
- [ ] Fonction: `handleExport(format: 'csv' | 'json')`
- [ ] Boutons export visibles en haut du composant
- [ ] Download fonctionne pour CSV et JSON

#### `/package.json`
- [ ] `@playwright/test` dans devDependencies
- [ ] Scripts de test E2E ajoutés:
  - [ ] `test:e2e`
  - [ ] `test:e2e:ui`
  - [ ] `test:e2e:headed`
  - [ ] `test:e2e:debug`

---

### Tests 🧪

#### `/playwright.config.ts` (NOUVEAU)
- [ ] Fichier créé avec configuration complète
- [ ] `baseURL: 'http://localhost:3000'`
- [ ] Chromium, Firefox, WebKit projects
- [ ] `webServer` auto-start configuré

#### `/tests/e2e/complete_workflow.spec.ts` (NOUVEAU)
- [ ] Fichier créé
- [ ] 9 tests définis:
  - [ ] Create election with valid dates
  - [ ] Prevent invalid date ranges
  - [ ] Complete voting flow
  - [ ] Rate limit login attempts
  - [ ] Email confirmation
  - [ ] Skeleton loading - elections
  - [ ] Skeleton loading - results
- [ ] Imports Playwright correctement

---

### Documentation 📚

#### `/FEATURES_IMPLEMENTED.md` (NOUVEAU)
- [ ] Fichier créé
- [ ] 6 features documentées (1-6)
- [ ] Exemples de code fournis
- [ ] Security notes inclus
- [ ] Usage examples

#### `/SPRINT_SUMMARY.md` (NOUVEAU)
- [ ] Fichier créé
- [ ] Résumé de chaque feature
- [ ] Table status 6/6 ✅
- [ ] Modifications listées
- [ ] Next steps

#### `/tests/e2e/README.md` (NOUVEAU)
- [ ] Fichier créé
- [ ] Quick start guide
- [ ] Test descriptions
- [ ] Debugging guide
- [ ] Limitations

#### `/.env.test` (NOUVEAU)
- [ ] Fichier créé
- [ ] Variables test environment

#### `/.gitignore`
- [ ] Section testing ajoutée:
  - [ ] test-results/
  - [ ] playwright-report/
  - [ ] playwright/.cache/

#### `/install-features.sh` (NOUVEAU)
- [ ] Fichier créé (Linux/Mac)

#### `/install-features.ps1` (NOUVEAU)
- [ ] Fichier créé (Windows)

---

## 🧪 Tests Locaux

Avant de commitonner, testez:

### Backend
```bash
# Vérifier imports
python -c "from slowapi import Limiter; print('✓ slowapi')"

# Vérifier Pydantic validators
python -c "
from app.schemas.schemas import ElectionCreate
from datetime import datetime

# Test: dates invalides
try:
    e = ElectionCreate(
        title='Test',
        start_date=datetime.utcnow(),
        end_date=datetime.utcnow()  # INVALIDE: end <= start
    )
except Exception as ex:
    print(f'✓ Validation works: {ex}')
"

# Démarrer backend
cd backend
python -m uvicorn app.main:app --reload
```

### Frontend
```bash
# Installer dépendances
npm install

# Vérifier SkeletonLoader importe correctement
npx tsc --noEmit src/components/ui/SkeletonLoader.tsx

# Vérifier ResultsViewer compile
npx tsc --noEmit src/components/admin/ResultsViewer.tsx

# Build
npm run build
```

### Tests E2E
```bash
# Installer Playwright
npm install -D @playwright/test
npx playwright install

# Lister tests
npx playwright test --list

# Run une suite
npx playwright test complete_workflow.spec.ts
```

---

## ✨ Signes de Succès

- ✅ Aucune erreur TypeScript
- ✅ Aucune erreur Python
- ✅ Backend démarre sans erreur
- ✅ Frontend compile sans erreur
- ✅ Tests E2E listés (9 tests)
- ✅ Fichiers doc créés
- ✅ .gitignore updated

---

## 🚨 Problèmes Courants

### Erreur: "Module @playwright/test not found"
```bash
npm install -D @playwright/test
npx playwright install --with-deps
```

### Erreur: "slowapi not found"
```bash
cd backend
pip install slowapi==0.1.9
```

### Erreur: "Pydantic field_validator not found"
```bash
# Vérifier version
pip show pydantic
# Doit être >= 2.0
pip install --upgrade pydantic
```

### Frontend import error sur SkeletonLoader
```bash
# Vérifier fichier existe
ls -la src/components/ui/SkeletonLoader.tsx
# Vérifier casse du chemin (case-sensitive sur Linux/Mac!)
```

### Tests E2E timeouts
```bash
# Augmenter dans playwright.config.ts
timeout: 30000,  // 30 secondes

# Ou run avec verbose
PWDEBUG=1 npm run test:e2e
```

---

## 📞 Support rapide

**Question**: Date validation ne fonctionne pas?
**Réponse**: Vérifiez imports en haut de schemas.py (field_validator, validator)

**Question**: Export CSV vide?
**Réponse**: Vérifiez election.id, election.questions dans database

**Question**: Tests E2E échouent?
**Réponse**: Vérifiez frontend/backend running sur ports corrects (3000, 8000)

**Question**: Email confirmation pas envoyé?
**Réponse**: Vérifiez MAIL_ENABLED=true dans .env et ballots.py ligne 88

---

## 🎉 Procédure Finale

Une fois tout validé:

```bash
# 1. Commit changes
git add .
git commit -m "feat: implement security & UX features

- Add strict date validation (Pydantic validators)
- Implement rate limiting on auth endpoints (slowapi)
- Add email confirmation post-vote
- Implement CSV/JSON export for results
- Create skeleton loading components
- Add E2E test suite (Playwright)
- Comprehensive documentation

Closes #XX"

# 2. Push
git push origin feature/security-ux-improvements

# 3. Create PR
# Let GitHub Actions run tests

# 4. Deploy to staging
# Test email service
# Monitor metrics

# 5. Merge to main
```

---

**Status**: Ready for review ✅
**Last Updated**: 2024
**Tested By**: [Your Name]
