import React from 'react';
import { AppBar, Toolbar, Typography, Button, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <AppBar position="static" sx={{ boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
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
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
