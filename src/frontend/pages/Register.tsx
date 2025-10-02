/**
 * Register Page Component
 * User registration form
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
  IconButton,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock, Person } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import { apiClient } from '../services/api';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const router = useRouter();

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const validateForm = (): string | null => {
    const { username, email, password, confirmPassword } = formData;

    if (!username || !email || !password || !confirmPassword) {
      return 'Please fill in all required fields';
    }

    if (username.length < 3) {
      return 'Username must be at least 3 characters long';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'Please enter a valid email address';
    }

    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }

    if (password !== confirmPassword) {
      return 'Passwords do not match';
    }

    if (!acceptTerms) {
      return 'Please accept the terms and conditions';
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await register(
        formData.username,
        formData.email,
        formData.password,
        formData.fullName || undefined
      );
      
      // Redirect to dashboard
      router.push('/dashboard');
      
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
          justifyContent: 'center',
          py: 4
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            maxWidth: 500
          }}
        >
          {/* Header */}
          <Box textAlign="center" mb={3}>
            <Typography variant="h4" component="h1" gutterBottom>
              🎬 CineVivid
            </Typography>
            <Typography variant="h6" color="textSecondary">
              Create Account
            </Typography>
            <Typography variant="body2" color="textSecondary" mt={1}>
              Join thousands creating amazing AI videos
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              required
              value={formData.username}
              onChange={handleChange('username')}
              disabled={isLoading}
              sx={{ mb: 2 }}
              helperText="Choose a unique username (3+ characters)"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person />
                  </InputAdornment>
                )
              }}
            />

            <TextField
              fullWidth
              label="Email Address"
              type="email"
              variant="outlined"
              required
              value={formData.email}
              onChange={handleChange('email')}
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
              label="Full Name (Optional)"
              variant="outlined"
              value={formData.fullName}
              onChange={handleChange('fullName')}
              disabled={isLoading}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person />
                  </InputAdornment>
                )
              }}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              required
              value={formData.password}
              onChange={handleChange('password')}
              disabled={isLoading}
              sx={{ mb: 2 }}
              helperText="Must be at least 6 characters"
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

            <TextField
              fullWidth
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              required
              value={formData.confirmPassword}
              onChange={handleChange('confirmPassword')}
              disabled={isLoading}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                )
              }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  disabled={isLoading}
                />
              }
              label={
                <Typography variant="body2">
                  I agree to the{' '}
                  <Link href="/terms" target="_blank">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" target="_blank">
                    Privacy Policy
                  </Link>
                </Typography>
              }
              sx={{ mb: 3 }}
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
                'Create Account'
              )}
            </Button>
          </form>

          {/* Welcome Benefits */}
          <Alert severity="success" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>🎉 New User Benefits:</strong><br />
              • 300 free credits to get started<br />
              • Access to all AI video tools<br />
              • Community support and tutorials
            </Typography>
          </Alert>

          {/* Footer Links */}
          <Box textAlign="center">
            <Typography variant="body2" color="textSecondary">
              Already have an account?{' '}
              <Link 
                component="button"
                variant="body2"
                onClick={() => router.push('/login')}
                sx={{ textDecoration: 'none' }}
              >
                Sign in here
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;