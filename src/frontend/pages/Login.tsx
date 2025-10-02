/**
 * Login Page Component
 * User authentication login form
 */
import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import { apiClient } from '../services/api';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await login(username, password);
      
      // Redirect to dashboard or intended page
      const redirectTo = (router.query.redirect as string) || '/dashboard';
      router.push(redirectTo);
      
    } catch (err: any) {
      setError(apiClient.handleError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            maxWidth: 400
          }}
        >
          {/* Header */}
          <Box textAlign="center" mb={3}>
            <Typography variant="h4" component="h1" gutterBottom>
              🎬 CineVivid
            </Typography>
            <Typography variant="h6" color="textSecondary">
              Welcome Back
            </Typography>
            <Typography variant="body2" color="textSecondary" mt={1}>
              Sign in to create amazing AI videos
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username or Email"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email />
                  </InputAdornment>
                )
              }}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{ mb: 2 }}
            >
              {isLoading ? (
                <CircularProgress size={24} />
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Demo Account */}
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>Demo Account:</strong><br />
              Username: demo<br />
              Password: demo123
            </Typography>
          </Alert>

          {/* Footer Links */}
          <Box textAlign="center">
            <Typography variant="body2" color="textSecondary">
              Don't have an account?{' '}
              <Link 
                component="button"
                variant="body2"
                onClick={() => router.push('/register')}
                sx={{ textDecoration: 'none' }}
              >
                Sign up here
              </Link>
            </Typography>
            
            <Typography variant="body2" color="textSecondary" mt={1}>
              <Link 
                component="button"
                variant="body2"
                onClick={() => router.push('/forgot-password')}
                sx={{ textDecoration: 'none' }}
              >
                Forgot password?
              </Link>
            </Typography>
          </Box>

          {/* Quick Login Buttons */}
          <Box mt={3}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => {
                setUsername('demo');
                setPassword('demo123');
              }}
              disabled={isLoading}
              sx={{ mb: 1 }}
            >
              Use Demo Account
            </Button>
            
            <Button
              fullWidth
              variant="outlined"
              onClick={() => {
                setUsername('admin');
                setPassword('admin123');
              }}
              disabled={isLoading}
            >
              Admin Login
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;