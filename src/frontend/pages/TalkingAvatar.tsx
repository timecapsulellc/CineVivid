import React, { useState, useEffect } from 'react';
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
  Avatar,
  IconButton,
  Slider,
} from '@mui/material';
import {
  PlayArrow,
  Stop,
  VolumeUp,
  Person,
  Mic,
  Settings,
} from '@mui/icons-material';

const TalkingAvatar: React.FC = () => {
  const [text, setText] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('21m00Tcm4TlvDq8ikWAM'); // Rachel
  const [selectedAvatar, setSelectedAvatar] = useState('avatar1');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [voices, setVoices] = useState<any[]>([]);
  const [speed, setSpeed] = useState(1.0);
  const [pitch, setPitch] = useState(0);

  // Available avatars
  const avatars = [
    { id: 'avatar1', name: 'Professional Woman', image: '/avatars/woman1.jpg', gender: 'female' },
    { id: 'avatar2', name: 'Business Man', image: '/avatars/man1.jpg', gender: 'male' },
    { id: 'avatar3', name: 'Young Creator', image: '/avatars/young1.jpg', gender: 'female' },
    { id: 'avatar4', name: 'Senior Presenter', image: '/avatars/senior1.jpg', gender: 'male' },
  ];

  // Load available voices on component mount
  useEffect(() => {
    loadVoices();
  }, []);

  const loadVoices = async () => {
    try {
      // Mock voice data - in production, fetch from ElevenLabs API
      setVoices([
        { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel', gender: 'female', accent: 'American' },
        { id: 'AZnzlk1XvdvUeBnXmlld', name: 'Drew', gender: 'male', accent: 'American' },
        { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella', gender: 'female', accent: 'American' },
        { id: 'ErXwobaYiN019PkySvjV', name: 'Antoni', gender: 'male', accent: 'American' },
        { id: 'VR6AewLTigWG4xSOukaG', name: 'Arnold', gender: 'male', accent: 'American' },
        { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam', gender: 'male', accent: 'American' },
        { id: '29vD33N1CtxCmqQRPOHJ', name: ' Elli', gender: 'female', accent: 'American' },
        { id: 'IKne3meq5aSn9XLyUdCD', name: 'Josh', gender: 'male', accent: 'American' },
      ]);
    } catch (error) {
      console.error('Failed to load voices:', error);
    }
  };

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
          return prev + 8;
        });
      }, 500);

      const response = await fetch('/generate/talking-avatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voice_id: selectedVoice,
          avatar_id: selectedAvatar,
          speed,
          pitch
        }),
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (response.ok) {
        const result = await response.json();
        setGeneratedVideo(result.video_url);
      }

      setTimeout(() => {
        setIsGenerating(false);
        setProgress(0);
      }, 1000);

    } catch (error) {
      console.error('Talking avatar generation failed:', error);
      setIsGenerating(false);
      setProgress(0);
    }
  };

  const selectedAvatarData = avatars.find(a => a.id === selectedAvatar);
  const selectedVoiceData = voices.find(v => v.id === selectedVoice);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        <Person sx={{ mr: 2, verticalAlign: 'middle' }} />
        Talking Avatar
      </Typography>

      <Grid container spacing={4}>
        {/* Left Panel - Input Form */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Create Your Talking Avatar
            </Typography>

            {/* Avatar Selection */}
            <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
              Choose Avatar
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {avatars.map((avatar) => (
                <Grid item xs={6} sm={3} key={avatar.id}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      border: selectedAvatar === avatar.id ? '2px solid #1976d2' : '1px solid #e0e0e0',
                      '&:hover': { boxShadow: 3 }
                    }}
                    onClick={() => setSelectedAvatar(avatar.id)}
                  >
                    <CardMedia
                      component="img"
                      height="120"
                      image={avatar.image}
                      alt={avatar.name}
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent sx={{ p: 1, textAlign: 'center' }}>
                      <Typography variant="caption">{avatar.name}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Text Input */}
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Speech Text"
              placeholder="Enter the text you want the avatar to speak..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              sx={{ mb: 3 }}
              disabled={isGenerating}
            />

            {/* Voice Selection */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Voice</InputLabel>
                  <Select
                    value={selectedVoice}
                    label="Voice"
                    onChange={(e) => setSelectedVoice(e.target.value)}
                    disabled={isGenerating}
                  >
                    {voices.map((voice) => (
                      <MenuItem key={voice.id} value={voice.id}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Mic sx={{ mr: 1, fontSize: 16 }} />
                          {voice.name} ({voice.accent})
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Voice Preview</InputLabel>
                  <Select value="" label="Voice Preview" disabled>
                    <MenuItem>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PlayArrow sx={{ mr: 1 }} />
                        Preview "{selectedVoiceData?.name || 'Voice'}"
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Voice Settings */}
            <Typography variant="subtitle1" gutterBottom>
              <Settings sx={{ mr: 1, verticalAlign: 'middle' }} />
              Voice Settings
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <Typography gutterBottom>Speed: {speed.toFixed(1)}x</Typography>
                <Slider
                  value={speed}
                  onChange={(_, newValue) => setSpeed(newValue as number)}
                  min={0.5}
                  max={2.0}
                  step={0.1}
                  disabled={isGenerating}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography gutterBottom>Pitch: {pitch > 0 ? '+' : ''}{pitch}</Typography>
                <Slider
                  value={pitch}
                  onChange={(_, newValue) => setPitch(newValue as number)}
                  min={-10}
                  max={10}
                  step={1}
                  disabled={isGenerating}
                />
              </Grid>
            </Grid>

            {isGenerating && (
              <Box sx={{ mb: 3 }}>
                <LinearProgress variant="determinate" value={progress} />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Creating your talking avatar... {progress}%
                </Typography>
              </Box>
            )}

            <Button
              variant="contained"
              size="large"
              onClick={handleGenerate}
              disabled={!text.trim() || !selectedAvatar || isGenerating}
              sx={{ minWidth: 200 }}
            >
              {isGenerating ? 'Generating...' : 'Create Avatar Video'}
            </Button>
          </Paper>

          {/* Tips */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Tips for Better Results
            </Typography>
            <Typography variant="body2" paragraph>
              • Choose voices that match your avatar's appearance and personality
            </Typography>
            <Typography variant="body2" paragraph>
              • Keep text concise (under 200 words) for best lip-sync quality
            </Typography>
            <Typography variant="body2" paragraph>
              • Use proper punctuation for natural speech pauses
            </Typography>
            <Typography variant="body2">
              • Experiment with speed and pitch to match your brand voice
            </Typography>
          </Paper>
        </Grid>

        {/* Right Panel - Preview */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <PlayArrow sx={{ mr: 1, verticalAlign: 'middle' }} />
                Avatar Preview
              </Typography>

              {selectedAvatarData && (
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <Avatar
                    src={selectedAvatarData.image}
                    sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
                  />
                  <Typography variant="subtitle1">{selectedAvatarData.name}</Typography>
                  <Chip
                    label={`Voice: ${selectedVoiceData?.name || 'Not selected'}`}
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </Box>
              )}

              {generatedVideo ? (
                <Box sx={{ width: '100%', height: 200, bgcolor: 'grey.100', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <video
                    src={generatedVideo}
                    controls
                    style={{ width: '100%', height: '100%', borderRadius: 8 }}
                  />
                </Box>
              ) : (
                <Box sx={{ width: '100%', height: 200, bgcolor: 'grey.200', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Person sx={{ fontSize: 48, color: 'grey.500' }} />
                </Box>
              )}

              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                {generatedVideo ? 'Your talking avatar is ready!' : 'Generated video will appear here'}
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Voice Library
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {voices.slice(0, 6).map((voice) => (
                  <Chip
                    key={voice.id}
                    label={voice.name}
                    size="small"
                    variant={selectedVoice === voice.id ? 'filled' : 'outlined'}
                    onClick={() => setSelectedVoice(voice.id)}
                    sx={{ cursor: 'pointer' }}
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

export default TalkingAvatar;