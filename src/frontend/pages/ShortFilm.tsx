import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  Paper,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
} from '@mui/material';
import {
  Movie,
  Add,
  Delete,
  ExpandMore,
  PlayArrow,
  Save,
  Share,
} from '@mui/icons-material';

interface Scene {
  id: number;
  title: string;
  description: string;
  duration: number;
  style: string;
}

const ShortFilm: React.FC = () => {
  const [filmTitle, setFilmTitle] = useState('');
  const [filmGenre, setFilmGenre] = useState('drama');
  const [scenes, setScenes] = useState<Scene[]>([
    {
      id: 1,
      title: 'Opening Scene',
      description: 'Establish the main character and setting',
      duration: 30,
      style: 'cinematic'
    }
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const addScene = () => {
    const newScene: Scene = {
      id: scenes.length + 1,
      title: `Scene ${scenes.length + 1}`,
      description: '',
      duration: 30,
      style: 'cinematic'
    };
    setScenes([...scenes, newScene]);
  };

  const updateScene = (id: number, field: keyof Scene, value: any) => {
    setScenes(scenes.map(scene =>
      scene.id === id ? { ...scene, [field]: value } : scene
    ));
  };

  const deleteScene = (id: number) => {
    setScenes(scenes.filter(scene => scene.id !== id));
  };

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
          return prev + 5;
        });
      }, 300);

      const response = await fetch('/generate/short-film', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: filmTitle,
          genre: filmGenre,
          scenes: scenes
        }),
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (response.ok) {
        // Handle success
        setTimeout(() => {
          setIsGenerating(false);
          setProgress(0);
        }, 1000);
      }

    } catch (error) {
      console.error('Film generation failed:', error);
      setIsGenerating(false);
      setProgress(0);
    }
  };

  const totalDuration = scenes.reduce((sum, scene) => sum + scene.duration, 0);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        <Movie sx={{ mr: 2, verticalAlign: 'middle' }} />
        Short Film Creator
      </Typography>

      <Grid container spacing={4}>
        {/* Left Panel - Film Setup */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Film Details
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={8}>
                <TextField
                  fullWidth
                  label="Film Title"
                  value={filmTitle}
                  onChange={(e) => setFilmTitle(e.target.value)}
                  placeholder="Enter your film title..."
                  disabled={isGenerating}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Genre</InputLabel>
                  <Select
                    value={filmGenre}
                    label="Genre"
                    onChange={(e) => setFilmGenre(e.target.value)}
                    disabled={isGenerating}
                  >
                    <MenuItem value="drama">Drama</MenuItem>
                    <MenuItem value="comedy">Comedy</MenuItem>
                    <MenuItem value="thriller">Thriller</MenuItem>
                    <MenuItem value="romance">Romance</MenuItem>
                    <MenuItem value="action">Action</MenuItem>
                    <MenuItem value="horror">Horror</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Scenes ({scenes.length}) - Total: {Math.floor(totalDuration / 60)}:{(totalDuration % 60).toString().padStart(2, '0')}
              </Typography>
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={addScene}
                disabled={isGenerating}
              >
                Add Scene
              </Button>
            </Box>

            {/* Scenes */}
            {scenes.map((scene, index) => (
              <Accordion key={scene.id} sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                    <Typography variant="h6">
                      Scene {index + 1}: {scene.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip label={`${scene.duration}s`} size="small" />
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteScene(scene.id);
                        }}
                        disabled={isGenerating}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Scene Title"
                        value={scene.title}
                        onChange={(e) => updateScene(scene.id, 'title', e.target.value)}
                        disabled={isGenerating}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Scene Description"
                        value={scene.description}
                        onChange={(e) => updateScene(scene.id, 'description', e.target.value)}
                        placeholder="Describe what happens in this scene..."
                        disabled={isGenerating}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Duration (seconds)"
                        value={scene.duration}
                        onChange={(e) => updateScene(scene.id, 'duration', parseInt(e.target.value) || 30)}
                        disabled={isGenerating}
                        inputProps={{ min: 10, max: 120 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Visual Style</InputLabel>
                        <Select
                          value={scene.style}
                          label="Visual Style"
                          onChange={(e) => updateScene(scene.id, 'style', e.target.value)}
                          disabled={isGenerating}
                        >
                          <MenuItem value="cinematic">Cinematic</MenuItem>
                          <MenuItem value="documentary">Documentary</MenuItem>
                          <MenuItem value="animated">Animated</MenuItem>
                          <MenuItem value="vintage">Vintage</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            ))}

            {isGenerating && (
              <Box sx={{ mb: 3 }}>
                <LinearProgress variant="determinate" value={progress} />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Generating your short film... {progress}%
                </Typography>
              </Box>
            )}

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleGenerate}
                disabled={!filmTitle.trim() || scenes.length === 0 || isGenerating}
                sx={{ minWidth: 200 }}
              >
                {isGenerating ? 'Generating...' : 'Generate Film'}
              </Button>
              <Button
                variant="outlined"
                startIcon={<Save />}
                disabled={isGenerating}
              >
                Save Draft
              </Button>
              <Button
                variant="outlined"
                startIcon={<Share />}
                disabled={isGenerating}
              >
                Share
              </Button>
            </Box>
          </Paper>

          {/* Film Tips */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Short Film Creation Tips
            </Typography>
            <Typography variant="body2" paragraph>
              • Keep your film under 5 minutes for best results
            </Typography>
            <Typography variant="body2" paragraph>
              • Each scene should have a clear purpose and emotional impact
            </Typography>
            <Typography variant="body2" paragraph>
              • Use consistent visual style across all scenes
            </Typography>
            <Typography variant="body2" paragraph>
              • Focus on character development and emotional arcs
            </Typography>
            <Typography variant="body2">
              • Consider pacing: build tension, climax, and resolution
            </Typography>
          </Paper>
        </Grid>

        {/* Right Panel - Preview and Stats */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <PlayArrow sx={{ mr: 1, verticalAlign: 'middle' }} />
                Film Preview
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
                <Movie sx={{ fontSize: 48, color: 'grey.500' }} />
              </Box>
              <Typography variant="body2" color="text.secondary">
                Your generated film will appear here
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Film Statistics
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>Scenes:</strong> {scenes.length}
                </Typography>
                <Typography variant="body2">
                  <strong>Total Duration:</strong> {Math.floor(totalDuration / 60)}:{(totalDuration % 60).toString().padStart(2, '0')}
                </Typography>
                <Typography variant="body2">
                  <strong>Genre:</strong> {filmGenre}
                </Typography>
                <Typography variant="body2">
                  <strong>Estimated Cost:</strong> {scenes.length * 10} credits
                </Typography>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Scene Templates
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {[
                  'Opening Shot',
                  'Character Introduction',
                  'Conflict Build-up',
                  'Climax Moment',
                  'Resolution',
                  'Closing Scene'
                ].map((template) => (
                  <Chip
                    key={template}
                    label={template}
                    size="small"
                    variant="outlined"
                    sx={{ cursor: 'pointer' }}
                    onClick={() => {
                      const newScene: Scene = {
                        id: scenes.length + 1,
                        title: template,
                        description: `Describe the ${template.toLowerCase()}...`,
                        duration: 30,
                        style: 'cinematic'
                      };
                      setScenes([...scenes, newScene]);
                    }}
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ShortFilm;