import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Paper,
  Avatar,
  Stack,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Divider
} from '@mui/material';
import {
  PlayArrow,
  Star,
  CheckCircle,
  TrendingUp,
  People,
  VideoLibrary,
  Image,
  Mic,
  Movie,
  Edit,
  AccountCircle,
  Login,
  PersonAdd,
  Settings,
  Logout,
  CreditCard,
  KeyboardArrowDown
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [toolsMenuAnchor, setToolsMenuAnchor] = useState<null | HTMLElement>(null);
  
  const { user, isAuthenticated, credits, logout, refreshCredits } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      refreshCredits();
    }
  }, [isAuthenticated, refreshCredits]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleToolsMenu = (event: React.MouseEvent<HTMLElement>) => {
    setToolsMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleToolsMenuClose = () => {
    setToolsMenuAnchor(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    await logout();
  };

  const recentCreations = [
    {
      id: 1,
      title: '🚀 Futuristic Cityscape Animation',
      thumbnail: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop',
      duration: '00:15',
      views: '12.1K',
      likes: 892,
      creator: 'Alex Chen'
    },
    {
      id: 2,
      title: '🌅 Majestic Mountain Sunrise',
      thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      duration: '00:20',
      views: '25.2K',
      likes: 1234,
      creator: 'Sarah Mitchell'
    },
    {
      id: 3,
      title: '🏙️ Neon Night City Exploration',
      thumbnail: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=400&h=300&fit=crop',
      duration: '00:12',
      views: '18.8K',
      likes: 756,
      creator: 'Marcus Rodriguez'
    },
    {
      id: 4,
      title: '🌊 Tranquil Ocean Waves',
      thumbnail: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&h=300&fit=crop',
      duration: '00:18',
      views: '33.7K',
      likes: 1456,
      creator: 'Emma Thompson'
    }
  ];

  const features = [
    {
      icon: <VideoLibrary sx={{ fontSize: 48, color: 'primary.main' }} />,
      title: '🎬 AI Video',
      description: 'Transform your wildest ideas into cinematic masterpieces with AI-powered video generation',
      popular: true,
      path: '/tools/text-to-video'
    },
    {
      icon: <Movie sx={{ fontSize: 48, color: 'primary.main' }} />,
      title: '🎭 AI Drama',
      description: 'Create compelling short dramas and storytelling content with AI assistance',
      popular: true,
      path: '/tools/generate-drama'
    },
    {
      icon: <Image sx={{ fontSize: 48, color: 'primary.main' }} />,
      title: '🖼️ Generate Image',
      description: 'Generate stunning, professional-quality images from detailed text descriptions',
      popular: true,
      path: '/tools/text-to-image'
    },
    {
      icon: <Mic sx={{ fontSize: 48, color: 'primary.main' }} />,
      title: '🎤 Talking Avatar',
      description: 'Create animated avatars that speak your text with natural expressions and voice cloning',
      popular: true,
      path: '/tools/talking-avatar'
    },
    {
      icon: <PlayArrow sx={{ fontSize: 48, color: 'primary.main' }} />,
      title: '🎪 Generate Drama',
      description: 'Specialized tool for cinematic short film creation with AI scene planning',
      popular: false,
      path: '/tools/short-film'
    },
    {
      icon: <Edit sx={{ fontSize: 48, color: 'primary.main' }} />,
      title: '✂️ Video Editor',
      description: 'Professional video editing with trim, transitions, text overlays, and export options',
      popular: false,
      path: '/tools/video-editor'
    }
  ];

  const stats = [
    { value: '10K+', label: 'Videos Created', icon: <VideoLibrary /> },
    { value: '50K+', label: 'Happy Users', icon: <People /> },
    { value: '99%', label: 'Success Rate', icon: <CheckCircle /> },
    { value: '24/7', label: 'AI Processing', icon: <TrendingUp /> }
  ];

  const toolsItems = [
    { text: 'AI Video', path: '/tools/text-to-video', icon: <VideoLibrary sx={{ mr: 1, fontSize: 18 }} />, popular: true },
    { text: 'AI Drama', path: '/tools/generate-drama', icon: <Movie sx={{ mr: 1, fontSize: 18 }} />, popular: true },
    { text: 'Generate Image', path: '/tools/text-to-image', icon: <Image sx={{ mr: 1, fontSize: 18 }} />, popular: true },
    { text: 'Talking Avatar', path: '/tools/talking-avatar', icon: <PlayArrow sx={{ mr: 1, fontSize: 18 }} />, popular: true },
    { text: 'Lip Sync', path: '/tools/lip-sync', icon: <Mic sx={{ mr: 1, fontSize: 18 }} />, popular: false },
    { text: 'Short Film Creator', path: '/tools/short-film', icon: <Movie sx={{ mr: 1, fontSize: 18 }} />, popular: false }
  ];

  return (
    <Box>
      {/* Navigation Bar */}
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid',
          borderColor: 'grey.200',
          color: 'text.primary',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 0, md: 2 } }}>
            {/* Logo and Brand */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography
                variant="h6"
                onClick={() => router.push('/')}
                sx={{
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  cursor: 'pointer',
                  mr: 3,
                  fontSize: { xs: '1.1rem', md: '1.25rem' },
                }}
              >
                🎬 CineVivid
              </Typography>

              {/* Navigation Links */}
              <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
                <Button
                  onClick={() => router.push('/')}
                  sx={{ color: 'text.primary', fontWeight: 500 }}
                >
                  Home
                </Button>
                {isAuthenticated && (
                  <Button
                    onClick={() => router.push('/videos')}
                    sx={{ color: 'text.primary', fontWeight: 500 }}
                  >
                    My Library
                  </Button>
                )}
                
                {/* Tools Dropdown */}
                <Button
                  onClick={handleToolsMenu}
                  sx={{ color: 'text.primary', fontWeight: 500 }}
                  endIcon={<KeyboardArrowDown />}
                >
                  Tools
                </Button>
              </Box>
            </Box>

            {/* Right Side Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {isAuthenticated ? (
                <>
                  <Chip
                    icon={<CreditCard />}
                    label={`${credits} Credits`}
                    color="secondary"
                    sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
                  />
                  <Button
                    variant="contained"
                    onClick={() => router.push('/tools/text-to-video')}
                    sx={{ mr: 2 }}
                  >
                    Create
                  </Button>
                  <IconButton onClick={handleMenuOpen} color="primary">
                    <AccountCircle />
                  </IconButton>
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
                    variant="contained"
                    startIcon={<PersonAdd />}
                    onClick={() => router.push('/register')}
                  >
                    Get Started Free
                  </Button>
                </Stack>
              )}
            </Box>
          </Toolbar>
        </Container>

        {/* Tools Menu */}
        <Menu
          anchorEl={toolsMenuAnchor}
          open={Boolean(toolsMenuAnchor)}
          onClose={handleToolsMenuClose}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 320,
              borderRadius: 3,
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            },
          }}
        >
          <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'grey.200' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              AI Tools
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Choose from our collection of AI-powered tools
            </Typography>
          </Box>

          {toolsItems.map((item, index) => (
            <MenuItem
              key={item.text}
              onClick={() => {
                handleToolsMenuClose();
                router.push(item.path);
              }}
              sx={{ py: 2, px: 3 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <Box sx={{ mr: 2, color: 'primary.main' }}>
                  {item.icon}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {item.text}
                    </Typography>
                    {item.popular && (
                      <Chip
                        label="Popular"
                        size="small"
                        sx={{
                          height: 18,
                          fontSize: '0.7rem',
                          backgroundColor: 'secondary.main',
                          color: 'white',
                        }}
                      />
                    )}
                  </Box>
                </Box>
              </Box>
            </MenuItem>
          ))}
        </Menu>

        {/* User Menu */}
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
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 800,
                  mb: 3,
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                AI Video Creation Made Simple
              </Typography>
              <Typography variant="h5" sx={{ mb: 4, opacity: 0.9, lineHeight: 1.6 }}>
                Transform your ideas into cinematic videos in minutes. From text to video, image to motion,
                voiceover to lip sync - create professional content with AI powered by SkyReels-V2.
              </Typography>
              {isAuthenticated && (
                <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
                  Welcome back, <strong>{user?.username}</strong>! You have <strong>{credits} credits</strong> remaining.
                </Typography>
              )}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => router.push(isAuthenticated ? '/tools/text-to-video' : '/register')}
                  sx={{
                    px: 4,
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    backgroundColor: 'white',
                    color: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'grey.100',
                    },
                  }}
                >
                  {isAuthenticated ? 'Create Video Now' : 'Start Creating Free'}
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => router.push('/tools/all')}
                  sx={{
                    px: 4,
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderColor: 'white',
                    color: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  Explore All Tools
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ position: 'relative', textAlign: 'center' }}>
                <Paper
                  elevation={24}
                  sx={{
                    p: 2,
                    borderRadius: 4,
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <Box
                    sx={{
                      width: '100%',
                      height: 300,
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                    }}
                  >
                    <PlayArrow sx={{ fontSize: 80, color: 'white', opacity: 0.8 }} />
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 16,
                        left: 16,
                        right: 16,
                        background: 'rgba(0, 0, 0, 0.7)',
                        borderRadius: 2,
                        p: 1,
                      }}
                    >
                      <Typography variant="body2" sx={{ color: 'white' }}>
                        AI-generated video preview powered by SkyReels-V2
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ py: 6, backgroundColor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" sx={{ fontWeight: 800, color: 'primary.main', mb: 1 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary', mb: 1 }}>
                    {stat.label}
                  </Typography>
                  <Box sx={{ color: 'primary.main' }}>
                    {stat.icon}
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 10 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            sx={{
              textAlign: 'center',
              mb: 3,
              fontWeight: 800,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Powerful AI Tools for Every Creator
          </Typography>
          <Typography
            variant="h5"
            sx={{
              textAlign: 'center',
              mb: 8,
              color: 'text.secondary',
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            From simple text prompts to complex short films, create professional video content with our comprehensive AI toolkit.
          </Typography>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    textAlign: 'center',
                    p: 3,
                    position: 'relative',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      transition: 'transform 0.3s ease',
                      boxShadow: 6
                    },
                  }}
                  onClick={() => router.push(isAuthenticated ? feature.path : '/register')}
                >
                  {feature.popular && (
                    <Chip
                      label="Popular"
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        backgroundColor: 'secondary.main',
                        color: 'white',
                        fontWeight: 600,
                      }}
                    />
                  )}
                  <Box sx={{ mb: 3 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
                    {feature.description}
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{ borderRadius: 3 }}
                  >
                    {isAuthenticated ? 'Try Now' : 'Get Started'}
                  </Button>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Recent Creations */}
      <Box sx={{ py: 10, backgroundColor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            sx={{
              textAlign: 'center',
              mb: 3,
              fontWeight: 800,
            }}
          >
            See What Creators Are Making
          </Typography>
          <Typography
            variant="h5"
            sx={{
              textAlign: 'center',
              mb: 6,
              color: 'text.secondary',
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            Explore amazing AI-generated videos created by our community
          </Typography>

          <Grid container spacing={4}>
            {recentCreations.map((video) => (
              <Grid item xs={12} sm={6} lg={3} key={video.id}>
                <Card
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      transition: 'transform 0.3s ease',
                    },
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={video.thumbnail}
                      alt={video.title}
                      sx={{ objectFit: 'cover' }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        right: 12,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Chip
                        label={video.duration}
                        size="small"
                        sx={{
                          backgroundColor: 'rgba(0,0,0,0.7)',
                          color: 'white',
                          fontWeight: 600,
                        }}
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="caption" sx={{ color: 'white', fontWeight: 600 }}>
                          {video.views}
                        </Typography>
                        <Star sx={{ color: 'yellow', fontSize: 16 }} />
                        <Typography variant="caption" sx={{ color: 'white', fontWeight: 600 }}>
                          {video.likes}
                        </Typography>
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                        p: 2,
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          color: 'white',
                          fontWeight: 600,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {video.title}
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => router.push(isAuthenticated ? '/tools/text-to-video' : '/register')}
              sx={{
                px: 6,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: 3,
              }}
            >
              Start Creating Your Video
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ py: 10 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            sx={{
              textAlign: 'center',
              mb: 3,
              fontWeight: 800,
            }}
          >
            Loved by Creators Worldwide
          </Typography>
          <Typography
            variant="h5"
            sx={{
              textAlign: 'center',
              mb: 8,
              color: 'text.secondary',
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            See what creators are saying about CineVivid
          </Typography>

          <Grid container spacing={4}>
            {[
              {
                name: 'Sarah Chen',
                role: '🎬 Content Creator',
                avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
                content: '🚀 CineVivid transformed my content creation workflow! What used to take hours now takes minutes. The AI quality is absolutely incredible! 🎨',
                rating: 5,
                company: 'YouTube Creator'
              },
              {
                name: 'Marcus Johnson',
                role: '📈 Marketing Director',
                avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
                content: '💼 Our marketing team creates 10x more video content now! The camera director feature gives us cinematic quality every single time. Game-changer! 🎯',
                rating: 5,
                company: 'TechCorp Inc.'
              },
              {
                name: 'Elena Rodriguez',
                role: '🎭 Filmmaker',
                avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
                content: '🎪 As a filmmaker, I was skeptical about AI video tools. CineVivid proved me completely wrong! The short film creator is an absolute game-changer. 🎬',
                rating: 5,
                company: 'Independent Films'
              }
            ].map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    p: 3,
                    height: '100%',
                    borderRadius: 3,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      transition: 'transform 0.3s ease',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', mb: 2 }}>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} sx={{ color: 'warning.main', fontSize: 20 }} />
                    ))}
                  </Box>
                  <Typography variant="body1" sx={{ mb: 3, fontStyle: 'italic', lineHeight: 1.6 }}>
                    "{testimonial.content}"
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                      src={testimonial.avatar}
                      sx={{ width: 48, height: 48, mr: 2 }}
                    />
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {testimonial.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {testimonial.role} • {testimonial.company}
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: 10,
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          color: 'white',
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h2" sx={{ mb: 3, fontWeight: 800 }}>
            Ready to Create Amazing Videos?
          </Typography>
          <Typography variant="h5" sx={{ mb: 6, opacity: 0.9, lineHeight: 1.6 }}>
            Join thousands of creators who are already using CineVivid to bring their ideas to life.
            Start creating professional videos with AI today.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center">
            <Button
              variant="contained"
              size="large"
              onClick={() => router.push('/register')}
              sx={{
                px: 6,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 600,
                backgroundColor: 'white',
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'grey.100',
                },
              }}
            >
              Get Started Free
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => router.push('/tools/all')}
              sx={{
                px: 6,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderColor: 'white',
                color: 'white',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              View All Tools
            </Button>
          </Stack>
          <Typography variant="body1" sx={{ mt: 4, opacity: 0.8 }}>
            ✨ No credit card required • 300 free credits to start • Cancel anytime
          </Typography>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 6, backgroundColor: 'grey.900', color: 'white' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                🎬 CineVivid
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, lineHeight: 1.6 }}>
                Transform your ideas into cinematic videos with the power of AI.
                Create professional content in minutes, not hours.
              </Typography>
            </Grid>
            <Grid item xs={12} md={2}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Product
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2" onClick={() => router.push('/tools/text-to-video')} sx={{ color: 'grey.400', cursor: 'pointer', '&:hover': { color: 'white' } }}>
                  Text to Video
                </Typography>
                <Typography variant="body2" onClick={() => router.push('/tools/lip-sync')} sx={{ color: 'grey.400', cursor: 'pointer', '&:hover': { color: 'white' } }}>
                  Lip Sync
                </Typography>
                <Typography variant="body2" onClick={() => router.push('/tools/short-film')} sx={{ color: 'grey.400', cursor: 'pointer', '&:hover': { color: 'white' } }}>
                  Short Film
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={2}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Company
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2" sx={{ color: 'grey.400', cursor: 'pointer', '&:hover': { color: 'white' } }}>
                  About
                </Typography>
                <Typography variant="body2" sx={{ color: 'grey.400', cursor: 'pointer', '&:hover': { color: 'white' } }}>
                  Blog
                </Typography>
                <Typography variant="body2" sx={{ color: 'grey.400', cursor: 'pointer', '&:hover': { color: 'white' } }}>
                  Careers
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={2}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Support
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2" onClick={() => router.push('/docs')} sx={{ color: 'grey.400', cursor: 'pointer', '&:hover': { color: 'white' } }}>
                  Documentation
                </Typography>
                <Typography variant="body2" onClick={() => router.push('/api')} sx={{ color: 'grey.400', cursor: 'pointer', '&:hover': { color: 'white' } }}>
                  API Reference
                </Typography>
                <Typography variant="body2" sx={{ color: 'grey.400', cursor: 'pointer', '&:hover': { color: 'white' } }}>
                  Contact
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={2}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Legal
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2" sx={{ color: 'grey.400', cursor: 'pointer', '&:hover': { color: 'white' } }}>
                  Privacy
                </Typography>
                <Typography variant="body2" sx={{ color: 'grey.400', cursor: 'pointer', '&:hover': { color: 'white' } }}>
                  Terms
                </Typography>
                <Typography variant="body2" sx={{ color: 'grey.400', cursor: 'pointer', '&:hover': { color: 'white' } }}>
                  Security
                </Typography>
              </Stack>
            </Grid>
          </Grid>
          <Box sx={{ borderTop: '1px solid', borderColor: 'grey.800', mt: 6, pt: 4 }}>
            <Typography variant="body2" sx={{ textAlign: 'center', opacity: 0.6 }}>
              © 2025 CineVivid. All rights reserved. Made with ❤️ for creators worldwide.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}