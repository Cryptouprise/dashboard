import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  ToggleButtonGroup,
  ToggleButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import { FilterList as FilterIcon, Settings as SettingsIcon } from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import FilterPanel from '../components/FilterPanel';
import CallsTable from '../components/CallsTable';
import { api } from '../api/client';

type ViewMode = 'total' | 'percentage' | 'cost';

interface DashboardMetrics {
  totalCalls: number;
  totalMinutes: number;
  answeredCalls: number;
  noAnswers: number;
  didNotConnect: number;
  transfers: number;
  appointments: number;
  totalSpent: number;
}

const DEFAULT_PRICE_PER_MINUTE = 0.07;

const MetricCard = ({ title, value, subtitle }: { title: string; value: string | number; subtitle: string }) => (
  <Card>
    <CardContent>
      <Typography color="textSecondary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h4">{value}</Typography>
      <Typography color="textSecondary">{subtitle}</Typography>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('total');
  const [showFilters, setShowFilters] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [pricePerMinute, setPricePerMinute] = useState(() => {
    const saved = localStorage.getItem('pricePerMinute');
    return saved ? parseFloat(saved) : DEFAULT_PRICE_PER_MINUTE;
  });
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalCalls: 0,
    totalMinutes: 0,
    answeredCalls: 0,
    noAnswers: 0,
    didNotConnect: 0,
    transfers: 0,
    appointments: 0,
    totalSpent: 0
  });
  const [performanceData, setPerformanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    const fetchData = async () => {
      try {
        const [metricsResponse, performanceResponse] = await Promise.all([
          api.getMetrics(pricePerMinute),
          api.getPerformanceData(pricePerMinute)
        ]);

        if (!metricsResponse || !performanceResponse) {
          throw new Error('Failed to fetch dashboard data');
        }

        setMetrics(metricsResponse.data || {
          totalCalls: 0,
          totalMinutes: 0,
          answeredCalls: 0,
          noAnswers: 0,
          didNotConnect: 0,
          transfers: 0,
          appointments: 0,
          totalSpent: 0
        });
        setPerformanceData(performanceResponse.data || []);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pricePerMinute]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  const handleSaveSettings = (newPrice: number) => {
    if (newPrice >= 0) {
      setPricePerMinute(newPrice);
      localStorage.setItem('pricePerMinute', newPrice.toString());
    }
  };

  const getMetricValue = (metric: number, percentage: number, cost: number) => {
    switch (viewMode) {
      case 'percentage':
        return `${percentage?.toFixed(1) || '0.0'}%`;
      case 'cost':
        return `$${(cost || 0).toFixed(2)}`;
      default:
        return metric || 0;
    }
  };

  const handleApplyFilters = async (filters: any) => {
    setLoading(true);
    setError(null);
    try {
      const [metricsResponse, performanceResponse] = await Promise.all([
        api.getMetrics(pricePerMinute),
        api.getPerformanceData(pricePerMinute)
      ]);

      if (!metricsResponse.data || !performanceResponse.data) {
        throw new Error('Invalid response format from server');
      }

      setMetrics(metricsResponse.data);
      setPerformanceData(performanceResponse.data);
    } catch (err) {
      console.error('Error applying filters:', err);
      setError(err instanceof Error ? err.message : 'Failed to apply filters');
    } finally {
      setLoading(false);
      setShowFilters(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Dashboard</Typography>
        <Box sx={{ display: 'flex', gap: 2, position: 'relative' }}>
          <Button
            variant="outlined"
            startIcon={<SettingsIcon />}
            onClick={() => setShowSettings(true)}
          >
            Settings
          </Button>
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            onClick={() => setShowFilters(!showFilters)}
          >
            Filter
          </Button>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(e, value) => value && setViewMode(value)}
            size="small"
          >
            <ToggleButton value="total">Total</ToggleButton>
            <ToggleButton value="percentage">Percentage</ToggleButton>
            <ToggleButton value="cost">Cost</ToggleButton>
          </ToggleButtonGroup>
          {showFilters && (
            <FilterPanel
              onClose={() => setShowFilters(false)}
              onReset={() => handleApplyFilters({})}
              onApply={handleApplyFilters}
            />
          )}
        </Box>
      </Box>
      
      {/* Settings Dialog */}
      <Dialog 
        open={showSettings} 
        onClose={() => setShowSettings(false)}
        PaperProps={{
          sx: { minWidth: '300px' }
        }}
      >
        <DialogTitle>Settings</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              label="Price Per Minute ($)"
              type="number"
              value={pricePerMinute}
              inputProps={{ 
                step: "0.01",
                min: "0",
                style: { fontSize: '1.1rem' }
              }}
              fullWidth
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                if (!isNaN(value)) {
                  handleSaveSettings(value);
                }
              }}
              helperText="Set the cost per minute for call calculations"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSettings(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Minutes Used"
            value={getMetricValue(metrics?.totalMinutes || 0, 0, metrics?.totalSpent || 0)}
            subtitle={`$${(pricePerMinute || 0).toFixed(2)}/min`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Calls"
            value={getMetricValue(metrics?.totalCalls || 0, 100, metrics?.totalSpent || 0)}
            subtitle="Today"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Answers"
            value={getMetricValue(
              metrics?.answeredCalls || 0, 
              metrics?.totalCalls ? ((metrics?.answeredCalls || 0) / metrics.totalCalls) * 100 : 0,
              metrics?.totalSpent || 0
            )}
            subtitle="Today"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="No Answers"
            value={getMetricValue(
              metrics?.noAnswers || 0,
              metrics?.totalCalls ? ((metrics?.noAnswers || 0) / metrics.totalCalls) * 100 : 0,
              0
            )}
            subtitle="Today"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Did Not Connect"
            value={getMetricValue(
              metrics?.didNotConnect || 0,
              metrics?.totalCalls ? ((metrics?.didNotConnect || 0) / metrics.totalCalls) * 100 : 0,
              0
            )}
            subtitle="Today"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Transfers"
            value={getMetricValue(
              metrics?.transfers || 0,
              metrics?.totalCalls ? ((metrics?.transfers || 0) / metrics.totalCalls) * 100 : 0,
              0
            )}
            subtitle="Today"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Appointments"
            value={getMetricValue(
              metrics?.appointments || 0,
              metrics?.totalCalls ? ((metrics?.appointments || 0) / metrics.totalCalls) * 100 : 0,
              0
            )}
            subtitle="Today"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Spent"
            value={`$${(metrics?.totalSpent || 0).toFixed(2)}`}
            subtitle={`at $${(pricePerMinute || 0).toFixed(2)}/min`}
          />
        </Grid>
        
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Performance Trends
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="calls" stroke="#2196f3" name="Calls" />
                    <Line type="monotone" dataKey="answers" stroke="#4caf50" name="Answers" />
                    <Line type="monotone" dataKey="appointments" stroke="#f50057" name="Appointments" />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <CallsTable viewMode={viewMode} pricePerMinute={pricePerMinute} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 