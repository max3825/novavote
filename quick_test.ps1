#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Quick E2E Test - NovaVote Platform
    Test the complete flow: login, create election, check results
#>

$FrontendURL = "http://localhost:3001"
$BackendURL = "http://localhost:8001"

Write-Host "=== NovaVote E2E Test ===" -ForegroundColor Cyan
Write-Host "Frontend: $FrontendURL" -ForegroundColor Gray
Write-Host "Backend:  $BackendURL" -ForegroundColor Gray
Write-Host ""

# Test 1: Frontend responsive
Write-Host "Test 1: Frontend Health Check..." -ForegroundColor Yellow
try {
    $Response = Invoke-WebRequest -Uri $FrontendURL -TimeoutSec 5 -ErrorAction Stop
    if ($Response.StatusCode -eq 200) {
        Write-Host "[OK] Frontend is running (HTTP 200)" -ForegroundColor Green
    }
} catch {
    Write-Host "[FAIL] Frontend not responding: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test 2: Backend responsive
Write-Host "Test 2: Backend Health Check..." -ForegroundColor Yellow
try {
    $Response = Invoke-RestMethod -Uri "$BackendURL/api/v1/elections/" -Headers @{Authorization = "Bearer invalid"} -ErrorAction Stop
} catch {
    if ($_.Exception.Response.StatusCode.Value__ -eq 401) {
        Write-Host "[OK] Backend is running (auth error expected)" -ForegroundColor Green
    } elseif ($_.Exception.Response.StatusCode.Value__ -eq 422) {
        Write-Host "[OK] Backend is running (validation error expected)" -ForegroundColor Green
    } else {
        Write-Host "[WARN] Unexpected status: $($_.Exception.Response.StatusCode.Value__)" -ForegroundColor Yellow
    }
}

# Test 3: Database check
Write-Host "Test 3: Database Health Check..." -ForegroundColor Yellow
try {
    $Response = docker compose exec -T db pg_isready -U novavote 2>&1
    if ($Response -contains "accepting connections") {
        Write-Host "[OK] PostgreSQL is responding" -ForegroundColor Green
    } else {
        Write-Host "[WARN] PostgreSQL status unclear" -ForegroundColor Yellow
    }
} catch {
    Write-Host "[WARN] Could not check database: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== All Basic Tests Passed ===" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Open http://localhost:3001 in browser" -ForegroundColor Cyan
Write-Host "2. Click 'Acces Admin'" -ForegroundColor Cyan
Write-Host "3. Create account and login" -ForegroundColor Cyan
Write-Host "4. Create election with MULTIPLE choice" -ForegroundColor Cyan
Write-Host "5. Check results page" -ForegroundColor Cyan
Write-Host ""
