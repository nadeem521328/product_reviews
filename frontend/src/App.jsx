import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box, Container, Typography, CircularProgress } from '@mui/material';
import { ThemeProviderWrapper, useThemeContext } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { getTheme } from './theme';
import Navbar from './components/Navbar';
import './App.css';

const Home = lazy(() => import('./pages/Home'));
const Search = lazy(() => import('./pages/Search'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Login = lazy(() => import('./pages/Login'));
const IndividualSentimentsPage = lazy(() => import('./pages/IndividualSentimentsPage'));
const History = lazy(() => import('./pages/History'));

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
            ? 'radial-gradient(circle at top, rgba(162,138,168,0.18), transparent 28%), linear-gradient(180deg, #141016 0%, #19131C 52%, #110D12 100%)'
            : 'radial-gradient(circle at top, rgba(185,152,90,0.18), transparent 24%), linear-gradient(180deg, #FCF8F2 0%, #F5EDE4 48%, #EFE3D6 100%)',
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
            color: 'text.primary',
            display: 'flex',
            justifyContent: 'space-between',
            gap: 2,
            flexWrap: 'wrap',
            transition: 'transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease',
            boxShadow: '0 18px 42px rgba(12, 10, 16, 0.28)',
            '@media (hover: hover)': {
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: (theme) =>
                  theme.palette.mode === 'dark'
                    ? '0 24px 54px rgba(12, 10, 16, 0.36)'
                    : '0 18px 40px rgba(68, 49, 74, 0.14)',
                borderColor: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(185, 152, 90, 0.22)'
                    : 'rgba(69, 53, 75, 0.18)',
              },
            },
          }}
        >
          <Typography variant="body2" color="text.secondary">
            SentimentScope turns raw customer reviews into sentiment insights.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Track what you really think about your product.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

function RouteLoader() {
  return (
    <Box
      sx={{
        minHeight: '60vh',
        display: 'grid',
        placeItems: 'center',
      }}
    >
      <CircularProgress color="secondary" />
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
            <Suspense fallback={<RouteLoader />}>
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
                <Route path="/individual-sentiments" element={<ProtectedRoute><IndividualSentimentsPage /></ProtectedRoute>} />
              </Routes>
            </Suspense>
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
