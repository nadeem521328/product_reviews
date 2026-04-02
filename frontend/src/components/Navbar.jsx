import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Switch,
  Box,
  Container,
  Chip,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useThemeContext } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mode, toggleTheme } = useThemeContext();
  const { isAuthenticated, logout } = useAuth();

  const navItems = [
    { label: 'Home', path: '/home' },
    { label: 'Analyze', path: '/search' },
    { label: 'Dashboard', path: '/dashboard' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <AppBar position="sticky" color="transparent">
      <Container maxWidth="xl" sx={{ py: 2 }}>
        <Toolbar
          disableGutters
          sx={{
            px: { xs: 2, md: 3 },
            py: 1.25,
            borderRadius: 999,
            border: '1px solid',
            borderColor: 'divider',
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark' ? 'rgba(33,26,36,0.82)' : 'rgba(36,29,40,0.78)',
            color: 'text.primary',
            justifyContent: 'space-between',
            gap: 2,
            flexWrap: 'wrap',
            backdropFilter: 'blur(18px)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                color: 'common.white',
                background: 'linear-gradient(135deg, #45354B 0%, #B9985A 100%)',
                fontWeight: 900,
              }}
            >
              S
            </Box>
            <Box>
              <Typography variant="h6" sx={{ lineHeight: 1 }}>
                SentimentScope
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Review intelligence workspace
              </Typography>
            </Box>
          </Box>

          {isAuthenticated() && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  variant={isActive(item.path) ? 'contained' : 'text'}
                  color={isActive(item.path) ? 'secondary' : 'inherit'}
                  sx={{ minWidth: 96 }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
            <Chip
              label={mode === 'dark' ? 'Night Mode' : 'Day Mode'}
              color="primary"
              variant="outlined"
              sx={{ borderRadius: 999 }}
            />
            <Switch checked={mode === 'dark'} onChange={toggleTheme} color="secondary" />
            {isAuthenticated() ? (
              <Button color="inherit" variant="outlined" onClick={logout}>
                Logout
              </Button>
            ) : (
              <Button color="secondary" variant="contained" onClick={() => navigate('/login')}>
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
