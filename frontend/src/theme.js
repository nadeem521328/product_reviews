import { createTheme } from '@mui/material/styles';

const baseTheme = {
  shape: {
    borderRadius: 24,
  },
  typography: {
    fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
    h1: {
      fontWeight: 800,
      letterSpacing: '-0.04em',
    },
    h2: {
      fontWeight: 800,
      letterSpacing: '-0.035em',
    },
    h3: {
      fontWeight: 800,
      letterSpacing: '-0.03em',
    },
    h4: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h5: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 700,
    },
    button: {
      fontWeight: 700,
      textTransform: 'none',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundAttachment: 'fixed',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          position: 'relative',
          isolation: 'isolate',
          overflow: 'hidden',
          border: '1px solid rgba(15, 23, 42, 0.08)',
          boxShadow: '0 24px 60px rgba(15, 23, 42, 0.10)',
          transition: 'transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: '-18px',
            borderRadius: 'inherit',
            background: 'radial-gradient(circle at top, rgba(31, 78, 87, 0.14) 0%, rgba(184, 116, 68, 0.10) 38%, rgba(184, 116, 68, 0) 72%)',
            filter: 'blur(22px)',
            opacity: 0.9,
            zIndex: -1,
            pointerEvents: 'none',
          },
          '@media (hover: hover)': {
            '&:hover': {
              transform: 'translateY(-6px)',
              boxShadow: '0 30px 70px rgba(15, 23, 42, 0.16)',
              borderColor: 'rgba(31, 78, 87, 0.22)',
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingInline: 20,
          paddingBlock: 10,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 18,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: 'none',
          backdropFilter: 'blur(18px)',
        },
      },
    },
  },
};

const lightTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'light',
    primary: {
      main: '#12343B',
      dark: '#0B252A',
      light: '#1F4E57',
    },
    secondary: {
      main: '#B87444',
      dark: '#955B32',
      light: '#D09A72',
    },
    background: {
      default: '#F3EFEA',
      paper: '#FAF8F5',
    },
    text: {
      primary: '#172126',
      secondary: '#506169',
    },
    divider: 'rgba(23, 33, 38, 0.10)',
    sentiment: {
      positive: '#2F6A53',
      neutral: '#B87444',
      negative: '#A34747',
      mixed: '#1F4E57',
    },
    surface: {
      main: '#FAF8F5',
      muted: '#D9D4CD',
      strong: '#172126',
    },
  },
});

lightTheme.components.MuiCard.styleOverrides.root['&::before'] = {
  content: '""',
  position: 'absolute',
  inset: '-18px',
  borderRadius: 'inherit',
  background: 'radial-gradient(circle at top, rgba(31, 78, 87, 0.14) 0%, rgba(184, 116, 68, 0.10) 38%, rgba(184, 116, 68, 0) 72%)',
  filter: 'blur(22px)',
  opacity: 0.9,
  zIndex: -1,
  pointerEvents: 'none',
};

const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'dark',
    primary: {
      main: '#6FA0A6',
      dark: '#3D666E',
      light: '#A7C3C7',
    },
    secondary: {
      main: '#C89166',
      dark: '#A66F47',
      light: '#E0B692',
    },
    background: {
      default: '#0E1C21',
      paper: '#142B31',
    },
    text: {
      primary: '#FAF8F5',
      secondary: '#C7D2D6',
    },
    divider: 'rgba(250, 248, 245, 0.10)',
    sentiment: {
      positive: '#7FC2A1',
      neutral: '#C89166',
      negative: '#E18484',
      mixed: '#6FA0A6',
    },
    surface: {
      main: '#142B31',
      muted: '#1C3940',
      strong: '#FAF8F5',
    },
  },
});

darkTheme.components.MuiCard.styleOverrides.root['&::before'] = {
  content: '""',
  position: 'absolute',
  inset: '-22px',
  borderRadius: 'inherit',
  background: 'radial-gradient(circle at top, rgba(111, 160, 166, 0.24) 0%, rgba(200, 145, 102, 0.16) 40%, rgba(200, 145, 102, 0) 74%)',
  filter: 'blur(26px)',
  opacity: 1,
  zIndex: -1,
  pointerEvents: 'none',
};

export const getTheme = (mode) => (mode === 'dark' ? darkTheme : lightTheme);

export default lightTheme;
