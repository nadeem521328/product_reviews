import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Autocomplete,
  Button,
  Alert,
  CircularProgress,
  Link,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Login as LoginIcon,
} from '@mui/icons-material';
import { useThemeContext } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, register, getSavedCredentials } = useAuth();
  const { mode } = useThemeContext();
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));

  const [savedEmails, setSavedEmails] = useState([]);
  const [savedCreds, setSavedCreds] = useState([]);

  useEffect(() => {
    console.log('Loading saved creds...');
    const creds = getSavedCredentials();
    console.log('Saved creds:', creds);
    if (creds && creds.length > 0) {
      setSavedCreds(creds);
      setSavedEmails(creds.map(cred => cred.email));
      console.log('Set savedEmails:', creds.map(cred => cred.email));
    } else {
      console.log('No saved creds found');
    }
  }, [getSavedCredentials]);

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
    <Container
      component="main"
      maxWidth="sm"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        py: 4,
        background: mode === 'dark'
          ? 'linear-gradient(135deg, #1a1a1a 0%, #006400 100%, #228B22 100%)'
          : 'linear-gradient(135deg, #FDF6E3 0%, #F5F5DC 50%, #E0D4A8 100%)',
        flexDirection: 'column',
      }}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: 450,
          boxShadow: '0 20px 60px rgba(0,100,0,0.3)',
          borderRadius: '24px',
          transition: 'transform 0.4s ease, box-shadow 0.4s ease',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 24px 80px rgba(0,100,0,0.4)',
          },
        }}
      >
        <CardContent sx={{ p: 4, pt: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <LoginIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
            <Typography component="h1" variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: '12px' }}>
              {error}
            </Alert>
          )}

          <Box component="form" autoComplete="off" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <Autocomplete
              freeSolo
              openOnFocus={true}
              clearOnBlur={false}
              forcePopupIcon={false}
              options={savedEmails}
              value={email}
              onChange={(event, newValue) => {
                setEmail(newValue || '');
                if (newValue && typeof newValue === 'string') {
                  const cred = savedCreds.find(c => c.email === newValue);
                  if (cred) setPassword(cred.password);
                }
              }}
              inputValue={email}
              onInputChange={(event, newInputValue) => {
                setEmail(newInputValue);
              }}
              fullWidth
              margin="normal"
              id="email"
              label="Email Address"
              autoComplete={false}
              autoFocus
              renderInput={(params) => (
                <TextField
                  {...params}
                  required
                  id="user_email"
                  inputMode="none"
                  autoComplete="email"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        <EmailIcon sx={{ mr: 1, color: 'action.active' }} />
                        {params.InputProps.startAdornment}
                      </>
                    ),
                  }}
                  sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                />
              )}
            />
            {savedEmails.length === 0 && (
              <Alert severity="info" sx={{ mb: 2, borderRadius: '12px' }}>
                No saved login emails ({savedEmails.length}). Login once to save.
              </Alert>
            )}
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              id="user_password"
              autoComplete="new-password"
              inputMode="none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: <LockIcon sx={{ mr: 1, color: 'action.active' }} />,
              }}
              sx={{ mb: isSignUp ? 2 : 3, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            />
            {isSignUp && (
              <TextField
                margin="normal"
                required
                fullWidth
                label="Confirm Password"
                type="password"
                id="user_confirm_password"
                autoComplete="new-password"
                inputMode="none"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                InputProps={{
                  startAdornment: <LockIcon sx={{ mr: 1, color: 'action.active' }} />,
                }}
                sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              size="large"
              sx={{ py: 1.5, fontSize: '1.1rem', borderRadius: '12px' }}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
            >
              {loading ? (isSignUp ? 'Creating Account...' : 'Signing In...') : (isSignUp ? 'Sign Up' : 'Sign In')}
            </Button>
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={toggleForm}
                sx={{ mt: 2, borderRadius: '12px', py: 1 }}
              >
                {isSignUp ? 'Already have account? Sign In' : 'Need an account? Sign Up'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Login;

