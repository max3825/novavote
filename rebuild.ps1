#!/usr/bin/env pwsh
<#
.SYNOPSIS
    PROTOCOL DE REBUILD DOCKER - NovaVote
    
.DESCRIPTION
    Sequence complète de rebuild:
    1. Stop tous les conteneurs
    2. Supprime les volumes (reset DB)
    3. Recompile sans cache
    4. Relance tout
#>

Write-Host "[DOCKER REBUILD] Starting protocol..." -ForegroundColor Cyan


# Configuration
$WorkingDir = "c:\Users\pelissim\Documents\platforme de vote"
$DockerCompose = "docker-compose.yml"

# Fonction pour exécuter une commande et afficher le résultat
function Invoke-DockerCommand {
    param(
        [string]$Description,
        [string]$Command
    )
    Write-Host "=> $Description..." -ForegroundColor Yellow
    Write-Host "   Command: $Command" -ForegroundColor Gray
    
    Invoke-Expression $Command
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] $Description done" -ForegroundColor Green
    } else {
        Write-Host "[FAIL] $Description failed (code: $LASTEXITCODE)" -ForegroundColor Red
        exit 1
    }
    Write-Host ""
}

# Changement de répertoire
Set-Location $WorkingDir
Write-Host "📂 Working directory: $(Get-Location)" -ForegroundColor Gray
Write-Host ""

# STEP 1: Stop les conteneurs
Invoke-DockerCommand -Description "Arrêt des conteneurs existants" -Command "docker compose down -v"

# STEP 2: Nettoyer les volumes persistants
Write-Host "Cleaning dangling volumes..." -ForegroundColor Yellow
Invoke-DockerCommand -Description "Suppression des volumes dangling" -Command "docker volume prune -f"
Write-Host ""

# STEP 3: Rebuild sans cache
Invoke-DockerCommand -Description "Rebuild of API service (no cache)" -Command "docker compose build --no-cache api"
Invoke-DockerCommand -Description "Rebuild of Frontend service (no cache)" -Command "docker compose build --no-cache frontend"
Invoke-DockerCommand -Description "Rebuild of Database service (no cache)" -Command "docker compose build --no-cache db"
Write-Host ""

# STEP 4: Relance tout
Invoke-DockerCommand -Description "Démarrage de tous les services" -Command "docker compose up -d"
Write-Host ""

# STEP 5: Vérification de la santé
Write-Host "Waiting 15 seconds for services to start..." -ForegroundColor Cyan
Start-Sleep -Seconds 15

Write-Host "Health check of containers..." -ForegroundColor Yellow
$Containers = docker compose ps --format json | ConvertFrom-Json

foreach ($Container in $Containers) {
    $Status = $Container.State
    $Name = $Container.Service
    
    if ($Status -eq "running") {
        Write-Host "OK $Name`: Running" -ForegroundColor Green
    } else {
        Write-Host "FAIL $Name`: $Status" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "BUILD COMPLETE!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3001" -ForegroundColor Cyan
Write-Host "Backend:  http://localhost:8000" -ForegroundColor Cyan
Write-Host ""
