import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
} from '@mui/material';
import {
  VideoLibrary,
  Mic,
  Image,
  Movie,
  PlayArrow,
  SmartToy,
  Collections,
  Edit,
} from '@mui/icons-material';

const AllTools: React.FC = () => {
  const tools = [
    {
      id: 'to-video',
      title: '🎬 Text to Video',
      description: 'Transform your wildest ideas into cinematic masterpieces with AI-powered video generation and camera controls',
      icon: <VideoLibrary sx={{ fontSize: 40, color: 'primary.main' }} />,
      image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop',
      path: '/home/tools/to-video',
      category: 'Video Generation',
      featured: true,
      users: '50K+',
      rating: 4.9
    },
    {
      id: 'lip-sync',
      title: '🎤 Lip Sync Pro',
      description: 'Create hyper-realistic lip-sync videos with perfect audio-visual synchronization',
      icon: <Mic sx={{ fontSize: 40, color: 'primary.main' }} />,
      image: 'https://images.unsplash.com/photo-1489599735734-79b4dfe3b22a?w=400&h=300&fit=crop',
      path: '/home/tools/lip-sync',
      category: 'Audio/Video',
      featured: true,
      users: '25K+',
      rating: 4.8
    },
    {
      id: 'text2image',
      title: '🎨 Text to Image',
      description: 'Generate stunning, professional-quality images from detailed text descriptions',
      icon: <Image sx={{ fontSize: 40, color: 'primary.main' }} />,
      image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
      path: '/home/tools/text2image',
      category: 'Image Generation',
      featured: true,
      users: '75K+',
      rating: 4.9
    },
    {
      id: 'short-film',
      title: '🎭 Short Film Creator',
      description: 'Craft complete short films with AI scene planning, character development, and cinematic storytelling',
      icon: <Movie sx={{ fontSize: 40, color: 'primary.main' }} />,
      image: 'https://images.unsplash.com/photo-1489599735734-79b4dfe3b22a?w=400&h=300&fit=crop',
      path: '/home/short-film',
      category: 'Film Production',
      featured: false,
      users: '15K+',
      rating: 4.7
    },
    {
      id: 'talking-avatar',
      title: '🎭 Talking Avatar',
      description: 'Create animated avatars that speak your text with natural expressions and voice cloning',
      icon: <PlayArrow sx={{ fontSize: 40, color: 'primary.main' }} />,
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=300&fit=crop',
      path: '/home/tools/talking-avatar',
      category: 'Animation',
      featured: true,
      users: '30K+',
      rating: 4.8
    },
    {
      id: 'templates',
      title: '📚 Video Templates',
      description: 'Browse professional video templates for marketing, social media, and content creation',
      icon: <Collections sx={{ fontSize: 40, color: 'primary.main' }} />,
      image: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400&h=300&fit=crop',
      path: '/home/templates',
      category: 'Templates',
      featured: false,
      users: '40K+',
      rating: 4.8
    },
    {
      id: 'video-editor',
      title: '✂️ Video Editor',
      description: 'Professional video editing with trim, transitions, text overlays, and export options',
      icon: <Edit sx={{ fontSize: 40, color: 'primary.main' }} />,
      image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=300&fit=crop',
      path: '/home/tools/video-editor',
      category: 'Editing',
      featured: false,
      users: '20K+',
      rating: 4.6
    },
    {
      id: 'lora-list',
      title: '🤖 LoRA Models',
      description: 'Browse and use custom-trained LoRA models for specialized content generation',
      icon: <SmartToy sx={{ fontSize: 40, color: 'primary.main' }} />,
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop',
      path: '/home/tools/lora-list',
      category: 'Models',
      featured: false,
      users: '10K+',
      rating: 4.5
    }
  ];

  const featuredTools = tools.filter(tool => tool.featured);
  const allTools = tools;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        All Tools
      </Typography>

      {/* Featured Tools */}
      <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
        Featured Tools
      </Typography>
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {featuredTools.map((tool) => (
          <Grid item xs={12} sm={6} md={4} key={tool.id}>
            <Card sx={{ height: '100%', cursor: 'pointer', '&:hover': { boxShadow: 6 } }}>
              <CardMedia
                component="img"
                height="140"
                image={tool.image}
                alt={tool.title}
              />
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {tool.icon}
                  <Chip
                    label={tool.category}
                    size="small"
                    sx={{ ml: 'auto' }}
                  />
                </Box>
                <Typography variant="h6" component="h3" gutterBottom>
                  {tool.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {tool.description}
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  component={Link}
                  to={tool.path}
                >
                  Try Now
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* All Tools */}
      <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
        All Available Tools
      </Typography>
      <Grid container spacing={3}>
        {allTools.map((tool) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={tool.id}>
            <Card sx={{ height: '100%', cursor: 'pointer', '&:hover': { boxShadow: 4 } }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Box sx={{ mb: 2 }}>
                  {tool.icon}
                </Box>
                <Typography variant="h6" component="h3" gutterBottom>
                  {tool.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {tool.description}
                </Typography>
                <Chip
                  label={tool.category}
                  size="small"
                  sx={{ mb: 2 }}
                />
                <Button
                  variant="outlined"
                  fullWidth
                  component={Link}
                  to={tool.path}
                >
                  Open Tool
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default AllTools;