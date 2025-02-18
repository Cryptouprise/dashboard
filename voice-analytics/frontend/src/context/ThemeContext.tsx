import React, { createContext, useContext, useState, useCallback } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

interface ThemeContextType {
  mode: 'light' | 'dark';
  primaryColor: string;
  toggleMode: () => void;
  setPrimaryColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: 'light',
  primaryColor: '#1976d2',
  toggleMode: () => {},
  setPrimaryColor: () => {},
});

export const useThemeContext = () => useContext(ThemeContext);

export const ThemeContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [primaryColor, setPrimaryColor] = useState('#1976d2');

  const toggleMode = useCallback(() => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  }, []);

  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: primaryColor,
      },
      background: {
        default: mode === 'light' ? '#f8f9fa' : '#121212',
        paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
      },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          },
        },
      },
      MuiToggleButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            '&.Mui-selected': {
              backgroundColor: primaryColor,
              color: '#ffffff',
              '&:hover': {
                backgroundColor: primaryColor,
              },
            },
          },
        },
      },
    },
  });

  return (
    <ThemeContext.Provider
      value={{
        mode,
        primaryColor,
        toggleMode,
        setPrimaryColor,
      }}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeContext; 