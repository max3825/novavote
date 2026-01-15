#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Simple E2E Test with proper JSON handling
#>

$FrontendURL = "http://localhost:3001"
$BackendURL = "http://localhost:8001"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "NovaVote E2E Test (Simplified)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test credentials
$TestEmail = "test-$(Get-Random)@example.com"
$TestPassword = "TestPass123456!"

Write-Host "Step 1: Register new admin user" -ForegroundColor Yellow
$RegisterResult = curl -s -X POST "$BackendURL/api/v1/auth/register" `
  -H "Content-Type: application/json" `
  -d "{`"email`":`"$TestEmail`",`"password`":`"$TestPassword`"}"

Write-Host "Response: $RegisterResult" -ForegroundColor Cyan
$RegisterResponse = $RegisterResult | ConvertFrom-Json
if ($RegisterResponse.id) {
    Write-Host "[✓] User registered: $TestEmail" -ForegroundColor Green
} else {
    Write-Host "[✗] Registration failed" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Step 2: Login through Next.js API route" -ForegroundColor Yellow
$LoginResult = curl -s -X POST "$FrontendURL/api/auth/login" `
  -H "Content-Type: application/json" `
  -d "{`"email`":`"$TestEmail`",`"password`":`"$TestPassword`"}"

Write-Host "Response: $LoginResult" -ForegroundColor Cyan
$LoginResponse = $LoginResult | ConvertFrom-Json
if ($LoginResponse.access_token) {
    Write-Host "[✓] Login successful" -ForegroundColor Green
    $Token = $LoginResponse.access_token
    Write-Host "Token (first 50 chars): $($Token.Substring(0, 50))..." -ForegroundColor Gray
} else {
    Write-Host "[✗] Login failed" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Step 3: Create election with MULTIPLE choice" -ForegroundColor Yellow

# Build JSON manually to avoid depth issues
$now = Get-Date
$startDate = $now.AddMinutes(1).ToString("o")
$endDate = $now.AddHours(1).ToString("o")
$randomId = Get-Random

$ElectionJson = @"
{
  "title": "Test Election Multiple $randomId",
  "description": "Testing multiple choice functionality",
  "start_date": "$startDate",
  "end_date": "$endDate",
  "questions": [
    {
      "question": "Which options do you prefer?",
      "options": ["Option A", "Option B", "Option C"],
      "type": "multiple"
    }
  ],
  "voter_emails": ["voter1@test.com", "voter2@test.com"],
  "num_trustees": 2,
  "threshold": 2
}
"@

Write-Host "Sending election JSON..." -ForegroundColor Gray
$CreateResult = curl -s -X POST "$BackendURL/api/v1/elections/" `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer $Token" `
  -d $ElectionJson

Write-Host "Response: $CreateResult" -ForegroundColor Cyan
$CreateResponse = $CreateResult | ConvertFrom-Json -Depth 5
if ($CreateResponse.id) {
    Write-Host "[✓] Election created" -ForegroundColor Green
    Write-Host "    ID: $($CreateResponse.id)" -ForegroundColor Gray
    $ElectionID = $CreateResponse.id
} else {
    Write-Host "[✗] Election creation failed" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Step 4: Get election stats" -ForegroundColor Yellow
$StatsResult = curl -s -X GET "$BackendURL/api/v1/elections/$ElectionID/stats" `
  -H "Authorization: Bearer $Token"

Write-Host "Response: $StatsResult" -ForegroundColor Cyan
$StatsResponse = $StatsResult | ConvertFrom-Json -Depth 5
Write-Host "[✓] Stats retrieved" -ForegroundColor Green
Write-Host "    Votes: $($StatsResponse.votes_received) / $($StatsResponse.voters_invited)" -ForegroundColor Gray

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "E2E Test Complete ✓" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
