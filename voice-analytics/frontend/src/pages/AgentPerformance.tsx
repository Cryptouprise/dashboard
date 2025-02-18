import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Rating,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const mockAgents = [
  {
    id: 1,
    name: 'John Smith',
    calls: 245,
    appointments: 32,
    successRate: 13.1,
    avgDuration: '5:12',
    rating: 4.5,
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    calls: 198,
    appointments: 28,
    successRate: 14.1,
    avgDuration: '4:45',
    rating: 4.8,
  },
];

const performanceData = [
  { name: 'John Smith', calls: 245, appointments: 32 },
  { name: 'Sarah Johnson', calls: 198, appointments: 28 },
];

const AgentPerformance = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Agent Performance
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Performance Overview
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="calls" fill="#2196f3" name="Total Calls" />
                    <Bar dataKey="appointments" fill="#f50057" name="Appointments" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Agent Name</TableCell>
                  <TableCell align="right">Total Calls</TableCell>
                  <TableCell align="right">Appointments</TableCell>
                  <TableCell align="right">Success Rate</TableCell>
                  <TableCell align="right">Avg Duration</TableCell>
                  <TableCell>Rating</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockAgents.map((agent) => (
                  <TableRow key={agent.id}>
                    <TableCell>{agent.name}</TableCell>
                    <TableCell align="right">{agent.calls}</TableCell>
                    <TableCell align="right">{agent.appointments}</TableCell>
                    <TableCell align="right">{agent.successRate}%</TableCell>
                    <TableCell align="right">{agent.avgDuration}</TableCell>
                    <TableCell>
                      <Rating value={agent.rating} precision={0.1} readOnly />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AgentPerformance; 