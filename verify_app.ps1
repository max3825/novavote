# ====================================================================
# verify_app.ps1 - VÉRIFICATION RAPIDE DES SERVICES
# ====================================================================

$ErrorActionPreference = "Stop"

Write-Host "`n🔍 Vérification des services NovaVote..." -ForegroundColor Cyan
Write-Host "="*60 -ForegroundColor Gray

# Test Frontend
Write-Host "`n▶️  Test Frontend (http://localhost:3001)..." -ForegroundColor Yellow
try {
    $frontendResponse = Invoke-WebRequest -Uri "http://localhost:3001" -Method GET -UseBasicParsing -TimeoutSec 5
    if ($frontendResponse.StatusCode -eq 200) {
        Write-Host "✅ FRONTEND OK (Status: $($frontendResponse.StatusCode))" -ForegroundColor Green
        $frontendOK = $true
    } else {
        Write-Host "⚠️  Frontend répond mais avec status: $($frontendResponse.StatusCode)" -ForegroundColor Yellow
        $frontendOK = $false
    }
} catch {
    Write-Host "❌ FRONTEND INACCESSIBLE: $_" -ForegroundColor Red
    $frontendOK = $false
}

# Test Backend
Write-Host "`n▶️  Test Backend (http://localhost:8001/health)..." -ForegroundColor Yellow
try {
    $backendResponse = Invoke-WebRequest -Uri "http://localhost:8001/health" -Method GET -UseBasicParsing -TimeoutSec 5
    if ($backendResponse.StatusCode -eq 200) {
        Write-Host "✅ BACKEND OK (Status: $($backendResponse.StatusCode))" -ForegroundColor Green
        $backendOK = $true
    } else {
        Write-Host "⚠️  Backend répond mais avec status: $($backendResponse.StatusCode)" -ForegroundColor Yellow
        $backendOK = $false
    }
} catch {
    Write-Host "❌ BACKEND INACCESSIBLE: $_" -ForegroundColor Red
    $backendOK = $false
}

# Résumé final
Write-Host "`n" + "="*60 -ForegroundColor Gray

if ($frontendOK -and $backendOK) {
    Write-Host "✅ TOUT EST OK - L'application est opérationnelle" -ForegroundColor Green -BackgroundColor Black
    Write-Host ""
    Write-Host "Accédez à l'app: http://localhost:3001" -ForegroundColor Cyan
    Write-Host ""
    exit 0
} else {
    Write-Host "❌ ÉCHEC - Des services ne répondent pas" -ForegroundColor Red -BackgroundColor Black
    Write-Host ""
    Write-Host "Vérifiez les conteneurs Docker:" -ForegroundColor Yellow
    Write-Host "  docker compose ps" -ForegroundColor Gray
    Write-Host "  docker compose logs web" -ForegroundColor Gray
    Write-Host "  docker compose logs api" -ForegroundColor Gray
    Write-Host ""
    exit 1
}
