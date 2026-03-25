import React from 'react';
import { AppBar, Toolbar, Typography, Button, Switch, FormControlLabel, useTheme, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useThemeContext } from '../contexts/ThemeContext';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const Navbar = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { mode, toggleTheme } = useThemeContext();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
          Sentiment Analyzer
        </Typography>
        <Button color="inherit" onClick={() => navigate('/')}>
          Home
        </Button>
        <Button color="inherit" onClick={() => navigate('/search')}>
          Analyze
        </Button>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FormControlLabel
            control={
              <Switch 
                checked={mode === 'dark'}
                onChange={toggleTheme}
                color="secondary"
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.875rem' }}>
                {mode === 'dark' ? <Brightness7Icon fontSize="small" /> : <Brightness4Icon fontSize="small" />}
                {mode === 'dark' ? 'Light' : 'Dark'}
              </Box>
            }
            sx={{ color: 'inherit' }}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
