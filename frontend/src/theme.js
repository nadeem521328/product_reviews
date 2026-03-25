import { createTheme } from '@mui/material/styles';

const lightTheme = {
  palette: {
    mode: 'light',
    primary: {
      main: '#006400', // Dark Green
    },
    secondary: {
      main: '#DAA520', // Gold
    },
    background: {
      default: '#FDF6E3', // Light Beige
      paper: '#F5F5DC', // Beige
    },
    text: {
      primary: '#2F4F2F', // Dark green-gray
      secondary: '#8B4513',
    },
    sentiment: {
      positive: '#228B22', // Forest Green
      negative: '#8B0000', // Dark Red
      neutral: '#DAA520', // Gold
      mixed: '#CD853F', // Peru
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 8px 32px rgba(0,100,0,0.2)',
          borderRadius: '16px',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 40px rgba(0,100,0,0.3)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          textTransform: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #006400 0%, #228B22 100%)',
        },
      },
    },
  },
  typography: {
    h4: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 800,
    },
  },
  shape: {
    borderRadius: 16,
  },
};

const darkTheme = {
  palette: {
    mode: 'dark',
    primary: {
      main: '#228B22', // Lighter Green
    },
    secondary: {
      main: '#FFD700', // Bright Gold
    },
    background: {
      default: '#1a1a1a',
      paper: '#2d2d2d',
    },
    text: {
      primary: '#E5E5E5',
      secondary: '#DAA520', // Gold
    },
    sentiment: {
      positive: '#32CD32', // Lime Green
      negative: '#DC143C', // Crimson
      neutral: '#DAA520', // Gold
      mixed: '#B8860B', // Dark Goldenrod
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 8px 32px rgba(34,139,34,0.3)',
          borderRadius: '16px',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 40px rgba(34,139,34,0.4)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          textTransform: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #1a1a1a 0%, #228B22 100%)',
        },
      },
    },
  },
  typography: {
    h4: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 800,
    },
  },
  shape: {
    borderRadius: 16,
  },
};

export const getTheme = (mode) => createTheme(mode === 'dark' ? darkTheme : lightTheme);

export default getTheme('light');
