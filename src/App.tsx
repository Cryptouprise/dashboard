import { BrowserRouter as Router } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from './context/ThemeContext';
import MainLayout from './components/Layout/MainLayout';
import AppRoutes from './routes';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <CssBaseline />
        <MainLayout>
          <AppRoutes />
        </MainLayout>
      </ThemeProvider>
    </Router>
  );
}

export default App; 