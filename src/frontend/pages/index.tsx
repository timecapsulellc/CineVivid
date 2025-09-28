import React, { useState } from 'react';
import {
  Box, Button, Container, Typography, Grid, Card, CardContent,
  TextField, LinearProgress, Paper, Chip, Avatar, Stack
} from '@mui/material';
import { PlayArrow, Star, CheckCircle, VideoLibrary, Image, Mic, Movie } from '@mui/icons-material';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setProgress(0);

    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  return (
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
      </Box>

      {/* Generation Form */}
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Create Your Video
        </Typography>

        <TextField
          fullWidth
          multiline
          rows={4}
          label="Describe your video"
          placeholder="A majestic eagle soaring through mountain peaks at sunset..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          sx={{ mb: 3 }}
          disabled={isGenerating}
        />

        {isGenerating && (
          <Box mb={3}>
            <LinearProgress variant="determinate" value={progress} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Generating your video... {progress}%
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
          {isGenerating ? 'Generating...' : 'Generate Video'}
        </Button>
      </Paper>

      {/* Features Grid */}
      <Typography variant="h4" textAlign="center" mb={4}>
        Powerful AI Tools
      </Typography>

      <Grid container spacing={3} mb={6}>
        {[
          { icon: <VideoLibrary />, title: 'Text to Video', desc: 'Transform text into cinematic videos' },
          { icon: <Image />, title: 'Image to Video', desc: 'Animate static images with motion' },
          { icon: <Mic />, title: 'AI Voiceover', desc: 'Natural speech synthesis' },
          { icon: <Movie />, title: 'Video Editing', desc: 'Trim, effects, and enhancements' }
        ].map((feature, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
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
    </Container>
  );
}