import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  LinearProgress,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

interface Campaign {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'completed';
  progress: number;
  budget: number;
  budgetSpent: number;
  appointments: number;
  targetAppointments: number;
}

const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Q1 Sales Campaign',
    status: 'active',
    progress: 65,
    budget: 5000,
    budgetSpent: 2345.67,
    appointments: 45,
    targetAppointments: 100,
  },
  {
    id: '2',
    name: 'Customer Feedback',
    status: 'paused',
    progress: 30,
    budget: 3000,
    budgetSpent: 876.54,
    appointments: 15,
    targetAppointments: 50,
  },
  {
    id: '3',
    name: 'Product Launch',
    status: 'completed',
    progress: 100,
    budget: 10000,
    budgetSpent: 9876.54,
    appointments: 95,
    targetAppointments: 90,
  },
];

const Campaigns = () => {
  const navigate = useNavigate();
  const [campaigns] = useState<Campaign[]>(mockCampaigns);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'paused':
        return 'warning';
      case 'completed':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Campaigns</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/campaigns/new')}
        >
          New Campaign
        </Button>
      </Box>

      <Grid container spacing={3}>
        {campaigns.map((campaign) => (
          <Grid item xs={12} md={6} lg={4} key={campaign.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    {campaign.name}
                  </Typography>
                  <Chip
                    label={campaign.status.toUpperCase()}
                    color={getStatusColor(campaign.status) as any}
                    size="small"
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Progress
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={campaign.progress}
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {campaign.progress}% Complete
                  </Typography>
                </Box>

                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Budget Spent
                    </Typography>
                    <Typography variant="body1">
                      ${campaign.budgetSpent.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      of ${campaign.budget.toFixed(2)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Appointments
                    </Typography>
                    <Typography variant="body1">
                      {campaign.appointments}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Target: {campaign.targetAppointments}
                    </Typography>
                  </Grid>
                </Grid>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => navigate(`/campaigns/${campaign.id}`)}
                  >
                    View Details
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => {
                      // Handle edit action
                    }}
                  >
                    Edit
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Campaigns; 