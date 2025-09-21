import React, { useState } from 'react';
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
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Search,
  FilterList,
  MoreVert,
  PlayArrow,
  Download,
  Share,
  Delete,
  Add,
} from '@mui/icons-material';

const Dashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [videos, setVideos] = useState([
    {
      id: 1,
      title: 'Majestic Eagle Soaring',
      thumbnail: '/placeholder.jpg',
      status: 'completed',
      duration: '5s',
      createdAt: '2024-01-15',
      prompt: 'A majestic eagle soaring through mountain peaks'
    },
    {
      id: 2,
      title: 'Urban Cityscape',
      thumbnail: '/placeholder.jpg',
      status: 'completed',
      duration: '10s',
      createdAt: '2024-01-14',
      prompt: 'Urban cityscape at night with neon lights'
    },
    {
      id: 3,
      title: 'Butterfly Transformation',
      thumbnail: '/placeholder.jpg',
      status: 'processing',
      duration: '8s',
      createdAt: '2024-01-13',
      prompt: 'Butterfly emerging from chrysalis'
    },
  ]);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, videoId: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedVideo(videoId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedVideo(null);
  };

  const handleDelete = (videoId: number) => {
    setVideos(videos.filter(v => v.id !== videoId));
    handleMenuClose();
  };

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.prompt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || video.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          My Library
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          component={Link}
          to="/to-video"
          size="large"
        >
          Create Video
        </Button>
      </Box>

      {/* Search and Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search videos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 300, flexGrow: 1 }}
        />
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip
            label="All"
            onClick={() => setFilter('all')}
            variant={filter === 'all' ? 'filled' : 'outlined'}
          />
          <Chip
            label="Completed"
            onClick={() => setFilter('completed')}
            variant={filter === 'completed' ? 'filled' : 'outlined'}
          />
          <Chip
            label="Processing"
            onClick={() => setFilter('processing')}
            variant={filter === 'processing' ? 'filled' : 'outlined'}
          />
        </Box>
      </Box>

      {/* Video Grid */}
      <Grid container spacing={3}>
        {filteredVideos.map((video) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={video.id}>
            <Card sx={{ height: '100%', position: 'relative' }}>
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={video.thumbnail}
                  alt={video.title}
                  sx={{ cursor: 'pointer' }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'rgba(0,0,0,0.5)',
                    borderRadius: '50%',
                    p: 1,
                  }}
                >
                  <PlayArrow sx={{ color: 'white', fontSize: 40 }} />
                </Box>
                <Chip
                  label={video.status}
                  color={video.status === 'completed' ? 'success' : 'warning'}
                  size="small"
                  sx={{ position: 'absolute', top: 8, right: 8 }}
                />
                <IconButton
                  sx={{ position: 'absolute', top: 8, left: 8, bgcolor: 'rgba(255,255,255,0.8)' }}
                  size="small"
                  onClick={(e) => handleMenuClick(e, video.id)}
                >
                  <MoreVert />
                </IconButton>
              </Box>
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom noWrap>
                  {video.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {video.duration} • {video.createdAt}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {video.prompt}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Menu for video actions */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          <PlayArrow sx={{ mr: 1 }} />
          Play
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Download sx={{ mr: 1 }} />
          Download
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Share sx={{ mr: 1 }} />
          Share
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          <Delete sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {filteredVideos.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No videos found
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Try adjusting your search or create your first video
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Dashboard;