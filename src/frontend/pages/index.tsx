import React, { useState, useEffect } from 'react';
import {
  Box, Button, Container, Typography, Grid, Card, CardContent,
  TextField, LinearProgress, Paper, Chip, Avatar, Stack, Alert,
  AppBar, Toolbar, IconButton, Menu, MenuItem, Divider
} from '@mui/material';
import { 
  PlayArrow, Star, CheckCircle, VideoLibrary, Image, Mic, Movie, 
  AccountCircle, Login, PersonAdd, Settings, Logout, CreditCard
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { apiClient, VideoGenerationRequest, TaskStatus } from '../services/api';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { user, isAuthenticated, credits, logout, refreshCredits } = useAuth();
  const router = useRouter();

  // Refresh credits on mount
  useEffect(() => {
    if (isAuthenticated) {
      refreshCredits();
    }
  }, [isAuthenticated, refreshCredits]);

  const handleGenerate = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (!prompt.trim()) {
      setError('Please enter a video description');
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setError('');
    setSuccess('');

    try {
      const request: VideoGenerationRequest = {
        prompt: prompt.trim(),
        aspect_ratio: '16:9',
        num_frames: 97,
        guidance_scale: 6.0,
        enhance_prompt: true
      };

      const response = await apiClient.generateTextToVideo(request);
      setCurrentTask(response.task_id);
      setSuccess(`Video generation started! Estimated time: ${response.estimated_time}`);

      // Start polling for status
      pollTaskStatus(response.task_id);

    } catch (err: any) {
      setError(apiClient.handleError(err));
      setIsGenerating(false);
    }
  };

  const pollTaskStatus = async (taskId: string) => {
    try {
      await apiClient.pollTaskStatus(
        taskId,
        (status: TaskStatus) => {
          setProgress(status.progress);
          
          if (status.status === 'completed') {
            setSuccess('Video generated successfully!');
            setIsGenerating(false);
            refreshCredits(); // Refresh credits after generation
            
            // Optionally redirect to video library
            setTimeout(() => {
              router.push('/videos');
            }, 2000);
          }
        }
      );
    } catch (err: any) {
      setError(apiClient.handleError(err));
      setIsGenerating(false);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    await logout();
  };

  return (
    <>
      {/* Navigation Bar */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            🎬 CineVivid
          </Typography>
          
          {isAuthenticated ? (
            <>
              <Chip
                icon={<CreditCard />}
                label={`${credits} Credits`}
                color="secondary"
                sx={{ mr: 2 }}
              />
              <IconButton
                size="large"
                onClick={handleMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={() => { handleMenuClose(); router.push('/dashboard'); }}>
                  <Settings sx={{ mr: 1 }} /> Dashboard
                </MenuItem>
                <MenuItem onClick={() => { handleMenuClose(); router.push('/videos'); }}>
                  <VideoLibrary sx={{ mr: 1 }} /> My Videos
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <Logout sx={{ mr: 1 }} /> Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Stack direction="row" spacing={1}>
              <Button
                color="inherit"
                startIcon={<Login />}
                onClick={() => router.push('/login')}
              >
                Login
              </Button>
              <Button
                color="inherit"
                startIcon={<PersonAdd />}
                onClick={() => router.push('/register')}
              >
                Register
              </Button>
            </Stack>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Hero Section */}
        <Box textAlign="center" mb={6}>
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            🎬 CineVivid
          </Typography>
          <Typography variant="h5" color="text.secondary" mb={4}>
            AI Video Creation Made Simple
          </Typography>
          <Typography variant="body1" mb={4}>
            Transform your ideas into stunning videos with our advanced AI technology powered by SkyReels-V2
          </Typography>
          
          {isAuthenticated && (
            <Typography variant="body2" color="primary" mb={2}>
              Welcome back, {user?.username}! You have {credits} credits remaining.
            </Typography>
          )}
        </Box>

        {/* Generation Form */}
        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Create Your Video
          </Typography>

          {!isAuthenticated && (
            <Alert severity="info" sx={{ mb: 3 }}>
              Please <Button onClick={() => router.push('/login')} size="small">login</Button> or{' '}
              <Button onClick={() => router.push('/register')} size="small">register</Button> to generate videos.
            </Alert>
          )}

          {/* Error/Success Messages */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
              {success}
            </Alert>
          )}

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Describe your video"
            placeholder="A majestic eagle soaring through mountain peaks at sunset, cinematic quality, professional camera work..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            sx={{ mb: 3 }}
            disabled={isGenerating || !isAuthenticated}
            helperText={
              isAuthenticated 
                ? `Cost: ~${Math.ceil((97 / 24) * 10)} credits • AI prompt enhancement included`
                : 'Please login to generate videos'
            }
          />

          {isGenerating && (
            <Box mb={3}>
              <LinearProgress variant="determinate" value={progress} />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Generating your video... {progress}%
                {currentTask && (
                  <Typography variant="caption" display="block">
                    Task ID: {currentTask}
                  </Typography>
                )}
              </Typography>
            </Box>
          )}

          <Stack direction="row" spacing={2} alignItems="center">
            <Button
              variant="contained"
              size="large"
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating || !isAuthenticated}
              sx={{ minWidth: 200 }}
            >
              {isGenerating ? 'Generating...' : 'Generate Video'}
            </Button>

            {isAuthenticated && (
              <Button
                variant="outlined"
                onClick={() => router.push('/videos')}
              >
                View My Videos
              </Button>
            )}
          </Stack>
        </Paper>

        {/* Features Grid */}
        <Typography variant="h4" textAlign="center" mb={4}>
          Powerful AI Tools
        </Typography>

        <Grid container spacing={3} mb={6}>
          {[
            { 
              icon: <VideoLibrary />, 
              title: 'Text to Video', 
              desc: 'Transform text into cinematic videos',
              href: isAuthenticated ? '/tools/text-to-video' : '/login'
            },
            { 
              icon: <Image />, 
              title: 'Image to Video', 
              desc: 'Animate static images with motion',
              href: isAuthenticated ? '/tools/image-to-video' : '/login'
            },
            { 
              icon: <Mic />, 
              title: 'AI Voiceover', 
              desc: 'Natural speech synthesis',
              href: isAuthenticated ? '/tools/voiceover' : '/login'
            },
            { 
              icon: <Movie />, 
              title: 'Video Editing', 
              desc: 'Trim, effects, and enhancements',
              href: isAuthenticated ? '/tools/video-editor' : '/login'
            }
          ].map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card 
                sx={{ 
                  height: '100%', 
                  textAlign: 'center', 
                  p: 2,
                  cursor: 'pointer',
                  '&:hover': {
                    elevation: 4,
                    transform: 'translateY(-2px)',
                    transition: 'all 0.2s'
                  }
                }}
                onClick={() => router.push(feature.href)}
              >
                <Box sx={{ fontSize: 48, color: 'primary.main', mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography variant="h6" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.desc}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Testimonials */}
        <Typography variant="h4" textAlign="center" mb={4}>
          What Creators Say
        </Typography>

        <Grid container spacing={3}>
          {[
            { name: 'Alex Chen', role: 'Content Creator', text: 'CineVivid transformed my content creation workflow!', rating: 5 },
            { name: 'Sarah Mitchell', role: 'Marketing Director', text: 'Incredible quality and speed. Highly recommended!', rating: 5 },
            { name: 'Marcus Rodriguez', role: 'Filmmaker', text: 'The AI understands cinematic language perfectly.', rating: 5 }
          ].map((testimonial, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ p: 3, height: '100%' }}>
                <Stack direction="row" spacing={1} mb={2}>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} sx={{ color: 'gold' }} />
                  ))}
                </Stack>
                <Typography variant="body1" mb={2}>
                  "{testimonial.text}"
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar>{testimonial.name[0]}</Avatar>
                  <Box>
                    <Typography variant="subtitle1">{testimonial.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{testimonial.role}</Typography>
                  </Box>
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* CTA Section */}
        {!isAuthenticated && (
          <Box textAlign="center" mt={6}>
            <Paper sx={{ p: 4, bgcolor: 'primary.main', color: 'white' }}>
              <Typography variant="h5" gutterBottom>
                Ready to Create Amazing Videos?
              </Typography>
              <Typography variant="body1" mb={3}>
                Join thousands of creators using AI to bring their ideas to life
              </Typography>
              <Stack direction="row" spacing={2} justifyContent="center">
                <Button 
                  variant="contained" 
                  color="secondary"
                  size="large"
                  onClick={() => router.push('/register')}
                >
                  Get Started Free
                </Button>
                <Button 
                  variant="outlined" 
                  color="inherit"
                  size="large"
                  onClick={() => router.push('/login')}
                >
                  Sign In
                </Button>
              </Stack>
            </Paper>
          </Box>
        )}
      </Container>
    </>
  );
}