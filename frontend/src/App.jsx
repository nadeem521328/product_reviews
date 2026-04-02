import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box, Container, Typography } from '@mui/material';
import { ThemeProviderWrapper, useThemeContext } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { getTheme } from './theme';
import Home from './pages/Home';
import Search from './pages/Search';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import IndividualSentimentsPage from './pages/IndividualSentimentsPage';
import Navbar from './components/Navbar';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

function AppShell({ children }) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? 'radial-gradient(circle at top, rgba(111,160,166,0.16), transparent 28%), linear-gradient(180deg, #0E1C21 0%, #11262C 52%, #0A1418 100%)'
            : 'radial-gradient(circle at top, rgba(18,52,59,0.12), transparent 24%), linear-gradient(180deg, #F3EFEA 0%, #ECE4DB 48%, #D9D4CD 100%)',
      }}
    >
      <Navbar />
      <Box component="main">{children}</Box>
      <Container maxWidth="xl" sx={{ pb: 4, pt: 2 }}>
        <Box
          sx={{
            px: { xs: 2.5, md: 4 },
            py: 3,
            borderRadius: 6,
            border: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'background.paper',
            display: 'flex',
            justifyContent: 'space-between',
            gap: 2,
            flexWrap: 'wrap',
            transition: 'transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease',
            boxShadow: '0 18px 42px rgba(15, 23, 42, 0.08)',
            '@media (hover: hover)': {
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 24px 54px rgba(15, 23, 42, 0.12)',
                borderColor: 'rgba(31, 78, 87, 0.22)',
              },
            },
          }}
        >
          <Typography variant="body2" color="text.secondary">
            SentimentScope helps teams turn raw customer reviews into clear product signals.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Frontend experience updated without changing your backend workflow.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

function InnerApp() {
  const { mode } = useThemeContext();
  const theme = getTheme(mode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <AppShell>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
              <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/individual-sentiments" element={<ProtectedRoute><IndividualSentimentsPage /></ProtectedRoute>} />
            </Routes>
          </AppShell>
        </div>
      </Router>
    </ThemeProvider>
  );
}

function App() {
  return (
    <ThemeProviderWrapper>
      <AuthProvider>
        <InnerApp />
      </AuthProvider>
    </ThemeProviderWrapper>
  );
}

export default App;
