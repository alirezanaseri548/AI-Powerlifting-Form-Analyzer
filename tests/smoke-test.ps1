param(
    [string]$ProjectRoot = (Resolve-Path "\..").Path
)

Write-Host "Running Phase 1 smoke test..." -ForegroundColor Cyan

# 1) Validate structure
& "C:\Projects\ai-powerlifting-form-analyzer\scripts\validate-structure.ps1" -ProjectRoot "C:\Projects\ai-powerlifting-form-analyzer"
if ($LASTEXITCODE -ne 0) {
    Write-Host "Structure validation failed." -ForegroundColor Red
    exit 1
}

# 2) Check docker compose file exists
if (-not (Test-Path (Join-Path $ProjectRoot "docker-compose.yml"))) {
    Write-Host "docker-compose.yml not found." -ForegroundColor Red
    exit 1
}

# 3) Try docker compose config if docker exists
$dockerExists = Get-Command docker -ErrorAction SilentlyContinue
if ($dockerExists) {
    Push-Location $ProjectRoot
    docker compose config | Out-Null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "docker compose config failed." -ForegroundColor Red
        Pop-Location
        exit 1
    }
    Pop-Location
    Write-Host "docker compose config passed." -ForegroundColor Green
} else {
    Write-Host "Docker not found. Skipping docker compose validation." -ForegroundColor Yellow
}

Write-Host "Phase 1 smoke test passed." -ForegroundColor Green
exit 0
