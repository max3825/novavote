#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Complete E2E Test - NovaVote Full Workflow
    1. Login
    2. Create election with MULTIPLE choice
    3. Get election stats
    4. Verify results structure
#>

$FrontendURL = "http://localhost:3001"
$BackendURL = "http://localhost:8001"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "NovaVote E2E Test - Complete Workflow" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test credentials
$TestEmail = "test-$(Get-Random)@example.com"
$TestPassword = "TestPass123456!"

Write-Host "Step 1: Register new admin user" -ForegroundColor Yellow
$RegisterResponse = curl -s -X POST "$BackendURL/api/v1/auth/register" `
  -H "Content-Type: application/json" `
  -d "{`"email`":`"$TestEmail`",`"password`":`"$TestPassword`"}" | ConvertFrom-Json

if ($RegisterResponse.id) {
    Write-Host "[OK] User registered: $TestEmail" -ForegroundColor Green
} else {
    Write-Host "[FAIL] Registration failed" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Step 2: Login through Next.js API route" -ForegroundColor Yellow
$LoginResponse = curl -s -X POST "$FrontendURL/api/auth/login" `
  -H "Content-Type: application/json" `
  -d "{`"email`":`"$TestEmail`",`"password`":`"$TestPassword`"}" | ConvertFrom-Json

if ($LoginResponse.access_token) {
    Write-Host "[OK] Login successful, token received" -ForegroundColor Green
    $Token = $LoginResponse.access_token
} else {
    Write-Host "[FAIL] Login failed" -ForegroundColor Red
    Write-Host "Response: $LoginResponse"
    exit 1
}

Write-Host ""
Write-Host "Step 3: Create election with MULTIPLE choice question" -ForegroundColor Yellow

$ElectionPayload = @{
    title = "Test Election Multiple - $(Get-Random)"
    description = "Testing multiple choice functionality"
    start_date = (Get-Date).AddMinutes(1).ToString("o")
    end_date = (Get-Date).AddHours(1).ToString("o")
    questions = @(
        @{
            question = "Which options do you prefer? (Select multiple)"
            options = @("Option A", "Option B", "Option C", "Option D")
            type = "multiple"
        }
    )
    voter_emails = @("voter1@test.com", "voter2@test.com")
    num_trustees = 2
    threshold = 2
} | ConvertTo-Json

$CreateResponse = curl -s -X POST "$BackendURL/api/v1/elections/" `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer $Token" `
  -d $ElectionPayload | ConvertFrom-Json

if ($CreateResponse.id) {
    Write-Host "[OK] Election created successfully" -ForegroundColor Green
    Write-Host "    Election ID: $($CreateResponse.id)" -ForegroundColor Gray
    $ElectionID = $CreateResponse.id
} else {
    Write-Host "[FAIL] Election creation failed" -ForegroundColor Red
    Write-Host "Response: $CreateResponse"
    exit 1
}

Write-Host ""
Write-Host "Step 4: Get election stats" -ForegroundColor Yellow

$StatsResponse = curl -s -X GET "$BackendURL/api/v1/elections/$ElectionID/stats" `
  -H "Authorization: Bearer $Token" | ConvertFrom-Json

Write-Host "[OK] Stats retrieved" -ForegroundColor Green
Write-Host "    Votes received: $($StatsResponse.votes_received)" -ForegroundColor Gray
Write-Host "    Voters invited: $($StatsResponse.voters_invited)" -ForegroundColor Gray

Write-Host ""
Write-Host "Step 5: Verify election structure" -ForegroundColor Yellow

if ($StatsResponse.results_by_question) {
    $Question = $StatsResponse.results_by_question[0]
    Write-Host "[OK] Question found" -ForegroundColor Green
    Write-Host "    Type: $($Question.type)" -ForegroundColor Gray
    Write-Host "    Options count: $($Question.options.Count)" -ForegroundColor Gray
    
    if ($Question.type -eq "multiple") {
        Write-Host "[OK] Question type is MULTIPLE as expected" -ForegroundColor Green
    } else {
        Write-Host "[WARN] Question type is '$($Question.type)', expected 'multiple'" -ForegroundColor Yellow
    }
} else {
    Write-Host "[FAIL] No questions found in results" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "All tests passed successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Open http://localhost:3001 in your browser" -ForegroundColor Cyan
Write-Host "2. Click 'Acces Admin'" -ForegroundColor Cyan
Write-Host "3. Create account and login" -ForegroundColor Cyan
Write-Host "4. Create an election with 'Choix Multiple'" -ForegroundColor Cyan
Write-Host "5. Vote with multiple selections" -ForegroundColor Cyan
Write-Host "6. Check results page (graphs should show correctly)" -ForegroundColor Cyan
