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
          backgroundColor: '#241D28',
          border: '1px solid rgba(185, 152, 90, 0.14)',
          boxShadow: '0 24px 60px rgba(12, 10, 16, 0.30)',
          transition: 'transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: '-18px',
            borderRadius: 'inherit',
            background: 'radial-gradient(circle at top, rgba(69, 53, 75, 0.24) 0%, rgba(185, 152, 90, 0.16) 40%, rgba(185, 152, 90, 0) 74%)',
            filter: 'blur(22px)',
            opacity: 0.9,
            zIndex: -1,
            pointerEvents: 'none',
          },
          '@media (hover: hover)': {
            '&:hover': {
              transform: 'translateY(-6px)',
              boxShadow: '0 30px 70px rgba(12, 10, 16, 0.42)',
              borderColor: 'rgba(185, 152, 90, 0.28)',
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
      main: '#2C2230',
      dark: '#1F1822',
      light: '#45354B',
    },
    secondary: {
      main: '#B9985A',
      dark: '#947746',
      light: '#D1B486',
    },
    background: {
      default: '#171319',
      paper: '#241D28',
    },
    text: {
      primary: '#FAF7F2',
      secondary: '#C9BEC8',
    },
    divider: 'rgba(250, 247, 242, 0.10)',
    sentiment: {
      positive: '#7AA787',
      neutral: '#B9985A',
      negative: '#D07A86',
      mixed: '#8E7696',
    },
    surface: {
      main: '#241D28',
      muted: '#312736',
      strong: '#FAF7F2',
    },
  },
});

lightTheme.components.MuiCard.styleOverrides.root['&::before'] = {
  content: '""',
  position: 'absolute',
  inset: '-18px',
  borderRadius: 'inherit',
  background: 'radial-gradient(circle at top, rgba(69, 53, 75, 0.24) 0%, rgba(185, 152, 90, 0.16) 40%, rgba(185, 152, 90, 0) 74%)',
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
      main: '#A28AA8',
      dark: '#7D6782',
      light: '#C1A7C6',
    },
    secondary: {
      main: '#C6A46A',
      dark: '#A18048',
      light: '#DEC18F',
    },
    background: {
      default: '#141016',
      paper: '#211A24',
    },
    text: {
      primary: '#FAF7F2',
      secondary: '#D4C8D2',
    },
    divider: 'rgba(250, 247, 242, 0.10)',
    sentiment: {
      positive: '#8FBA97',
      neutral: '#C6A46A',
      negative: '#E18C98',
      mixed: '#B191B8',
    },
    surface: {
      main: '#211A24',
      muted: '#2F2534',
      strong: '#FAF7F2',
    },
  },
});

darkTheme.components.MuiCard.styleOverrides.root['&::before'] = {
  content: '""',
  position: 'absolute',
  inset: '-22px',
  borderRadius: 'inherit',
  background: 'radial-gradient(circle at top, rgba(162, 138, 168, 0.26) 0%, rgba(198, 164, 106, 0.18) 40%, rgba(198, 164, 106, 0) 74%)',
  filter: 'blur(26px)',
  opacity: 1,
  zIndex: -1,
  pointerEvents: 'none',
};

export const getTheme = (mode) => (mode === 'dark' ? darkTheme : lightTheme);

export default lightTheme;
