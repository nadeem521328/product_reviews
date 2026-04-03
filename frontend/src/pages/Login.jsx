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
  const [credentialsEditable, setCredentialsEditable] = useState(false);
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
    setCredentialsEditable(false);
  };

  const enableCredentialSuggestions = () => {
    if (!credentialsEditable) {
      setCredentialsEditable(true);
    }
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
                    background: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'linear-gradient(160deg, rgba(36,29,40,0.98), rgba(49,39,54,0.94))'
                        : 'linear-gradient(160deg, rgba(255,253,249,0.98), rgba(244,236,226,0.96))',
                    color: 'text.primary',
                    borderColor: (theme) =>
                      theme.palette.mode === 'dark' ? 'rgba(185, 152, 90, 0.14)' : 'rgba(69, 53, 75, 0.12)',
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
                    ? 'radial-gradient(circle at top, rgba(162,138,168,0.28) 0%, rgba(198,164,106,0.20) 42%, rgba(198,164,106,0) 74%)'
                    : 'radial-gradient(circle at top, rgba(69,53,75,0.24) 0%, rgba(185,152,90,0.18) 42%, rgba(185,152,90,0) 74%)',
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
                background: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'linear-gradient(160deg, rgba(36,29,40,0.98), rgba(49,39,54,0.94))'
                    : 'linear-gradient(160deg, rgba(255,253,249,0.98), rgba(244,236,226,0.96))',
                color: 'text.primary',
                borderColor: (theme) =>
                  theme.palette.mode === 'dark' ? 'rgba(185, 152, 90, 0.16)' : 'rgba(69, 53, 75, 0.16)',
                '& .MuiTypography-root': {
                  color: 'inherit',
                },
                '& .MuiTypography-colorTextSecondary': {
                  color: 'text.secondary',
                },
                '& .MuiOutlinedInput-root': {
                  color: 'text.primary',
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'dark' ? 'rgba(250,247,242,0.05)' : 'rgba(255,255,255,0.82)',
                  '& fieldset': {
                    borderColor: (theme) =>
                      theme.palette.mode === 'dark' ? 'rgba(250,247,242,0.14)' : 'rgba(69,53,75,0.18)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'secondary.main',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'secondary.main',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'text.secondary',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'secondary.main',
                },
                '& .MuiSvgIcon-root': {
                  color: 'text.secondary',
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
                    background: 'linear-gradient(135deg, #45354B 0%, #B9985A 100%)',
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

              <Box component="form" autoComplete="on" onSubmit={handleSubmit} noValidate>
                <TextField
                  required
                  fullWidth
                  label="Email address"
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="username"
                  inputProps={{
                    autoComplete: 'username',
                    readOnly: !credentialsEditable,
                  }}
                  InputProps={{
                    startAdornment: <EmailIcon sx={{ mr: 1, color: 'action.active' }} />,
                  }}
                  onFocus={enableCredentialSuggestions}
                  onMouseDown={enableCredentialSuggestions}
                  sx={{ mb: 2 }}
                />

                <TextField
                  required
                  fullWidth
                  label="Password"
                  type="password"
                  name="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  inputProps={{
                    autoComplete: isSignUp ? 'new-password' : 'current-password',
                    readOnly: !credentialsEditable && !isSignUp,
                  }}
                  InputProps={{
                    startAdornment: <LockIcon sx={{ mr: 1, color: 'action.active' }} />,
                  }}
                  onFocus={enableCredentialSuggestions}
                  onMouseDown={enableCredentialSuggestions}
                  sx={{ mb: isSignUp ? 2 : 3 }}
                />

                {isSignUp && (
                  <TextField
                    required
                    fullWidth
                    label="Confirm password"
                    type="password"
                    name="confirmPassword"
                    id="confirm-password"
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
