$body = @{
    call_id = 'call_a06a59af9e8364e12484f7cea85'
    contact_id = 'contact-123'
    campaign_id = 'campaign-789'
    recording_url = 'https://dxc03zgurdly9.cloudfront.net/call_a06a59af9e8364e12484f7cea85/recording.wav'
    status = 'completed'
    duration = 120
    user_sentiment = 'positive'
    call_summary = 'Voice AI platform test call'
    full_transcript = 'Test call transcript'
} | ConvertTo-Json

$headers = @{
    'Content-Type' = 'application/json'
    'Authorization' = 'Bearer your-webhook-secret-123'
}

Invoke-RestMethod -Uri 'http://localhost:3001/api/webhook/call' -Method Post -Headers $headers -Body $body 