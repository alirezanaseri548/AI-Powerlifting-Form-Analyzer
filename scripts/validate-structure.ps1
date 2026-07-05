param(
    [string]$ProjectRoot = (Resolve-Path "\..").Path
)

$requiredPaths = @(
    "apps",
    "apps\mobile",
    "apps\api",
    "apps\ml-service",
    "packages\shared-types",
    "packages\config",
    "infra",
    "docs",
    "scripts",
    "README.md",
    ".gitignore",
    ".env.example",
    "docker-compose.yml"
)

$missing = @()

foreach ($path in $requiredPaths) {
    $fullPath = Join-Path $ProjectRoot $path
    if (-not (Test-Path $fullPath)) {
        $missing += $path
    }
}

if ($missing.Count -gt 0) {
    Write-Host "Missing required paths/files:" -ForegroundColor Red
    $missing | ForEach-Object { Write-Host " - $_" -ForegroundColor Red }
    exit 1
} else {
    Write-Host "Project structure validation passed." -ForegroundColor Green
    exit 0
}
