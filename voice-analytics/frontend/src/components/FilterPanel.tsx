import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  IconButton,
  Paper,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Close as CloseIcon } from '@mui/icons-material';
import { useState } from 'react';

interface FilterPanelProps {
  onClose: () => void;
  onReset: () => void;
  onApply: (filters: any) => void;
}

const FilterPanel = ({ onClose, onReset, onApply }: FilterPanelProps) => {
  const today = new Date();
  const [fromDate, setFromDate] = useState<Date | null>(today);
  const [toDate, setToDate] = useState<Date | null>(today);
  const [selectedAgent, setSelectedAgent] = useState<string>('');

  const handleApply = () => {
    onApply({
      fromDate,
      toDate,
      agent: selectedAgent
    });
  };

  const handleReset = () => {
    setFromDate(today);
    setToDate(today);
    setSelectedAgent('');
    onReset();
  };

  return (
    <Paper
      sx={{
        position: 'absolute',
        top: '60px',
        right: '20px',
        width: '300px',
        p: 2,
        zIndex: 1000,
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Button size="small" onClick={handleReset} color="primary">
          Reset
        </Button>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <DatePicker
            label="From"
            value={fromDate}
            onChange={(newValue) => setFromDate(newValue)}
            maxDate={toDate || undefined}
            slotProps={{ textField: { size: 'small', fullWidth: true } }}
          />
          <DatePicker
            label="To"
            value={toDate}
            onChange={(newValue) => setToDate(newValue)}
            minDate={fromDate || undefined}
            maxDate={today}
            slotProps={{ textField: { size: 'small', fullWidth: true } }}
          />
        </Box>
      </LocalizationProvider>

      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
        <InputLabel>Agent</InputLabel>
        <Select
          label="Agent"
          value={selectedAgent}
          onChange={(e) => setSelectedAgent(e.target.value)}
        >
          <MenuItem value="">All Agents</MenuItem>
          <MenuItem value="agent-001">John Smith</MenuItem>
          <MenuItem value="agent-002">Sarah Johnson</MenuItem>
        </Select>
      </FormControl>

      <Button
        variant="contained"
        fullWidth
        onClick={handleApply}
        sx={{ mt: 1 }}
      >
        Apply Filters
      </Button>
    </Paper>
  );
};

export default FilterPanel; 