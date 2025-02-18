import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  useTheme,
} from '@mui/material';

const Dashboard = () => {
  const theme = useTheme();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              borderRadius: 2,
            }}
          >
            <Typography color="textSecondary" gutterBottom>
              Total Calls
            </Typography>
            <Typography variant="h3" component="div">
              1,234
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              borderRadius: 2,
            }}
          >
            <Typography color="textSecondary" gutterBottom>
              Answered Calls
            </Typography>
            <Typography variant="h3" component="div">
              856
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              borderRadius: 2,
            }}
          >
            <Typography color="textSecondary" gutterBottom>
              Appointments
            </Typography>
            <Typography variant="h3" component="div">
              142
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              borderRadius: 2,
            }}
          >
            <Typography color="textSecondary" gutterBottom>
              Cost
            </Typography>
            <Typography variant="h3" component="div">
              $2,845
            </Typography>
          </Paper>
        </Grid>

        {/* Charts Section */}
        <Grid item xs={12} md={8}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 400,
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Call Performance
            </Typography>
            {/* We'll add charts here in the next step */}
          </Paper>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 400,
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            {/* We'll add activity feed here */}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 