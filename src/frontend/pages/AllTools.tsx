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
} from '@mui/icons-material';

const AllTools: React.FC = () => {
  const tools = [
    {
      id: 'to-video',
      title: 'Text to Video',
      description: 'Transform your ideas into vibrant videos with AI',
      icon: <VideoLibrary sx={{ fontSize: 40, color: 'primary.main' }} />,
      image: 'https://static.skyreels.ai/playlet_home%2Fcover%2F27878128085602-1742383005.jpg',
      path: '/home/tools/to-video',
      category: 'Video Generation',
      featured: true
    },
    {
      id: 'lip-sync',
      title: 'Lip Sync',
      description: 'Create realistic lip-sync videos from audio',
      icon: <Mic sx={{ fontSize: 40, color: 'primary.main' }} />,
      image: 'https://static.skyreels.ai/playlet_home%2Fcover%2F27877873258262-1742367078.jpeg',
      path: '/home/tools/lip-sync',
      category: 'Audio/Video',
      featured: true
    },
    {
      id: 'text2image',
      title: 'Text to Image',
      description: 'Generate stunning images from text descriptions',
      icon: <Image sx={{ fontSize: 40, color: 'primary.main' }} />,
      image: 'https://static.skyreels.ai/playlet_home%2Fcover%2F27877873258262-1742367078.jpeg',
      path: '/home/tools/text2image',
      category: 'Image Generation',
      featured: true
    },
    {
      id: 'lora-list',
      title: 'LoRA Models',
      description: 'Browse and use custom-trained LoRA models',
      icon: <SmartToy sx={{ fontSize: 40, color: 'primary.main' }} />,
      image: 'https://static.skyreels.ai/playlet_home%2Fcover%2F27877873258262-1742367078.jpeg',
      path: '/home/tools/lora-list',
      category: 'Models',
      featured: false
    },
    {
      id: 'short-film',
      title: 'Short Film',
      description: 'Create complete short films with AI assistance',
      icon: <Movie sx={{ fontSize: 40, color: 'primary.main' }} />,
      image: 'https://static.skyreels.ai/playlet_home%2Fcover%2F27877873258262-1742367078.jpeg',
      path: '/home/short-film',
      category: 'Film Production',
      featured: false
    },
    {
      id: 'talking-avatar',
      title: 'Talking Avatar',
      description: 'Create animated avatars that speak your text',
      icon: <PlayArrow sx={{ fontSize: 40, color: 'primary.main' }} />,
      image: 'https://static.skyreels.ai/playlet_home%2Fcover%2F27877873258262-1742367078.jpeg',
      path: '/home/tools/talking-avatar',
      category: 'Animation',
      featured: false
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