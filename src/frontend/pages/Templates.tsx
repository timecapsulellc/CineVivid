import React, { useState } from 'react';
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
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Search,
  PlayArrow,
  Favorite,
  FavoriteBorder,
  Share,
  Bookmark,
  BookmarkBorder,
} from '@mui/icons-material';

interface Template {
  id: string;
  title: string;
  description: string;
  prompt: string;
  category: string;
  tags: string[];
  thumbnail: string;
  duration: string;
  aspectRatio: string;
  style: string;
  likes: number;
  isLiked: boolean;
  isBookmarked: boolean;
  author: string;
  createdAt: string;
}

const Templates: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const categories = [
    { id: 'all', label: 'All Templates', count: 48 },
    { id: 'social', label: 'Social Media', count: 12 },
    { id: 'marketing', label: 'Marketing', count: 8 },
    { id: 'education', label: 'Education', count: 6 },
    { id: 'entertainment', label: 'Entertainment', count: 10 },
    { id: 'business', label: 'Business', count: 7 },
    { id: 'personal', label: 'Personal', count: 5 },
  ];

  const [templates, setTemplates] = useState<Template[]>([
    {
      id: '1',
      title: 'Product Launch Trailer',
      description: 'Dramatic product launch with cinematic effects',
      prompt: 'A sleek smartphone floating in mid-air with glowing particles, dramatic lighting, slow motion reveal of features, professional product photography style',
      category: 'marketing',
      tags: ['product', 'launch', 'technology', 'cinematic'],
      thumbnail: 'https://static.skyreels.ai/playlet_home%2Fcover%2F27878128085602-1742383005.jpg',
      duration: '15s',
      aspectRatio: '16:9',
      style: 'cinematic',
      likes: 245,
      isLiked: false,
      isBookmarked: false,
      author: 'MarketingPro',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      title: 'Travel Vlog Opener',
      description: 'Energetic travel content introduction',
      prompt: 'A backpacker hiking through misty mountains at sunrise, vibrant colors, adventurous music, dynamic camera movements, travel vlog style',
      category: 'personal',
      tags: ['travel', 'adventure', 'nature', 'vlog'],
      thumbnail: 'https://static.skyreels.ai/playlet_home%2Fcover%2F27877873258262-1742367078.jpeg',
      duration: '10s',
      aspectRatio: '9:16',
      style: 'vibrant',
      likes: 189,
      isLiked: false,
      isBookmarked: false,
      author: 'TravelCreator',
      createdAt: '2024-01-14'
    },
    {
      id: '3',
      title: 'Educational Explainer',
      description: 'Clear and engaging science explanation',
      prompt: 'Animated DNA strand rotating with colorful molecules, scientific visualization, educational style, clear explanations, professional narration',
      category: 'education',
      tags: ['science', 'education', 'animation', 'explanation'],
      thumbnail: 'https://static.skyreels.ai/playlet_home%2Fcover%2F27878128085602-1742383005.jpg',
      duration: '30s',
      aspectRatio: '16:9',
      style: 'educational',
      likes: 156,
      isLiked: false,
      isBookmarked: false,
      author: 'ScienceTeacher',
      createdAt: '2024-01-13'
    },
    {
      id: '4',
      title: 'Social Media Story',
      description: 'Engaging vertical video for stories',
      prompt: 'A person dancing in a vibrant city street at night, neon lights reflecting, energetic music, vertical format, social media style',
      category: 'social',
      tags: ['dance', 'city', 'night', 'social'],
      thumbnail: 'https://static.skyreels.ai/playlet_home%2Fcover%2F27877873258262-1742367078.jpeg',
      duration: '15s',
      aspectRatio: '9:16',
      style: 'vibrant',
      likes: 312,
      isLiked: false,
      isBookmarked: false,
      author: 'DanceCreator',
      createdAt: '2024-01-12'
    },
    {
      id: '5',
      title: 'Business Presentation',
      description: 'Professional corporate video',
      prompt: 'Modern office with glass walls, professional team meeting, clean aesthetics, corporate style, business presentation format',
      category: 'business',
      tags: ['business', 'corporate', 'professional', 'meeting'],
      thumbnail: 'https://static.skyreels.ai/playlet_home%2Fcover%2F27878128085602-1742383005.jpg',
      duration: '20s',
      aspectRatio: '16:9',
      style: 'professional',
      likes: 98,
      isLiked: false,
      isBookmarked: false,
      author: 'BizPresenter',
      createdAt: '2024-01-11'
    },
    {
      id: '6',
      title: 'Movie Trailer Style',
      description: 'Cinematic blockbuster trailer',
      prompt: 'Epic battle scene with heroes and villains, dramatic slow motion, intense lighting, Hollywood blockbuster style, cinematic camera work',
      category: 'entertainment',
      tags: ['movie', 'action', 'cinematic', 'trailer'],
      thumbnail: 'https://static.skyreels.ai/playlet_home%2Fcover%2F27877873258262-1742367078.jpeg',
      duration: '30s',
      aspectRatio: '2.35:1',
      style: 'cinematic',
      likes: 423,
      isLiked: false,
      isBookmarked: false,
      author: 'FilmDirector',
      createdAt: '2024-01-10'
    }
  ]);

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleLike = (templateId: string) => {
    setTemplates(templates.map(template =>
      template.id === templateId
        ? {
            ...template,
            isLiked: !template.isLiked,
            likes: template.isLiked ? template.likes - 1 : template.likes + 1
          }
        : template
    ));
  };

  const handleBookmark = (templateId: string) => {
    setTemplates(templates.map(template =>
      template.id === templateId
        ? { ...template, isBookmarked: !template.isBookmarked }
        : template
    ));
  };

  const handleUseTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setDialogOpen(true);
  };

  const handleGenerateFromTemplate = () => {
    if (selectedTemplate) {
      // Navigate to appropriate tool with pre-filled prompt
      const toolPath = selectedTemplate.category === 'social' || selectedTemplate.category === 'personal'
        ? '/home/tools/to-video'
        : '/home/tools/to-video';

      // In a real app, you'd pass the template data via state or localStorage
      window.location.href = toolPath;
    }
    setDialogOpen(false);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Video Templates
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Choose from professionally designed templates to create stunning videos instantly
      </Typography>

      {/* Search */}
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          placeholder="Search templates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: 400 }}
        />
      </Box>

      {/* Category Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs
          value={selectedCategory}
          onChange={(_, newValue) => setSelectedCategory(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          {categories.map((category) => (
            <Tab
              key={category.id}
              label={`${category.label} (${category.count})`}
              value={category.id}
            />
          ))}
        </Tabs>
      </Box>

      {/* Templates Grid */}
      <Grid container spacing={3}>
        {filteredTemplates.map((template) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={template.id}>
            <Card sx={{ height: '100%', position: 'relative' }}>
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="180"
                  image={template.thumbnail}
                  alt={template.title}
                  sx={{ cursor: 'pointer' }}
                  onClick={() => handleUseTemplate(template)}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    display: 'flex',
                    gap: 1
                  }}
                >
                  <IconButton
                    size="small"
                    sx={{ bgcolor: 'rgba(255,255,255,0.8)' }}
                    onClick={() => handleLike(template.id)}
                  >
                    {template.isLiked ? <Favorite color="error" /> : <FavoriteBorder />}
                  </IconButton>
                  <IconButton
                    size="small"
                    sx={{ bgcolor: 'rgba(255,255,255,0.8)' }}
                    onClick={() => handleBookmark(template.id)}
                  >
                    {template.isBookmarked ? <Bookmark color="primary" /> : <BookmarkBorder />}
                  </IconButton>
                </Box>
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 8,
                    left: 8,
                    right: 8,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <Chip
                    label={template.duration}
                    size="small"
                    sx={{ bgcolor: 'rgba(0,0,0,0.7)', color: 'white' }}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Favorite sx={{ fontSize: 14, color: 'white' }} />
                    <Typography variant="caption" sx={{ color: 'white' }}>
                      {template.likes}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom noWrap>
                  {template.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, height: 40, overflow: 'hidden' }}>
                  {template.description}
                </Typography>

                <Box sx={{ display: 'flex', gap: 0.5, mb: 2, flexWrap: 'wrap' }}>
                  {template.tags.slice(0, 3).map((tag) => (
                    <Chip key={tag} label={tag} size="small" variant="outlined" />
                  ))}
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleUseTemplate(template)}
                    sx={{ flex: 1 }}
                  >
                    Use Template
                  </Button>
                  <IconButton size="small">
                    <Share />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredTemplates.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No templates found
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Try adjusting your search or category filter
          </Typography>
        </Box>
      )}

      {/* Template Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedTemplate?.title}
        </DialogTitle>
        <DialogContent>
          {selectedTemplate && (
            <Box>
              <Typography variant="body1" paragraph>
                {selectedTemplate.description}
              </Typography>

              <Typography variant="h6" gutterBottom>
                Template Details
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6} sm={3}>
                  <Typography variant="body2" color="text.secondary">Duration</Typography>
                  <Typography variant="body1">{selectedTemplate.duration}</Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="body2" color="text.secondary">Aspect Ratio</Typography>
                  <Typography variant="body1">{selectedTemplate.aspectRatio}</Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="body2" color="text.secondary">Style</Typography>
                  <Typography variant="body1">{selectedTemplate.style}</Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="body2" color="text.secondary">Category</Typography>
                  <Typography variant="body1">{selectedTemplate.category}</Typography>
                </Grid>
              </Grid>

              <Typography variant="h6" gutterBottom>
                Generated Prompt
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                value={selectedTemplate.prompt}
                InputProps={{ readOnly: true }}
                sx={{ mb: 2 }}
              />

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {selectedTemplate.tags.map((tag) => (
                  <Chip key={tag} label={tag} size="small" />
                ))}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleGenerateFromTemplate}>
            Generate Video
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Templates;