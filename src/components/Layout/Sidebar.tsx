import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
} from '@mui/material';
import {
  Dashboard,
  Campaign,
  People,
  Assessment,
  Settings,
  Notifications,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/' },
  { text: 'Campaigns', icon: <Campaign />, path: '/campaigns' },
  { text: 'Agents', icon: <People />, path: '/agents' },
  { text: 'Analytics', icon: <Assessment />, path: '/analytics' },
  { text: 'Notifications', icon: <Notifications />, path: '/notifications' },
  { text: 'Settings', icon: <Settings />, path: '/settings' },
];

const Sidebar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box>
      <Box
        sx={{
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
        }}
      >
        <img
          src="/logo.png"
          alt="Logo"
          style={{ height: '40px' }}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => navigate(item.path)}
            sx={{
              backgroundColor:
                location.pathname === item.path
                  ? theme.palette.action.selected
                  : 'transparent',
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
              borderRadius: '8px',
              margin: '4px 8px',
            }}
          >
            <ListItemIcon
              sx={{
                color:
                  location.pathname === item.path
                    ? theme.palette.primary.main
                    : theme.palette.text.secondary,
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              sx={{
                color:
                  location.pathname === item.path
                    ? theme.palette.primary.main
                    : theme.palette.text.primary,
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar; 