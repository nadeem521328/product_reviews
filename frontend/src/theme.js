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
        root: ({ theme }) => ({
          position: 'relative',
          isolation: 'isolate',
          overflow: 'hidden',
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${
            theme.palette.mode === 'dark' ? 'rgba(185, 152, 90, 0.14)' : 'rgba(69, 53, 75, 0.14)'
          }`,
          boxShadow:
            theme.palette.mode === 'dark'
              ? '0 24px 60px rgba(12, 10, 16, 0.30)'
              : '0 20px 48px rgba(68, 49, 74, 0.12)',
          transition: 'transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: '-18px',
            borderRadius: 'inherit',
            background:
              theme.palette.mode === 'dark'
                ? 'radial-gradient(circle at top, rgba(162, 138, 168, 0.26) 0%, rgba(198, 164, 106, 0.18) 40%, rgba(198, 164, 106, 0) 74%)'
                : 'radial-gradient(circle at top, rgba(69, 53, 75, 0.14) 0%, rgba(185, 152, 90, 0.12) 40%, rgba(185, 152, 90, 0) 74%)',
            filter: 'blur(22px)',
            opacity: theme.palette.mode === 'dark' ? 0.95 : 0.8,
            zIndex: -1,
            pointerEvents: 'none',
          },
          '@media (hover: hover)': {
            '&:hover': {
              transform: 'translateY(-6px)',
              boxShadow:
                theme.palette.mode === 'dark'
                  ? '0 30px 70px rgba(12, 10, 16, 0.42)'
                  : '0 24px 56px rgba(68, 49, 74, 0.16)',
              borderColor:
                theme.palette.mode === 'dark'
                  ? 'rgba(185, 152, 90, 0.28)'
                  : 'rgba(69, 53, 75, 0.24)',
            },
          },
        }),
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
      main: '#45354B',
      dark: '#2C2230',
      light: '#6B5872',
    },
    secondary: {
      main: '#B9985A',
      dark: '#947746',
      light: '#D1B486',
    },
    background: {
      default: '#F8F3EC',
      paper: '#FFFDF9',
    },
    text: {
      primary: '#2F2734',
      secondary: '#6F6474',
    },
    divider: 'rgba(69, 53, 75, 0.12)',
    sentiment: {
      positive: '#7AA787',
      neutral: '#B9985A',
      negative: '#D07A86',
      mixed: '#8E7696',
    },
    surface: {
      main: '#FFFDF9',
      muted: '#F2E9DE',
      strong: '#2F2734',
    },
  },
});

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

export const getTheme = (mode) => (mode === 'dark' ? darkTheme : lightTheme);

export default lightTheme;
