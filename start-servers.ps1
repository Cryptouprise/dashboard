Write-Host "Starting Voice AI Analytics servers..."

# Start backend server
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev"

# Start frontend server
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host "Servers are starting..."
Write-Host "Frontend will be available at: http://localhost:5173"
Write-Host "Backend will be available at: http://localhost:3000"
Write-Host ""
Write-Host "To test the webhook, send a POST request to: http://localhost:3000/api/webhook/call"
Write-Host "You can use tools like Postman or curl to test the webhook." 