import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Tabs,
  Tab,
  Button,
  Chip,
} from '@mui/material';
import { useState } from 'react';
import CallsTable from '../components/CallsTable';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`campaign-tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const CampaignDetails = () => {
  const { id } = useParams();
  const [tabValue, setTabValue] = useState(0);

  // Mock campaign data - this would come from your API
  const campaign = {
    id,
    name: 'Q1 Sales Campaign',
    status: 'active',
    startDate: '2024-01-01',
    endDate: '2024-03-31',
    budget: 5000,
    budgetSpent: 2345.67,
    targetAppointments: 100,
    appointmentsScheduled: 45,
    successRateTarget: 45,
    currentSuccessRate: 42.5,
    costPerMinute: 0.07,
    description: 'Q1 outbound sales campaign targeting small business owners',
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">{campaign.name}</Typography>
        <Box>
          <Chip 
            label={campaign.status.toUpperCase()} 
            color={campaign.status === 'active' ? 'success' : 'default'}
            sx={{ mr: 2 }}
          />
          <Button variant="contained" color="primary">
            Edit Campaign
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Budget Spent
              </Typography>
              <Typography variant="h4">
                ${campaign.budgetSpent.toFixed(2)}
              </Typography>
              <Typography color="textSecondary">
                of ${campaign.budget.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Appointments
              </Typography>
              <Typography variant="h4">
                {campaign.appointmentsScheduled}
              </Typography>
              <Typography color="textSecondary">
                Target: {campaign.targetAppointments}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Success Rate
              </Typography>
              <Typography variant="h4">
                {campaign.currentSuccessRate}%
              </Typography>
              <Typography color="textSecondary">
                Target: {campaign.successRateTarget}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Cost Per Minute
              </Typography>
              <Typography variant="h4">
                ${campaign.costPerMinute}
              </Typography>
              <Typography color="textSecondary">
                Current Rate
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Overview" />
          <Tab label="Calls" />
          <Tab label="Performance" />
          <Tab label="Settings" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Typography variant="h6" gutterBottom>Campaign Description</Typography>
        <Typography paragraph>{campaign.description}</Typography>
        
        <Typography variant="h6" gutterBottom>Campaign Details</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography><strong>Start Date:</strong> {campaign.startDate}</Typography>
            <Typography><strong>End Date:</strong> {campaign.endDate}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography><strong>Status:</strong> {campaign.status}</Typography>
            <Typography><strong>Campaign ID:</strong> {campaign.id}</Typography>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <CallsTable viewMode="total" />
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Typography>Performance metrics and charts will be displayed here</Typography>
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <Typography variant="h6" gutterBottom>Campaign Settings</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Button variant="outlined" color="primary" fullWidth sx={{ mb: 2 }}>
              Edit Campaign Details
            </Button>
            <Button variant="outlined" color="primary" fullWidth sx={{ mb: 2 }}>
              Manage Budget
            </Button>
            <Button variant="outlined" color="primary" fullWidth sx={{ mb: 2 }}>
              Update Targets
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Button variant="outlined" color="error" fullWidth sx={{ mb: 2 }}>
              Pause Campaign
            </Button>
            <Button variant="outlined" color="error" fullWidth>
              Archive Campaign
            </Button>
          </Grid>
        </Grid>
      </TabPanel>
    </Box>
  );
};

export default CampaignDetails; 