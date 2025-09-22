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
  Switch,
  FormControlLabel,
} from '@mui/material';
import { PlayArrow, Settings } from '@mui/icons-material';

const ToVideo: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [duration, setDuration] = useState('5');
  const [style, setStyle] = useState('realistic');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [voiceoverText, setVoiceoverText] = useState('');
  const [voiceId, setVoiceId] = useState('21m00Tcm4TlvDq8ikWAM');
  const [enableVoiceover, setEnableVoiceover] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setProgress(0);
    setGeneratedVideo(null);

    try {
      const requestData: any = {
        prompt,
        aspect_ratio: aspectRatio,
        duration: parseInt(duration),
        style
      };

      if (enableVoiceover && voiceoverText.trim()) {
        requestData.voiceover_text = voiceoverText.trim();
        requestData.voice_id = voiceId;
      }

      const response = await fetch('http://localhost:8001/generate/video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const data = await response.json();
        setTaskId(data.task_id);

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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        Text to Video
      </Typography>

      <Grid container spacing={4}>
        {/* Left Panel - Generation Form */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Describe your video
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={6}
              placeholder="A majestic eagle soaring through dramatic mountain peaks at sunset, wings spread wide against a vibrant orange sky..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              sx={{ mb: 3 }}
              disabled={isGenerating}
            />

            {/* Advanced Options */}
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              <Settings sx={{ mr: 1, verticalAlign: 'middle' }} />
              Advanced Options
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Aspect Ratio</InputLabel>
                  <Select
                    value={aspectRatio}
                    label="Aspect Ratio"
                    onChange={(e) => setAspectRatio(e.target.value)}
                    disabled={isGenerating}
                  >
                    <MenuItem value="16:9">16:9 (Landscape)</MenuItem>
                    <MenuItem value="9:16">9:16 (Portrait)</MenuItem>
                    <MenuItem value="1:1">1:1 (Square)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Duration</InputLabel>
                  <Select
                    value={duration}
                    label="Duration"
                    onChange={(e) => setDuration(e.target.value)}
                    disabled={isGenerating}
                  >
                    <MenuItem value="5">5 seconds</MenuItem>
                    <MenuItem value="10">10 seconds</MenuItem>
                    <MenuItem value="15">15 seconds</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
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
                    <MenuItem value="cinematic">Cinematic</MenuItem>
                    <MenuItem value="animated">Animated</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Voiceover Options */}
            <Box sx={{ mt: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={enableVoiceover}
                    onChange={(e) => setEnableVoiceover(e.target.checked)}
                    disabled={isGenerating}
                  />
                }
                label="Add Voiceover (ElevenLabs)"
              />
            </Box>

            {enableVoiceover && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  Voiceover Settings
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Enter the narration text for your video..."
                  value={voiceoverText}
                  onChange={(e) => setVoiceoverText(e.target.value)}
                  sx={{ mb: 2 }}
                  disabled={isGenerating}
                />
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Voice</InputLabel>
                  <Select
                    value={voiceId}
                    label="Voice"
                    onChange={(e) => setVoiceId(e.target.value)}
                    disabled={isGenerating}
                  >
                    <MenuItem value="21m00Tcm4TlvDq8ikWAM">Rachel (Female)</MenuItem>
                    <MenuItem value="29vD33pQtUPKGSMZhtVx">Drew (Male)</MenuItem>
                    <MenuItem value="AZnzlk1XvdvUeBnXmlld">Domi (Female)</MenuItem>
                    <MenuItem value="EXAVITQu4vr4xnSDxMaL">Bella (Female)</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            )}

            {isGenerating && (
              <Box sx={{ mb: 3 }}>
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

          {/* Prompt Suggestions */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Prompt Suggestions
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {[
                'A serene lake reflecting snow-capped mountains',
                'Urban cityscape at night with neon lights',
                'Butterfly emerging from chrysalis in slow motion',
                'Chef preparing gourmet meal in modern kitchen'
              ].map((suggestion) => (
                <Chip
                  key={suggestion}
                  label={suggestion}
                  onClick={() => setPrompt(suggestion)}
                  variant="outlined"
                  sx={{ cursor: 'pointer' }}
                />
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Right Panel - Preview/Info */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Video Preview
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
                {generatedVideo ? (
                  <video
                    controls
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    src={`http://localhost:8001${generatedVideo}`}
                  />
                ) : (
                  <PlayArrow sx={{ fontSize: 48, color: 'grey.500' }} />
                )}
              </Box>
              <Typography variant="body2" color="text.secondary">
                {generatedVideo ? 'Your generated video' : 'Your generated video will appear here'}
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Generation Tips
              </Typography>
              <Typography variant="body2" paragraph>
                • Be specific about subjects, actions, and environments
              </Typography>
              <Typography variant="body2" paragraph>
                • Include camera movements and lighting descriptions
              </Typography>
              <Typography variant="body2" paragraph>
                • Mention time of day and weather conditions
              </Typography>
              <Typography variant="body2">
                • Use vivid, descriptive language for better results
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ToVideo;