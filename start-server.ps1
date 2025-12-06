# PowerShell Script to Start Local Web Server
# Run this script to start the local server

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Epsilon Systems - Local Server" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Python is available
$python = Get-Command python -ErrorAction SilentlyContinue
$python3 = Get-Command python3 -ErrorAction SilentlyContinue

if ($python) {
    Write-Host "Starting server with Python..." -ForegroundColor Green
    Write-Host "Server will be available at: http://localhost:8000" -ForegroundColor Yellow
    Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
    Write-Host ""
    python -m http.server 8000
}
elseif ($python3) {
    Write-Host "Starting server with Python 3..." -ForegroundColor Green
    Write-Host "Server will be available at: http://localhost:8000" -ForegroundColor Yellow
    Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
    Write-Host ""
    python3 -m http.server 8000
}
else {
    Write-Host "Python not found. Trying alternative method..." -ForegroundColor Yellow
    Write-Host ""
    
    # Try using PowerShell's built-in web server
    $port = 8000
    $url = "http://localhost:$port/"
    
    Write-Host "Starting PowerShell HTTP Server..." -ForegroundColor Green
    Write-Host "Server will be available at: $url" -ForegroundColor Yellow
    Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
    Write-Host ""
    
    # Create a simple HTTP listener
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add($url)
    $listener.Start()
    
    Write-Host "Server started successfully!" -ForegroundColor Green
    Write-Host "Open your browser and navigate to: $url" -ForegroundColor Cyan
    Write-Host ""
    
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $localPath = $request.Url.LocalPath
        if ($localPath -eq "/") {
            $localPath = "/index.html"
        }
        
        $filePath = Join-Path $PSScriptRoot $localPath.TrimStart('/')
        
        if (Test-Path $filePath) {
            $content = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentLength64 = $content.Length
            $response.OutputStream.Write($content, 0, $content.Length)
        }
        else {
            $response.StatusCode = 404
            $response.Close()
        }
        
        $response.Close()
    }
}

