$ErrorActionPreference = "Stop"
$BaseUrl = "http://localhost:3000/api"

function Write-Step($title) {
    Write-Host ""
    Write-Host "==================================================" -ForegroundColor DarkGray
    Write-Host $title -ForegroundColor Cyan
    Write-Host "==================================================" -ForegroundColor DarkGray
}

function Show-Json($obj) {
    $obj | ConvertTo-Json -Depth 10
}

$timestamp = Get-Date -Format "yyyyMMddHHmmss"
$email = "alireza+$timestamp@example.com"
$password = "StrongPass123"
$name = "Alireza Test"

Write-Step "1) Health"
$health = Invoke-RestMethod -Method GET -Uri "$BaseUrl/health"
Show-Json $health

Write-Step "2) Register"
$registerBody = @{
    email = $email
    password = $password
    name = $name
} | ConvertTo-Json

$registerResponse = Invoke-RestMethod `
    -Method POST `
    -Uri "$BaseUrl/auth/register" `
    -ContentType "application/json" `
    -Body $registerBody

Show-Json $registerResponse
$token = $registerResponse.accessToken
if (-not $token) { throw "No accessToken returned from register." }

Write-Step "3) Create dummy mp4"
$videoPath = Join-Path $PWD "sample-video.mp4"
[System.IO.File]::WriteAllBytes($videoPath, [byte[]](0..255))
Write-Host "Created: $videoPath" -ForegroundColor Green

Write-Step "4) Upload video"
$uploadResponse = Invoke-RestMethod `
    -Method POST `
    -Uri "$BaseUrl/uploads/video" `
    -Headers @{ Authorization = "Bearer $token" } `
    -Form @{ file = Get-Item $videoPath }

Show-Json $uploadResponse

Write-Step "5) Create analysis"
$analysisBody = @{
    fileKey = $uploadResponse.fileKey
    fileUrl = $uploadResponse.fileUrl
    fileName = $uploadResponse.fileName
    mimeType = $uploadResponse.mimeType
    fileSize = [int]$uploadResponse.fileSize
    title = "Test squat video"
    exerciseType = "squat"
    notes = "Uploaded from PowerShell integration test"
} | ConvertTo-Json

$analysisResponse = Invoke-RestMethod `
    -Method POST `
    -Uri "$BaseUrl/analyses" `
    -Headers @{ Authorization = "Bearer $token" } `
    -ContentType "application/json" `
    -Body $analysisBody

Show-Json $analysisResponse
$analysisId = $analysisResponse.id
if (-not $analysisId) { throw "No analysis id returned." }

Write-Step "6) List analyses"
$listResponse = Invoke-RestMethod `
    -Method GET `
    -Uri "$BaseUrl/analyses" `
    -Headers @{ Authorization = "Bearer $token" }

Show-Json $listResponse

Write-Step "7) Get one analysis"
$oneResponse = Invoke-RestMethod `
    -Method GET `
    -Uri "$BaseUrl/analyses/$analysisId" `
    -Headers @{ Authorization = "Bearer $token" }

Show-Json $oneResponse

Write-Step "DONE"
Write-Host "Phase 4 + 5 test completed successfully." -ForegroundColor Green