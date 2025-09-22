import React from 'react';
import { Link } from 'react-router-dom';
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
} from '@mui/icons-material';
import Navigation from '../components/Navigation';

const Landing: React.FC = () => {
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
    },
    {
      id: 5,
      title: '🎭 Dramatic Theater Performance',
      thumbnail: 'https://images.unsplash.com/photo-1489599735734-79b4dfe3b22a?w=400&h=300&fit=crop',
      duration: '00:22',
      views: '9.4K',
      likes: 623,
      creator: 'David Park'
    },
    {
      id: 6,
      title: '🎨 Abstract Art Animation',
      thumbnail: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
      duration: '00:14',
      views: '15.6K',
      likes: 987,
      creator: 'Lisa Wang'
    }
  ];

  const features = [
    {
      icon: <VideoLibrary sx={{ fontSize: 48, color: 'primary.main' }} />,
      title: '🎬 Text to Video',
      description: 'Transform your wildest ideas into cinematic masterpieces with AI-powered video generation',
      popular: true
    },
    {
      icon: <Image sx={{ fontSize: 48, color: 'primary.main' }} />,
      title: '🎭 Image to Video',
      description: 'Bring static photos to life with natural motion, perfect for social media magic',
      popular: true
    },
    {
      icon: <Mic sx={{ fontSize: 48, color: 'primary.main' }} />,
      title: '🎤 Voiceover & Lip Sync',
      description: 'Add professional voiceovers and perfect lip sync with 100+ AI voices',
      popular: true
    },
    {
      icon: <Movie sx={{ fontSize: 48, color: 'primary.main' }} />,
      title: '🎪 Short Film Creator',
      description: 'Craft complete short films from script to screen with AI scene planning',
      popular: false
    },
    {
      icon: <PlayArrow sx={{ fontSize: 48, color: 'primary.main' }} />,
      title: '🎭 Talking Avatar',
      description: 'Create animated avatars that speak your text with natural expressions',
      popular: false
    },
    {
      icon: <Edit sx={{ fontSize: 48, color: 'primary.main' }} />,
      title: '✂️ Video Editor',
      description: 'Trim, add text overlays, and apply transitions to perfect your videos',
      popular: false
    }
  ];

  const stats = [
    { value: '10K+', label: 'Videos Created', icon: <VideoLibrary /> },
    { value: '50K+', label: 'Happy Users', icon: <People /> },
    { value: '99%', label: 'Success Rate', icon: <CheckCircle /> },
    { value: '24/7', label: 'AI Processing', icon: <TrendingUp /> }
  ];

  return (
    <Box>
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
                voiceover to lip sync - create professional content with AI.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  component={Link}
                  to="/home/tools/to-video"
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
                  Start Creating Free
                </Button>
                <Button
                  variant="outlined"
                  size="large"
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
                  Watch Demo
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  position: 'relative',
                  textAlign: 'center',
                }}
              >
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
                        AI-generated video preview
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
              <Grid item xs={12} md={6} lg={3} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    textAlign: 'center',
                    p: 3,
                    position: 'relative',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      transition: 'transform 0.3s ease',
                    },
                  }}
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
                    component={Link}
                    to="/home/tools/to-video"
                    sx={{ borderRadius: 3 }}
                  >
                    Try Now
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
              component={Link}
              to="/home/tools/to-video"
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
              },
              {
                name: 'David Kim',
                role: '📱 Social Media Manager',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
                content: '🎤 The talking avatar feature with voice cloning is perfect for our brand videos! Saves us thousands in production costs. Highly recommend! 💰',
                rating: 5,
                company: 'SocialBoost Agency'
              },
              {
                name: 'Lisa Wang',
                role: '🎨 Motion Designer',
                avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
                content: '✨ The video editor with text overlays and transitions is a dream come true! Professional quality results in minutes, not hours. Love it! 🎨',
                rating: 5,
                company: 'Creative Studio'
              },
              {
                name: 'Alex Thompson',
                role: '📊 Data Analyst',
                avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
                content: '📈 Even as a non-creative professional, I can create stunning videos for presentations! The templates are amazing and so easy to use. 🤩',
                rating: 5,
                company: 'Analytics Pro'
              }
            ].map((testimonial, index) => (
              <Grid item xs={12} md={6} key={index}>
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
                        {testimonial.role}
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
              component={Link}
              to="/home/tools/to-video"
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
              View Pricing
            </Button>
          </Stack>
          <Typography variant="body1" sx={{ mt: 4, opacity: 0.8 }}>
            ✨ No credit card required • 100 free credits to start • Cancel anytime
          </Typography>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 6, backgroundColor: 'grey.900', color: 'white' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                CineVivid
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
                <Typography variant="body2" component={Link} to="/home/tools/to-video" sx={{ color: 'grey.400', textDecoration: 'none', '&:hover': { color: 'white' } }}>
                  Text to Video
                </Typography>
                <Typography variant="body2" component={Link} to="/home/tools/lip-sync" sx={{ color: 'grey.400', textDecoration: 'none', '&:hover': { color: 'white' } }}>
                  Lip Sync
                </Typography>
                <Typography variant="body2" component={Link} to="/home/short-film" sx={{ color: 'grey.400', textDecoration: 'none', '&:hover': { color: 'white' } }}>
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
                <Typography variant="body2" sx={{ color: 'grey.400', cursor: 'pointer', '&:hover': { color: 'white' } }}>
                  Help Center
                </Typography>
                <Typography variant="body2" sx={{ color: 'grey.400', cursor: 'pointer', '&:hover': { color: 'white' } }}>
                  API Docs
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
};

export default Landing;