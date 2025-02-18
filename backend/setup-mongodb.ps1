# Create MongoDB data directory if it doesn't exist
$dataPath = "C:\data\db"
if (-not (Test-Path $dataPath)) {
    Write-Host "Creating MongoDB data directory at $dataPath" -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $dataPath -Force
    Write-Host "MongoDB data directory created successfully" -ForegroundColor Green
} else {
    Write-Host "MongoDB data directory already exists at $dataPath" -ForegroundColor Green
}

# Check if MongoDB is installed
$mongoInstalled = $false
try {
    $mongoPath = "C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe"
    if (Test-Path $mongoPath) {
        $mongoInstalled = $true
        Write-Host "MongoDB is installed" -ForegroundColor Green
    } else {
        Write-Host "MongoDB is not installed" -ForegroundColor Red
        Write-Host "Please download and install MongoDB Community Server from:" -ForegroundColor Yellow
        Write-Host "https://www.mongodb.com/try/download/community" -ForegroundColor Cyan
        Write-Host "Make sure to:"
        Write-Host "1. Choose 'Complete' installation"
        Write-Host "2. Install MongoDB Compass when prompted"
        Write-Host "3. Run this script again after installation"
    }
} catch {
    Write-Host "Error checking MongoDB installation" -ForegroundColor Red
    exit 1
}

if ($mongoInstalled) {
    # Try to start MongoDB
    try {
        $mongoRunning = Get-Process mongod -ErrorAction SilentlyContinue
        if (-not $mongoRunning) {
            Write-Host "Starting MongoDB..." -ForegroundColor Yellow
            Start-Process $mongoPath -ArgumentList "--dbpath", $dataPath
            Start-Sleep -Seconds 5
            Write-Host "MongoDB started successfully" -ForegroundColor Green
        } else {
            Write-Host "MongoDB is already running" -ForegroundColor Green
        }
    } catch {
        Write-Host "Error starting MongoDB" -ForegroundColor Red
        Write-Host $_.Exception.Message
        exit 1
    }
}

Write-Host "`nMongoDB Setup Complete" -ForegroundColor Green
Write-Host "You can now run start-dev.ps1 to start the application" -ForegroundColor Cyan 