import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Grid,
  Stack,
  Chip,
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Login as LoginIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSignUp && password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError('');
      if (isSignUp) {
        await register(email, password);
      } else {
        await login(email, password);
      }
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 8 } }}>
      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12} md={6}>
          <Box sx={{ pr: { md: 4 } }}>
            <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap' }}>
              <Chip label="Secure Login" color="secondary" />
              <Chip label="Review Intelligence" variant="outlined" />
            </Stack>
            <Typography variant="h2" sx={{ mb: 2 }}>
              Customer sentiment, presented like a complete website.
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 640 }}>
              Sign in to analyze review datasets, inspect sentiment patterns, and move from raw text to a clear dashboard.
            </Typography>
            <Stack spacing={2}>
              {[
                'Protected routes for your analysis workspace',
                'Quick login using saved emails already stored in the browser',
                'A cleaner path from sign-in to search to dashboard',
              ].map((item) => (
                <Card
                  key={item}
                  sx={{
                    p: 2.5,
                    borderRadius: '18px',
                    background: 'linear-gradient(160deg, rgba(18,52,59,0.96), rgba(28,57,64,0.92))',
                    color: '#FAF8F5',
                    borderColor: 'rgba(111, 160, 166, 0.22)',
                  }}
                >
                  <Typography>{item}</Typography>
                </Card>
              ))}
            </Stack>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box
            sx={{
              position: 'relative',
              maxWidth: 520,
              mx: 'auto',
              '&::before': {
                content: '""',
                position: 'absolute',
                inset: { xs: '-18px', md: '-28px' },
                borderRadius: '36px',
                background: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'radial-gradient(circle at top, rgba(111,160,166,0.28) 0%, rgba(200,145,102,0.18) 42%, rgba(200,145,102,0) 74%)'
                    : 'radial-gradient(circle at top, rgba(31,78,87,0.16) 0%, rgba(184,116,68,0.12) 42%, rgba(184,116,68,0) 74%)',
                filter: 'blur(28px)',
                pointerEvents: 'none',
              },
            }}
          >
            <Card
              sx={{
                position: 'relative',
                zIndex: 1,
                borderRadius: '18px',
                background: 'linear-gradient(160deg, rgba(18,52,59,0.98), rgba(28,57,64,0.94))',
                color: '#FAF8F5',
                borderColor: 'rgba(111, 160, 166, 0.22)',
                '& .MuiTypography-root': {
                  color: 'inherit',
                },
                '& .MuiTypography-colorTextSecondary': {
                  color: 'rgba(199, 210, 214, 0.84)',
                },
                '& .MuiOutlinedInput-root': {
                  color: '#FAF8F5',
                  backgroundColor: 'rgba(250,248,245,0.04)',
                  '& fieldset': {
                    borderColor: 'rgba(199, 210, 214, 0.28)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(111, 160, 166, 0.46)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#C89166',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(199, 210, 214, 0.82)',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#E0B692',
                },
                '& .MuiSvgIcon-root': {
                  color: 'rgba(199, 210, 214, 0.82)',
                },
              }}
            >
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', mb: 3 }}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    display: 'grid',
                    placeItems: 'center',
                    color: 'common.white',
                    background: 'linear-gradient(135deg, #12343B 0%, #B87444 100%)',
                    mb: 2,
                  }}
                >
                  <LoginIcon sx={{ fontSize: 34 }} />
                </Box>
                <Typography component="h1" variant="h3">
                  {isSignUp ? 'Create your workspace' : 'Welcome back'}
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }}>
                  {isSignUp ? 'Set up an account to start analyzing review data.' : 'Continue into your review analysis dashboard.'}
                </Typography>
              </Box>

              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

              <Box component="form" autoComplete="off" onSubmit={handleSubmit} noValidate>
                <TextField
                  required
                  fullWidth
                  label="Email address"
                  type="email"
                  name="no-autofill-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="off"
                  inputProps={{
                    autoComplete: 'off',
                  }}
                  InputProps={{
                    startAdornment: <EmailIcon sx={{ mr: 1, color: 'action.active' }} />,
                  }}
                  sx={{ mb: 2 }}
                />

                <TextField
                  required
                  fullWidth
                  label="Password"
                  type="password"
                  name="no-autofill-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  inputProps={{
                    autoComplete: 'new-password',
                  }}
                  InputProps={{
                    startAdornment: <LockIcon sx={{ mr: 1, color: 'action.active' }} />,
                  }}
                  sx={{ mb: isSignUp ? 2 : 3 }}
                />

                {isSignUp && (
                  <TextField
                    required
                    fullWidth
                    label="Confirm password"
                    type="password"
                    name="no-autofill-confirm-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    inputProps={{
                      autoComplete: 'new-password',
                    }}
                    InputProps={{
                      startAdornment: <LockIcon sx={{ mr: 1, color: 'action.active' }} />,
                    }}
                    sx={{ mb: 3 }}
                  />
                )}

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="secondary"
                    disabled={loading}
                    size="large"
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
                  >
                    {loading ? (isSignUp ? 'Creating account...' : 'Signing in...') : (isSignUp ? 'Sign up' : 'Sign in')}
                  </Button>
                  <Button fullWidth variant="outlined" onClick={toggleForm} size="large">
                    {isSignUp ? 'Use sign in' : 'Create account'}
                  </Button>
                </Stack>

              </Box>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Login;
