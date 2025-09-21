import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home,
  VideoLibrary,
  Settings,
  KeyboardArrowDown,
  PlayArrow,
} from '@mui/icons-material';

const Landing: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleToolsMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const toolsItems = [
    { text: 'All Tools', path: '/home/tools/all' },
    { text: 'Generate Video', path: '/home/tools/to-video' },
    { text: 'Talking Avatar', path: '/home/tools/talking-avatar' },
    { text: 'Generate Image', path: '/home/tools/text2image' },
    { text: 'Lip Sync', path: '/home/tools/lip-sync' },
    { text: 'LoRA Models', path: '/home/tools/lora-list' },
    { text: 'Short Film', path: '/home/short-film' },
    { text: 'Train Model', path: '/home/tools/train-model' },
    { text: 'Generate Drama', path: '/home/tools/generate-drama' }
  ];

  const recentCreations = [
    {
      id: 1,
      title: '電話ボックス',
      thumbnail: 'https://static.skyreels.ai/playlet-test%2Fplaylet%2F1966410988114321408.jpeg',
      duration: '00:58'
    },
    {
      id: 2,
      title: 'Fairy\'s Fantasy Forest',
      thumbnail: 'https://static.skyreels.ai/playlet_home%2Fcover%2F27878128085602-1742383005.jpg',
      duration: '00:28'
    },
    {
      id: 3,
      title: 'Japanese anime style battlefield',
      thumbnail: 'https://static.skyreels.ai/playlet_home%2Fcover%2F27877873258262-1742367078.jpeg',
      duration: '00:05'
    }
  ];

  return (
    <Box>
      {/* Navigation Header */}
      <AppBar position="static" sx={{ backgroundColor: 'white', color: 'black', boxShadow: 1 }}>
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mr: 4 }}>
                CineVivid｜Visualize Your Story
              </Typography>
              <Box sx={{ display: 'flex', gap: 3 }}>
                <Button color="inherit" component={Link} to="/">
                  <Home sx={{ mr: 1 }} />
                  Home
                </Button>
                <Button color="inherit" component={Link} to="/home/my-library">
                  <VideoLibrary sx={{ mr: 1 }} />
                  Library
                </Button>
                <Button
                  color="inherit"
                  onClick={handleToolsMenu}
                  endIcon={<KeyboardArrowDown />}
                >
                  TOOLS
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  {toolsItems.map((item) => (
                    <MenuItem key={item.text} onClick={handleClose} component={Link} to={item.path}>
                      {item.text}
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button variant="outlined" component={Link} to="/home/tools/to-video">
                Generate Video
              </Button>
              <Button variant="outlined">
                Talking Avatar
              </Button>
              <Button variant="contained" component={Link} to="/home/tools/to-video">
                Create
              </Button>
              <Button color="inherit">Login</Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Hero Section */}
      <Box sx={{ backgroundColor: '#f8f9fa', py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                AI Video
              </Typography>
              <Typography variant="h5" component="p" sx={{ mb: 4, color: 'text.secondary' }}>
                Transform ideas into vibrant videos
              </Typography>
              <Button
                variant="contained"
                size="large"
                component={Link}
                to="/home/tools/to-video"
                sx={{ mr: 2, px: 4, py: 1.5 }}
              >
                Create
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: 'center' }}>
                <PlayArrow sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6">Explore AI video magic</Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* AI Drama Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                AI Drama
              </Typography>
              <Typography variant="h5" component="p" sx={{ mb: 4, color: 'text.secondary' }}>
                Craft short dramas from script to screen
              </Typography>
              <Button
                variant="contained"
                size="large"
                sx={{ px: 4, py: 1.5 }}
              >
                Create
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: 'center' }}>
                <PlayArrow sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6">Master AI drama production</Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Recent Creations */}
      <Box sx={{ backgroundColor: '#f8f9fa', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
            Recent Creations
          </Typography>
          <Button
            variant="contained"
            size="large"
            component={Link}
            to="/home/tools/to-video"
            sx={{ display: 'block', mx: 'auto', mb: 4, px: 4, py: 1.5 }}
          >
            Create
          </Button>

          <Grid container spacing={3}>
            {recentCreations.map((video) => (
              <Grid item xs={12} sm={6} md={4} key={video.id}>
                <Card sx={{ height: '100%' }}>
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={video.thumbnail}
                      alt={video.title}
                    />
                    <Chip
                      label={video.duration}
                      size="small"
                      sx={{
                        position: 'absolute',
                        bottom: 8,
                        right: 8,
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        color: 'white'
                      }}
                    />
                  </Box>
                  <CardContent>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {video.title}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                      <Button size="small" variant="outlined">
                        Copy Prompt
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        component={Link}
                        to="/home/tools/to-video"
                      >
                        Go Create
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Footer/Login Section */}
      <Box sx={{ backgroundColor: '#1a1a1a', color: 'white', py: 8 }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Get exclusive first access to our all-new CineVivid
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.8 }}>
            join the waiting list now to be among the first to try it.
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{ px: 4, py: 1.5, mr: 2 }}
          >
            View
          </Button>
          <Typography variant="body1" sx={{ mt: 2 }}>
            0 | Login to Get Free Credits
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Landing;