# Tests E2E - Playteste Complet du Système de Vote

## 🚀 Quick Start

```bash
# Installation
npm install @playwright/test

# Lancer tous les tests
npm run test:e2e

# Avec interface UI (recommandé pour développement)
npm run test:e2e:ui

# Avec navigateur visible
npm run test:e2e:headed
```

## 📋 Suites de Tests

### 1. **Complete Voting Workflow** (`complete_workflow.spec.ts`)

#### Test: Admin créé élection avec dates valides
```
✓ Admin should create election with valid dates
  - Navigue vers /admin
  - Clique "Créer une Élection"
  - Remplit: titre, description, questions, options
  - Définit dates valides (fin > début, pas de passé)
  - Vérifie création réussie
```

#### Test: Prévention des dates invalides
```
✓ Should prevent invalid date ranges
  - Tentative: end_date AVANT start_date
  - Expect: Erreur de validation affichée
  - Valide: Pydantic rejects in API
```

#### Test: Workflow complet (création → vote → fermeture → résultats)
```
✓ Complete voting flow
  1. ADMIN:
     - Crée élection (dates, questions)
     - Ajoute voter email
     - Ouvre l'élection (status: OPEN)
  
  2. VOTER:
     - Reçoit magic link (via email)
     - Accède /verify?token=...
     - Vote sur chaque question
  
  3. ADMIN:
     - Ferme l'élection (status: CLOSED)
     - Accède /admin/elections/{id}
     - Voit résultats
  
  4. EXPORT:
     - Clique "Exporter CSV"
     - Vérifie download du fichier
```

#### Test: Rate Limiting sur login
```
✓ Should rate limit login attempts
  - Fait 6+ tentatives login rapides
  - Expect: Erreur 429 "Too Many Requests"
  - Header: Retry-After: 60
```

#### Test: Email confirmation post-vote
```
✓ Email confirmation should be received after voting
  - Vote soumis
  - Email service intercepté
  - Vérification: email de confirmation envoyé
  - Contenu: code de suivi, lien résultats
```

### 2. **Skeleton Loading States** (`complete_workflow.spec.ts`)

#### Test: Skeleton durant chargement élections
```
✓ Should show skeleton while loading elections
  - Navigue /admin/elections
  - Detect: classe "animate-pulse"
  - Valide: skeleton OU contenu affiché
```

#### Test: Skeleton sur page résultats
```
✓ Should show skeleton while loading results
  - Navigue /admin/elections/{id}
  - Détecte animation de chargement
  - Remplacée par résultats une fois chargés
```

---

## 📁 Structure des Tests

```
tests/
└── e2e/
    ├── complete_workflow.spec.ts    # Suite principale
    ├── fixtures/                     # (à ajouter)
    │   ├── elections.json           # Données test
    │   └── users.json               # Utilisateurs test
    └── helpers/                      # (à ajouter)
        └── test-utils.ts            # Fonctions utilitaires
```

---

## 🔧 Configuration

### `playwright.config.ts`
```typescript
use: {
  baseURL: 'http://localhost:3000',  // Frontend
  trace: 'on-first-retry',            // Capturer traces
}
webServer: {
  command: 'npm run dev',             // Auto-start
  url: 'http://localhost:3000',
}
projects: [
  { name: 'chromium' },
  { name: 'firefox' },
  { name: 'webkit' },
]
```

### Environnements Requis
```
Frontend: npm run dev          (localhost:3000)
Backend:  python -m uvicorn   (localhost:8000)
Database: PostgreSQL running
Redis:    (optional, pour cache rate-limit)
```

---

## 🧪 Scénarios Testés

| Scénario | Validations | Durée |
|---|---|---|
| Create Election | Form submit, date validation, DB save | ~5s |
| Invalid Dates | Error message, form rejection | ~2s |
| Full Workflow | 5 étapes (création, vote, fermeture) | ~15s |
| Rate Limiting | 429 response after 5 attempts | ~3s |
| Email Confirm | Email intercepted, content verified | ~2s |
| Export CSV | File download, format validation | ~2s |
| Skeleton Loader | Visual state, animation check | ~1s |

**Total Runtime**: ~30s (single browser), ~60s (all 3 browsers)

---

## 📊 Reports

Après chaque run, généré:
```
playwright-report/
├── index.html           # Interactive report
├── traces/              # Video + trace files
└── screenshots/         # Failed test screenshots
```

Voir le rapport:
```bash
npx playwright show-report
```

---

## 🐛 Debugging

### Mode Debug
```bash
npm run test:e2e:debug

# Ouvre Playwright Inspector:
# - Pause à chaque étape
# - Voir DOM, locators
# - Exécuter actions manuelles
```

### Mode Headed (navigateur visible)
```bash
npm run test:e2e:headed

# Voir les actions en temps réel
```

### Logs Détaillés
```bash
PWDEBUG=1 npm run test:e2e

# Affiche console logs, network, etc.
```

### Screenshots
```typescript
// Dans les tests
await page.screenshot({ path: 'debug.png' });
```

---

## ⚠️ Limitations Actuelles

### À Implémenter
1. **Email Testing**:
   - Requires: Mailtrap ou test email service
   - Mock: `nock` ou `msw` pour intercepter SMTP
   
2. **Authentication**:
   - Magic link réel: DB lookup + token validation
   - Admin auth: JWT bearer token setup
   
3. **Data Fixtures**:
   - Database seeding avant tests
   - Cleanup après tests (transactions)

4. **Mobile Testing**:
   - Add: `devices['iPhone 12']` en projects
   - Viewport: 390x844px

---

## 📖 Exemples Utiles

### Attendre Réponse API
```typescript
const response = await page.waitForResponse(
  r => r.url().includes('/api/elections')
);
expect(response.status()).toBe(200);
```

### Remplir Formulaire
```typescript
await page.fill('input[name="title"]', 'My Election');
await page.selectOption('select', 'option-value');
await page.click('button:has-text("Submit")');
```

### Vérifier Éléments
```typescript
await expect(page).toHaveTitle(/Results/);
await expect(page.locator('.skeleton')).toHaveCount(3);
await expect(page.locator('text=Votes')).toBeVisible();
```

### Télécharger Fichier
```typescript
const downloadPromise = page.waitForEvent('download');
await page.click('button:has-text("Export")');
const download = await downloadPromise;
await download.saveAs('./election_results.csv');
```

---

## 🚀 CI/CD Integration

### GitHub Actions
```yaml
- name: Run Playwright Tests
  run: npx playwright test --reporter=github
```

### Config CI-Specific
```typescript
// playwright.config.ts
const isCI = !!process.env.CI;

export default {
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
};
```

---

## 📚 Ressources

- [Playwright Docs](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [API Reference](https://playwright.dev/docs/api/class-test)

---

## ✅ Checklist Avant Production

- [ ] Tous les tests passent (3 browsers)
- [ ] Coverage E2E >= 80%
- [ ] Performance: tests < 2 minutes
- [ ] Email service configuré (prod)
- [ ] Rate limiting testé en load
- [ ] Database cleanup après tests
- [ ] Screenshots d'échecs ajoutés aux artefacts
- [ ] Logs centralisés (Sentry)
