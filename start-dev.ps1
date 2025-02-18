# Check MongoDB
$mongoRunning = $false
try {
    $mongoStatus = Get-Process mongod -ErrorAction SilentlyContinue
    if ($mongoStatus) {
        $mongoRunning = $true
        Write-Host "MongoDB is running" -ForegroundColor Green
    } else {
        Write-Host "MongoDB is not running. Starting MongoDB..." -ForegroundColor Yellow
        Start-Process "C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe" -ArgumentList "--dbpath", "C:\data\db"
        Start-Sleep -Seconds 5
        $mongoRunning = $true
    }
} catch {
    Write-Host "Error checking MongoDB status. Please make sure MongoDB is installed." -ForegroundColor Red
    Write-Host "Download from: https://www.mongodb.com/try/download/community"
    exit 1
}

# Set working directory
$projectRoot = $PSScriptRoot
Set-Location $projectRoot

# Check and install backend dependencies
Write-Host "Checking backend dependencies..." -ForegroundColor Yellow
Set-Location "backend"
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
    npm install
}

# Check and install frontend dependencies
Write-Host "Checking frontend dependencies..." -ForegroundColor Yellow
Set-Location "..\frontend"
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
    npm install
}

# Start servers
Write-Host "Starting servers..." -ForegroundColor Green

# Start backend server in new window
$backendWindow = Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$projectRoot\backend'; npm run dev" -PassThru

# Start frontend server in new window
$frontendWindow = Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$projectRoot\frontend'; npm run dev" -PassThru

Write-Host "`nServers are starting...`n" -ForegroundColor Green
Write-Host "Frontend will be available at: http://localhost:5173" -ForegroundColor Cyan
Write-Host "Backend will be available at: http://localhost:3000" -ForegroundColor Cyan
Write-Host "`nTo test the webhook, use the test-webhook.ps1 script or send a POST request to:" -ForegroundColor Yellow
Write-Host "http://localhost:3000/api/webhook/call" -ForegroundColor Cyan

# Wait for user input
Write-Host "`nPress any key to stop the servers..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Cleanup
Stop-Process -Id $backendWindow.Id -Force
Stop-Process -Id $frontendWindow.Id -Force
Write-Host "Servers stopped." -ForegroundColor Green 