import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  TextField,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  Paper,
  Chip,
  Stack,
} from '@mui/material';
import { PlayArrow, Settings, TheaterComedy } from '@mui/icons-material';

const GenerateDrama: React.FC = () => {
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('drama');
  const [duration, setDuration] = useState('30');
  const [tone, setTone] = useState('emotional');
  const [setting, setSetting] = useState('modern');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setProgress(0);
    setGeneratedVideo(null);

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
      }, 1000);

      const response = await fetch('http://localhost:8001/generate/short-film', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          genre,
          scenes: [
            {
              description: `Opening scene in a ${setting} setting with ${tone} atmosphere`,
              duration: parseInt(duration) / 3
            },
            {
              description: `Climax scene building tension in the ${genre} narrative`,
              duration: parseInt(duration) / 3
            },
            {
              description: `Resolution scene bringing emotional closure to the story`,
              duration: parseInt(duration) / 3
            }
          ]
        }),
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (response.ok) {
        const data = await response.json();
        // Poll for status
        pollStatus(data.task_id);
      }
    } catch (error) {
      console.error('Generation failed:', error);
      setIsGenerating(false);
      setProgress(0);
    }
  };

  const pollStatus = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8001/status/${id}`);
      const data = await response.json();

      setProgress(data.progress || 0);

      if (data.status === 'completed') {
        setIsGenerating(false);
        setProgress(100);
        setGeneratedVideo(data.result);
      } else if (data.status === 'failed') {
        setIsGenerating(false);
        setProgress(0);
        alert('Generation failed: ' + (data.error || 'Unknown error'));
      } else {
        // Continue polling
        setTimeout(() => pollStatus(id), 2000);
      }
    } catch (error) {
      console.error('Status check failed:', error);
      setTimeout(() => pollStatus(id), 2000);
    }
  };

  const dramaTemplates = [
    {
      title: 'Love Story',
      genre: 'romance',
      description: 'A heartfelt tale of love and connection',
      tone: 'emotional',
      setting: 'modern'
    },
    {
      title: 'Mystery Thriller',
      genre: 'thriller',
      description: 'Suspenseful story with unexpected twists',
      tone: 'tense',
      setting: 'urban'
    },
    {
      title: 'Family Drama',
      genre: 'drama',
      description: 'Emotional journey of family relationships',
      tone: 'intimate',
      setting: 'suburban'
    },
    {
      title: 'Coming of Age',
      genre: 'drama',
      description: 'Young protagonist discovering themselves',
      tone: 'reflective',
      setting: 'small town'
    }
  ];

  const applyTemplate = (template: any) => {
    setTitle(template.title);
    setGenre(template.genre);
    setTone(template.tone);
    setSetting(template.setting);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Grid container spacing={6}>
        {/* Left Panel - Generation Form */}
        <Grid item xs={12} lg={8}>
          <Paper
            sx={{
              p: 4,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              border: '1px solid',
              borderColor: 'grey.200',
            }}
          >
            <Typography variant="h4" sx={{ mb: 1, fontWeight: 800 }}>
              Generate Drama
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
              Create compelling short dramas with AI-powered storytelling
            </Typography>

            <TextField
              fullWidth
              label="Drama Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{ mb: 3 }}
              placeholder="Enter a title for your drama..."
              disabled={isGenerating}
            />

            {/* Advanced Options */}
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
              <Settings sx={{ mr: 1, fontSize: 20 }} />
              Story Settings
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel sx={{ fontWeight: 500 }}>Genre</InputLabel>
                  <Select
                    value={genre}
                    label="Genre"
                    onChange={(e) => setGenre(e.target.value)}
                    disabled={isGenerating}
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="drama">Drama</MenuItem>
                    <MenuItem value="romance">Romance</MenuItem>
                    <MenuItem value="thriller">Thriller</MenuItem>
                    <MenuItem value="comedy">Comedy</MenuItem>
                    <MenuItem value="mystery">Mystery</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel sx={{ fontWeight: 500 }}>Duration</InputLabel>
                  <Select
                    value={duration}
                    label="Duration"
                    onChange={(e) => setDuration(e.target.value)}
                    disabled={isGenerating}
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="30">30 seconds</MenuItem>
                    <MenuItem value="60">1 minute</MenuItem>
                    <MenuItem value="90">1.5 minutes</MenuItem>
                    <MenuItem value="120">2 minutes</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel sx={{ fontWeight: 500 }}>Tone</InputLabel>
                  <Select
                    value={tone}
                    label="Tone"
                    onChange={(e) => setTone(e.target.value)}
                    disabled={isGenerating}
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="emotional">Emotional</MenuItem>
                    <MenuItem value="tense">Tense</MenuItem>
                    <MenuItem value="intimate">Intimate</MenuItem>
                    <MenuItem value="reflective">Reflective</MenuItem>
                    <MenuItem value="dramatic">Dramatic</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel sx={{ fontWeight: 500 }}>Setting</InputLabel>
                  <Select
                    value={setting}
                    label="Setting"
                    onChange={(e) => setSetting(e.target.value)}
                    disabled={isGenerating}
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="modern">Modern City</MenuItem>
                    <MenuItem value="urban">Urban Environment</MenuItem>
                    <MenuItem value="suburban">Suburban</MenuItem>
                    <MenuItem value="small town">Small Town</MenuItem>
                    <MenuItem value="rural">Rural</MenuItem>
                    <MenuItem value="historical">Historical</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {isGenerating && (
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Crafting your drama...
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 600 }}>
                    {progress}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: 'grey.200',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    },
                  }}
                />
              </Box>
            )}

            <Button
              variant="contained"
              size="large"
              onClick={handleGenerate}
              disabled={!title.trim() || isGenerating}
              sx={{
                px: 6,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: 3,
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                '&:hover': {
                  boxShadow: '0 6px 16px rgba(99, 102, 241, 0.4)',
                },
                '&:disabled': {
                  backgroundColor: 'grey.300',
                  color: 'grey.500',
                },
              }}
            >
              {isGenerating ? (
                <>
                  <Box sx={{ mr: 1, width: 20, height: 20, border: '2px solid', borderColor: 'white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                  Generating Drama...
                </>
              ) : (
                'Generate Drama'
              )}
            </Button>
          </Paper>

          {/* Drama Templates */}
          <Paper sx={{ p: 4, mt: 3, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              <TheaterComedy sx={{ mr: 1, verticalAlign: 'middle' }} />
              Drama Templates
            </Typography>
            <Grid container spacing={2}>
              {dramaTemplates.map((template) => (
                <Grid item xs={12} sm={6} key={template.title}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        transition: 'transform 0.2s ease',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      },
                    }}
                    onClick={() => applyTemplate(template)}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                        {template.title}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                        {template.description}
                      </Typography>
                      <Stack direction="row" spacing={1}>
                        <Chip label={template.genre} size="small" color="primary" variant="outlined" />
                        <Chip label={template.tone} size="small" color="secondary" variant="outlined" />
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Right Panel - Preview & Tips */}
        <Grid item xs={12} lg={4}>
          <Card
            sx={{
              mb: 3,
              borderRadius: 3,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              border: '1px solid',
              borderColor: 'grey.200',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                🎭 Drama Preview
              </Typography>
              <Box
                sx={{
                  width: '100%',
                  height: 250,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                  border: '2px dashed',
                  borderColor: 'grey.300',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {generatedVideo ? (
                  <video
                    controls
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '8px'
                    }}
                    src={`http://localhost:8000${generatedVideo}`}
                  />
                ) : (
                  <>
                    <TheaterComedy sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                    <Typography variant="body1" sx={{ color: 'text.secondary', textAlign: 'center' }}>
                      {isGenerating ? 'Writing your drama...' : 'Your drama will appear here'}
                    </Typography>
                  </>
                )}
              </Box>
              {generatedVideo && (
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{ borderRadius: 2 }}
                  onClick={() => window.open(`http://localhost:8000${generatedVideo}`, '_blank')}
                >
                  Download Drama
                </Button>
              )}
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                🎬 Drama Writing Tips
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ color: 'primary.main', mr: 2, mt: 0.5 }}>•</Box>
                <Typography variant="body2">
                  <strong>Strong Title:</strong> Choose a compelling title that captures the emotional core
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ color: 'primary.main', mr: 2, mt: 0.5 }}>•</Box>
                <Typography variant="body2">
                  <strong>Genre Matters:</strong> Different genres create different emotional responses
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ color: 'primary.main', mr: 2, mt: 0.5 }}>•</Box>
                <Typography variant="body2">
                  <strong>Tone Setting:</strong> The tone determines the emotional atmosphere of your story
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ color: 'primary.main', mr: 2, mt: 0.5 }}>•</Box>
                <Typography variant="body2">
                  <strong>Setting Influence:</strong> The environment shapes character behavior and mood
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default GenerateDrama;