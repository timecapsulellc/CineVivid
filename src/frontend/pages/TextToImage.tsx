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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  Paper,
  Chip,
  Slider,
} from '@mui/material';
import { Image, Palette, AspectRatio } from '@mui/icons-material';

const TextToImage: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [style, setStyle] = useState('realistic');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [quality, setQuality] = useState(70);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      const response = await fetch('/generate/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          negative_prompt: negativePrompt,
          style,
          aspect_ratio: aspectRatio,
          quality
        }),
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (response.ok) {
        const result = await response.json();
        // In production, get images from result
        setGeneratedImages([
          'https://static.skyreels.ai/playlet_home%2Fcover%2F27877873258262-1742367078.jpeg',
          'https://static.skyreels.ai/playlet_home%2Fcover%2F27878128085602-1742383005.jpg',
          'https://static.skyreels.ai/playlet_home%2Fcover%2F27877873258262-1742367078.jpeg',
          'https://static.skyreels.ai/playlet_home%2Fcover%2F27878128085602-1742383005.jpg'
        ]);
      }

      setTimeout(() => {
        setIsGenerating(false);
        setProgress(0);
      }, 1000);

    } catch (error) {
      console.error('Image generation failed:', error);
      setIsGenerating(false);
      setProgress(0);
    }
  };

  const stylePresets = [
    'A serene lake reflecting snow-capped mountains at sunset',
    'A futuristic city with flying cars and neon lights',
    'A mystical forest with glowing mushrooms and fairies',
    'A steampunk workshop with intricate machinery',
    'An underwater scene with colorful coral reefs'
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Text to Image
      </Typography>

      <Grid container spacing={4}>
        {/* Left Panel - Generation Form */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Describe your image
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="A majestic eagle soaring through dramatic mountain peaks at sunset, wings spread wide against a vibrant orange sky..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              sx={{ mb: 3 }}
              disabled={isGenerating}
            />

            <Typography variant="h6" gutterBottom>
              Negative Prompt (Optional)
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={2}
              placeholder="Blurry, low quality, distorted, ugly..."
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              sx={{ mb: 3 }}
              disabled={isGenerating}
            />

            {/* Advanced Options */}
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              <Palette sx={{ mr: 1, verticalAlign: 'middle' }} />
              Advanced Options
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Style</InputLabel>
                  <Select
                    value={style}
                    label="Style"
                    onChange={(e) => setStyle(e.target.value)}
                    disabled={isGenerating}
                  >
                    <MenuItem value="realistic">Realistic</MenuItem>
                    <MenuItem value="artistic">Artistic</MenuItem>
                    <MenuItem value="anime">Anime</MenuItem>
                    <MenuItem value="abstract">Abstract</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Aspect Ratio</InputLabel>
                  <Select
                    value={aspectRatio}
                    label="Aspect Ratio"
                    onChange={(e) => setAspectRatio(e.target.value)}
                    disabled={isGenerating}
                  >
                    <MenuItem value="1:1">1:1 (Square)</MenuItem>
                    <MenuItem value="16:9">16:9 (Landscape)</MenuItem>
                    <MenuItem value="9:16">9:16 (Portrait)</MenuItem>
                    <MenuItem value="4:3">4:3 (Classic)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography gutterBottom>Quality: {quality}%</Typography>
                <Slider
                  value={quality}
                  onChange={(_, newValue) => setQuality(newValue as number)}
                  disabled={isGenerating}
                  min={30}
                  max={100}
                  step={10}
                />
              </Grid>
            </Grid>

            {isGenerating && (
              <Box sx={{ mb: 3 }}>
                <LinearProgress variant="determinate" value={progress} />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Generating your image... {progress}%
                </Typography>
              </Box>
            )}

            <Button
              variant="contained"
              size="large"
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              sx={{ minWidth: 200 }}
            >
              {isGenerating ? 'Generating...' : 'Generate Image'}
            </Button>
          </Paper>

          {/* Style Presets */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Style Presets
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {stylePresets.map((preset) => (
                <Chip
                  key={preset}
                  label={preset.length > 30 ? preset.substring(0, 30) + '...' : preset}
                  onClick={() => setPrompt(preset)}
                  variant="outlined"
                  sx={{ cursor: 'pointer' }}
                />
              ))}
            </Box>
          </Paper>

          {/* Generated Images */}
          {generatedImages.length > 0 && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Generated Images
              </Typography>
              <Grid container spacing={2}>
                {generatedImages.map((image, index) => (
                  <Grid item xs={6} sm={3} key={index}>
                    <Card>
                      <CardMedia
                        component="img"
                        height="120"
                        image={image}
                        alt={`Generated ${index + 1}`}
                      />
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          )}
        </Grid>

        {/* Right Panel - Preview and Tips */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Image sx={{ mr: 1, verticalAlign: 'middle' }} />
                Preview
              </Typography>
              <Box
                sx={{
                  width: '100%',
                  height: 200,
                  bgcolor: 'grey.200',
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2
                }}
              >
                <Image sx={{ fontSize: 48, color: 'grey.500' }} />
              </Box>
              <Typography variant="body2" color="text.secondary">
                Your generated image will appear here
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Image Tips
              </Typography>
              <Typography variant="body2" paragraph>
                • Be specific about subjects, lighting, and composition
              </Typography>
              <Typography variant="body2" paragraph>
                • Use descriptive adjectives (majestic, vibrant, dramatic)
              </Typography>
              <Typography variant="body2" paragraph>
                • Mention art styles or artists for specific aesthetics
              </Typography>
              <Typography variant="body2">
                • Use negative prompts to avoid unwanted elements
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <AspectRatio sx={{ mr: 1, verticalAlign: 'middle' }} />
                Aspect Ratios
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Chip label="1:1 - Square (Instagram)" size="small" variant="outlined" />
                <Chip label="16:9 - Landscape (YouTube)" size="small" variant="outlined" />
                <Chip label="9:16 - Portrait (Stories)" size="small" variant="outlined" />
                <Chip label="4:3 - Classic (Print)" size="small" variant="outlined" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TextToImage;