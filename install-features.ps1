# Installation script for all features (Windows PowerShell)

Write-Host "🚀 Installing Feature Dependencies..." -ForegroundColor Green

# Frontend
Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Cyan
npm install

# Playwright
Write-Host "🎭 Installing Playwright..." -ForegroundColor Cyan
npm install -D @playwright/test
npx playwright install --with-deps

# Backend
Write-Host "🔗 Installing backend dependencies..." -ForegroundColor Cyan
Set-Location backend
pip install -r requirements.txt
Set-Location ..

Write-Host "✅ Installation complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Yellow
Write-Host "1. Start backend: cd backend && python -m uvicorn app.main:app --reload"
Write-Host "2. Start frontend: npm run dev"
Write-Host "3. Run E2E tests: npm run test:e2e"
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Yellow
Write-Host "- FEATURES_IMPLEMENTED.md - Complete feature overview"
Write-Host "- SPRINT_SUMMARY.md - Implementation summary"
Write-Host "- tests/e2e/README.md - Testing guide"
