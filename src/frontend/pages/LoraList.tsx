import React, { useState } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
} from '@mui/material';
import {
  Search,
  Download,
  Favorite,
  FavoriteBorder,
  Info,
  SmartToy,
} from '@mui/icons-material';

const LoraList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLora, setSelectedLora] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loraModels, setLoraModels] = useState([]);

  // Fetch LoRA models on component mount
  React.useEffect(() => {
    const fetchLoraModels = async () => {
      try {
        const response = await fetch('/lora-models');
        if (response.ok) {
          const data = await response.json();
          setLoraModels(data.models);
        } else {
          // Fallback to mock data if API fails
          setLoraModels([
    {
      id: 1,
      name: 'Realistic Portrait v2.1',
      description: 'High-quality realistic portrait generation with natural lighting',
      category: 'portraits',
      author: 'SkyReels Team',
      downloads: 15420,
      rating: 4.8,
      image: 'https://static.skyreels.ai/playlet_home%2Fcover%2F27877873258262-1742367078.jpeg',
      tags: ['realistic', 'portrait', 'photography'],
      baseModel: 'SDXL 1.0',
      triggerWords: 'photorealistic, detailed face, natural lighting'
    },
    {
      id: 2,
      name: 'Anime Style Pro',
      description: 'Professional anime and manga style character generation',
      category: 'anime',
      author: 'AnimeMaster',
      downloads: 8920,
      rating: 4.6,
      image: 'https://static.skyreels.ai/playlet_home%2Fcover%2F27878128085602-1742383005.jpg',
      tags: ['anime', 'manga', 'characters'],
      baseModel: 'SDXL 1.0',
      triggerWords: 'anime style, detailed eyes, vibrant colors'
    },
    {
      id: 3,
      name: 'Cyberpunk Cityscape',
      description: 'Futuristic cyberpunk urban environments and architecture',
      category: 'scenery',
      author: 'FutureVision',
      downloads: 6730,
      rating: 4.7,
      image: 'https://static.skyreels.ai/playlet_home%2Fcover%2F27877873258262-1742367078.jpeg',
      tags: ['cyberpunk', 'city', 'futuristic'],
      baseModel: 'SDXL 1.0',
      triggerWords: 'cyberpunk, neon lights, urban decay'
    },
    {
      id: 4,
      name: 'Fantasy Creatures',
      description: 'Magical fantasy creatures, dragons, unicorns, and mythical beings',
      category: 'fantasy',
      author: 'MythicalArts',
      downloads: 12450,
      rating: 4.9,
      image: 'https://static.skyreels.ai/playlet_home%2Fcover%2F27878128085602-1742383005.jpg',
      tags: ['fantasy', 'creatures', 'magic'],
      baseModel: 'SDXL 1.0',
      triggerWords: 'fantasy creature, magical, detailed scales'
    },
    {
      id: 5,
      name: 'Abstract Art Generator',
      description: 'Create stunning abstract art pieces with fluid dynamics',
      category: 'art',
      author: 'AbstractMind',
      downloads: 3450,
      rating: 4.3,
      image: 'https://static.skyreels.ai/playlet_home%2Fcover%2F27877873258262-1742367078.jpeg',
      tags: ['abstract', 'art', 'fluid'],
      baseModel: 'SDXL 1.0',
      triggerWords: 'abstract art, fluid dynamics, vibrant colors'
    },
    {
      id: 6,
      name: 'Product Photography',
      description: 'Professional product photography with perfect lighting',
      category: 'commercial',
      author: 'ProPhoto',
      downloads: 9870,
      rating: 4.5,
      image: 'https://static.skyreels.ai/playlet_home%2Fcover%2F27878128085602-1742383005.jpg',
      tags: ['product', 'commercial', 'photography'],
      baseModel: 'SDXL 1.0',
      triggerWords: 'product photography, professional lighting, clean background'
    }
  ];

  const categories = [
    { value: 'all', label: 'All Models' },
    { value: 'portraits', label: 'Portraits' },
    { value: 'anime', label: 'Anime' },
    { value: 'scenery', label: 'Scenery' },
    { value: 'fantasy', label: 'Fantasy' },
    { value: 'art', label: 'Art' },
    { value: 'commercial', label: 'Commercial' }
  ];

  const filteredModels = loraModels.filter(model => {
    const matchesSearch = model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         model.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         model.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || model.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleModelClick = (model: any) => {
    setSelectedLora(model);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedLora(null);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        <SmartToy sx={{ mr: 2, verticalAlign: 'middle' }} />
        LoRA Models
      </Typography>

      {/* Search and Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search LoRA models..."
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
          {categories.map((category) => (
            <Chip
              key={category.value}
              label={category.label}
              onClick={() => setSelectedCategory(category.value)}
              variant={selectedCategory === category.value ? 'filled' : 'outlined'}
            />
          ))}
        </Box>
      </Box>

      {/* Models Grid */}
      <Grid container spacing={3}>
        {filteredModels.map((model) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={model.id}>
            <Card sx={{ height: '100%', cursor: 'pointer', '&:hover': { boxShadow: 6 } }}>
              <CardMedia
                component="img"
                height="200"
                image={model.image}
                alt={model.name}
                onClick={() => handleModelClick(model)}
              />
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom noWrap>
                  {model.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, height: 40, overflow: 'hidden' }}>
                  {model.description}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Rating value={model.rating} readOnly size="small" sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    {model.rating}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    {model.downloads.toLocaleString()} downloads
                  </Typography>
                  <Chip label={model.category} size="small" variant="outlined" />
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<Download />}
                    fullWidth
                  >
                    Download
                  </Button>
                  <IconButton size="small">
                    <FavoriteBorder />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleModelClick(model)}>
                    <Info />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Model Detail Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        {selectedLora && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <SmartToy />
                {selectedLora.name}
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <CardMedia
                    component="img"
                    height="300"
                    image={selectedLora.image}
                    alt={selectedLora.name}
                    sx={{ borderRadius: 1 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Description
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {selectedLora.description}
                  </Typography>

                  <Typography variant="h6" gutterBottom>
                    Details
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      <strong>Author:</strong> {selectedLora.author}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Base Model:</strong> {selectedLora.baseModel}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Downloads:</strong> {selectedLora.downloads.toLocaleString()}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Rating:</strong> {selectedLora.rating}/5
                    </Typography>
                  </Box>

                  <Typography variant="h6" gutterBottom>
                    Trigger Words
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', bgcolor: 'grey.100', p: 1, borderRadius: 1 }}>
                    {selectedLora.triggerWords}
                  </Typography>

                  <Box sx={{ mt: 2 }}>
                    {selectedLora.tags.map((tag: string) => (
                      <Chip key={tag} label={tag} size="small" sx={{ mr: 1, mb: 1 }} />
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
              <Button variant="contained" startIcon={<Download />}>
                Download LoRA
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {filteredModels.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No LoRA models found
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Try adjusting your search or category filter
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default LoraList;