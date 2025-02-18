import {
  Box,
  Typography,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Grid,
  Alert,
  Divider,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import { useState } from 'react';
import { useThemeContext } from '../context/ThemeContext';

const Settings = () => {
  const { mode, primaryColor, toggleMode, setPrimaryColor } = useThemeContext();
  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhookSecret, setWebhookSecret] = useState('');
  const [testWebhookStatus, setTestWebhookStatus] = useState<'success' | 'error' | null>(null);

  const handleTestWebhook = () => {
    // This would make an actual API call to test the webhook
    setTestWebhookStatus('success');
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Settings</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Theme Settings</Typography>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={mode === 'dark'}
                    onChange={toggleMode}
                  />
                }
                label="Dark Mode"
              />

              <Box sx={{ mt: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>Theme Color</InputLabel>
                  <Select
                    value={primaryColor}
                    label="Theme Color"
                    onChange={(e) => setPrimaryColor(e.target.value)}
                  >
                    <MenuItem value="#1976d2">Blue (Default)</MenuItem>
                    <MenuItem value="#2e7d32">Green</MenuItem>
                    <MenuItem value="#d32f2f">Red</MenuItem>
                    <MenuItem value="#ed6c02">Orange</MenuItem>
                    <MenuItem value="#9c27b0">Purple</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Webhook Configuration</Typography>
              
              <TextField
                label="Webhook URL"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                fullWidth
                margin="normal"
                helperText="The URL where your voice provider will send call data"
              />

              <TextField
                label="Webhook Secret"
                value={webhookSecret}
                onChange={(e) => setWebhookSecret(e.target.value)}
                fullWidth
                margin="normal"
                type="password"
                helperText="Secret key for webhook authentication"
              />

              <Box sx={{ mt: 2, mb: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleTestWebhook}
                  sx={{ mr: 2 }}
                >
                  Test Webhook
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                >
                  Save Configuration
                </Button>
              </Box>

              {testWebhookStatus === 'success' && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  Webhook test successful! The endpoint is properly configured.
                </Alert>
              )}
              {testWebhookStatus === 'error' && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  Webhook test failed. Please check your configuration.
                </Alert>
              )}

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" gutterBottom>
                Webhook Information
              </Typography>
              <Typography variant="body2" paragraph>
                Configure your voice provider to send call data to the webhook URL above. The webhook expects POST requests with JSON data containing call details.
              </Typography>
              <Typography variant="body2">
                Make sure to include the webhook secret in the Authorization header:
                <br />
                <code>Authorization: Bearer your-webhook-secret</code>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Settings; 