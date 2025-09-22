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
              Create Your Video
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
              Transform your ideas into stunning videos with AI
            </Typography>

            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Describe your perfect video scene... A majestic eagle soaring through dramatic mountain peaks at sunset, wings spread wide against a vibrant orange sky, with golden light casting long shadows across the rugged terrain..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              sx={{
                mb: 4,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'grey.50',
                  '&:hover': {
                    backgroundColor: 'grey.100',
                  },
                  '&.Mui-focused': {
                    backgroundColor: 'white',
                  },
                },
              }}
              disabled={isGenerating}
            />

            {/* Advanced Options */}
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
              <Settings sx={{ mr: 1, fontSize: 20 }} />
              Customize Your Video
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel sx={{ fontWeight: 500 }}>Aspect Ratio</InputLabel>
                  <Select
                    value={aspectRatio}
                    label="Aspect Ratio"
                    onChange={(e) => setAspectRatio(e.target.value)}
                    disabled={isGenerating}
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="16:9">16:9 Landscape</MenuItem>
                    <MenuItem value="9:16">9:16 Portrait</MenuItem>
                    <MenuItem value="1:1">1:1 Square</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel sx={{ fontWeight: 500 }}>Duration</InputLabel>
                  <Select
                    value={duration}
                    label="Duration"
                    onChange={(e) => setDuration(e.target.value)}
                    disabled={isGenerating}
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="5">5 seconds</MenuItem>
                    <MenuItem value="10">10 seconds</MenuItem>
                    <MenuItem value="15">15 seconds</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel sx={{ fontWeight: 500 }}>Style</InputLabel>
                  <Select
                    value={style}
                    label="Style"
                    onChange={(e) => setStyle(e.target.value)}
                    disabled={isGenerating}
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="realistic">Realistic</MenuItem>
                    <MenuItem value="cinematic">Cinematic</MenuItem>
                    <MenuItem value="animated">Animated</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Voiceover Options */}
            <Box sx={{ mb: 4 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={enableVoiceover}
                    onChange={(e) => setEnableVoiceover(e.target.checked)}
                    disabled={isGenerating}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: 'primary.main',
                      },
                    }}
                  />
                }
                label={
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    🎤 Add Professional Voiceover
                  </Typography>
                }
              />
            </Box>

            {enableVoiceover && (
              <Paper
                sx={{
                  p: 3,
                  mb: 4,
                  borderRadius: 2,
                  backgroundColor: 'grey.50',
                  border: '1px solid',
                  borderColor: 'grey.200',
                }}
              >
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Voiceover Settings
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Enter the narration text for your video... This majestic eagle soars through the mountains at sunset, its wings catching the golden light..."
                  value={voiceoverText}
                  onChange={(e) => setVoiceoverText(e.target.value)}
                  sx={{ mb: 3 }}
                  disabled={isGenerating}
                />
                <FormControl fullWidth>
                  <InputLabel sx={{ fontWeight: 500 }}>AI Voice</InputLabel>
                  <Select
                    value={voiceId}
                    label="AI Voice"
                    onChange={(e) => setVoiceId(e.target.value)}
                    disabled={isGenerating}
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="21m00Tcm4TlvDq8ikWAM">Rachel (Warm Female)</MenuItem>
                    <MenuItem value="29vD33pQtUPKGSMZhtVx">Drew (Professional Male)</MenuItem>
                    <MenuItem value="AZnzlk1XvdvUeBnXmlld">Domi (Youthful Female)</MenuItem>
                    <MenuItem value="EXAVITQu4vr4xnSDxMaL">Bella (Energetic Female)</MenuItem>
                  </Select>
                </FormControl>
              </Paper>
            )}

            {isGenerating && (
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Generating your video...
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
              disabled={!prompt.trim() || isGenerating}
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
                  Generating...
                </>
              ) : (
                'Generate Video'
              )}
            </Button>
          </Paper>

          {/* Prompt Suggestions */}
          <Paper sx={{ p: 4, mt: 3, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              💡 Try These Prompts
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
              {[
                'A serene lake surrounded by towering mountains with sunlight dancing on the water',
                'Urban cityscape at night with neon lights reflecting on wet streets',
                'Butterfly emerging from chrysalis in slow motion with golden sunlight',
                'Chef preparing gourmet meal in modern kitchen with steam rising',
                'Wild horse galloping through golden grassland at sunset',
                'Crystal clear waterfall cascading down moss-covered rocks in a forest'
              ].map((suggestion) => (
                <Chip
                  key={suggestion}
                  label={suggestion.length > 50 ? suggestion.substring(0, 50) + '...' : suggestion}
                  onClick={() => setPrompt(suggestion)}
                  variant="outlined"
                  sx={{
                    cursor: 'pointer',
                    borderRadius: 2,
                    py: 1,
                    px: 0.5,
                    fontSize: '0.875rem',
                    '&:hover': {
                      backgroundColor: 'primary.main',
                      color: 'white',
                      borderColor: 'primary.main',
                    },
                  }}
                />
              ))}
            </Box>
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
                🎬 Video Preview
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
                    <PlayArrow sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                    <Typography variant="body1" sx={{ color: 'text.secondary', textAlign: 'center' }}>
                      {isGenerating ? 'Creating your video...' : 'Your video will appear here'}
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
                  Download Video
                </Button>
              )}
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                ✨ Pro Tips for Better Videos
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ color: 'primary.main', mr: 2, mt: 0.5 }}>•</Box>
                <Typography variant="body2">
                  <strong>Be specific:</strong> Describe subjects, actions, lighting, and camera movements in detail
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ color: 'primary.main', mr: 2, mt: 0.5 }}>•</Box>
                <Typography variant="body2">
                  <strong>Add motion:</strong> Include verbs like "soaring," "flowing," "dancing" for dynamic results
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ color: 'primary.main', mr: 2, mt: 0.5 }}>•</Box>
                <Typography variant="body2">
                  <strong>Specify style:</strong> Mention artistic styles, time periods, or visual aesthetics
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ color: 'primary.main', mr: 2, mt: 0.5 }}>•</Box>
                <Typography variant="body2">
                  <strong>Use emotions:</strong> Words like "majestic," "serene," "dramatic" guide the mood
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ToVideo;