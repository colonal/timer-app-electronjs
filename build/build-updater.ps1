# Check if NSIS is installed
$nsisPath = "${env:ProgramFiles(x86)}\NSIS\makensis.exe"

if (-not (Test-Path $nsisPath)) {
    Write-Host "NSIS is not installed. Please install NSIS from https://nsis.sourceforge.io/Download"
    exit 1
}

# Create build directory if it doesn't exist
$buildDir = "..\dist\updater"
if (-not (Test-Path $buildDir)) {
    New-Item -ItemType Directory -Path $buildDir | Out-Null
}

# Copy necessary files
Copy-Item "updater.nsi" -Destination $buildDir
Copy-Item "..\resources\icon.ico" -Destination "$buildDir\icon.ico"

# Compile the NSIS script
& $nsisPath "$buildDir\updater.nsi"

if ($LASTEXITCODE -eq 0) {
    Write-Host "Updater executable created successfully at $buildDir\updater.exe"
} else {
    Write-Host "Failed to create updater executable"
    exit 1
} 