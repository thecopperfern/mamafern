# Google Analytics MCP Setup Script for Claude Code
# Run this after completing Google Cloud OAuth setup

param(
    [Parameter(Mandatory=$true)]
    [string]$ProjectId,

    [Parameter(Mandatory=$false)]
    [string]$CredentialsPath = "$env:APPDATA\gcloud\application_default_credentials.json"
)

Write-Host "Setting up Google Analytics MCP Server..." -ForegroundColor Cyan
Write-Host ""

# Check if pipx is available
$pipxPath = "C:\Users\$env:USERNAME\AppData\Roaming\Python\Python314\Scripts\pipx.exe"
if (-not (Test-Path $pipxPath)) {
    Write-Host "ERROR: pipx not found at $pipxPath" -ForegroundColor Red
    Write-Host "Run: python -m pip install --user pipx" -ForegroundColor Yellow
    exit 1
}

# Check if credentials file exists
if (-not (Test-Path $CredentialsPath)) {
    Write-Host "ERROR: Credentials file not found at $CredentialsPath" -ForegroundColor Red
    Write-Host ""
    Write-Host "You need to authenticate first. Run:" -ForegroundColor Yellow
    Write-Host "  gcloud auth application-default login --scopes https://www.googleapis.com/auth/analytics.readonly" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Or manually place your credentials JSON at:" -ForegroundColor Yellow
    Write-Host "  $CredentialsPath" -ForegroundColor Cyan
    exit 1
}

Write-Host "✓ pipx found" -ForegroundColor Green
Write-Host "✓ Credentials found at: $CredentialsPath" -ForegroundColor Green
Write-Host ""

# Add MCP server to Claude Code
Write-Host "Adding Google Analytics MCP server to Claude Code..." -ForegroundColor Cyan

$addCommand = @"
claude mcp add google-analytics ``
  -e GOOGLE_APPLICATION_CREDENTIALS="$CredentialsPath" ``
  -e GOOGLE_PROJECT_ID="$ProjectId" ``
  -- pipx run analytics-mcp
"@

Write-Host "Running:" -ForegroundColor Yellow
Write-Host $addCommand -ForegroundColor Gray
Write-Host ""

Invoke-Expression $addCommand

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✓ Google Analytics MCP server added successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Verifying connection..." -ForegroundColor Cyan
    claude mcp list
    Write-Host ""
    Write-Host "You can now ask Claude about your GA4 data!" -ForegroundColor Green
    Write-Host "Try: 'What were my top 5 pages by pageviews last week?'" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "ERROR: Failed to add MCP server" -ForegroundColor Red
    Write-Host "Check the error message above for details" -ForegroundColor Yellow
}
