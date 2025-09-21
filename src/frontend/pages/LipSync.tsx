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
} from '@mui/material';
import { CloudUpload, PlayArrow, Mic } from '@mui/icons-material';

const LipSync: React.FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [audioText, setAudioText] = useState('');
  const [voice, setVoice] = useState('natural');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setVideoFile(file);
    }
  };

  const handleGenerate = async () => {
    setIsProcessing(true);
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

      const formData = new FormData();
      if (videoFile) {
        formData.append('video_file', videoFile);
      }
      formData.append('audio_text', audioText);
      formData.append('voice', voice);

      const response = await fetch('/generate/lip-sync', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (response.ok) {
        // Handle success
        setTimeout(() => {
          setIsProcessing(false);
          setProgress(0);
        }, 1000);
      }

    } catch (error) {
      console.error('Lip sync failed:', error);
      setIsProcessing(false);
      setProgress(0);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Lip Sync
      </Typography>

      <Grid container spacing={4}>
        {/* Left Panel - Upload and Settings */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Upload Video
            </Typography>
            <Box
              sx={{
                border: '2px dashed #ccc',
                borderRadius: 2,
                p: 4,
                textAlign: 'center',
                mb: 3,
                cursor: 'pointer',
                '&:hover': { borderColor: 'primary.main' }
              }}
              onClick={() => document.getElementById('video-upload')?.click()}
            >
              <CloudUpload sx={{ fontSize: 48, color: 'grey.500', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                {videoFile ? videoFile.name : 'Click to upload video'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Supported formats: MP4, MOV, AVI (Max 100MB)
              </Typography>
              <input
                id="video-upload"
                type="file"
                accept="video/*"
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />
            </Box>

            <Typography variant="h6" gutterBottom>
              Audio Text
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Enter the text you want the video to lip-sync to..."
              value={audioText}
              onChange={(e) => setAudioText(e.target.value)}
              sx={{ mb: 3 }}
              disabled={isProcessing}
            />

            <Typography variant="h6" gutterBottom>
              Voice Settings
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Voice Type</InputLabel>
                  <Select
                    value={voice}
                    label="Voice Type"
                    onChange={(e) => setVoice(e.target.value)}
                    disabled={isProcessing}
                  >
                    <MenuItem value="natural">Natural</MenuItem>
                    <MenuItem value="robotic">Robotic</MenuItem>
                    <MenuItem value="child">Child</MenuItem>
                    <MenuItem value="elderly">Elderly</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {isProcessing && (
              <Box sx={{ mb: 3 }}>
                <LinearProgress variant="determinate" value={progress} />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Processing lip sync... {progress}%
                </Typography>
              </Box>
            )}

            <Button
              variant="contained"
              size="large"
              onClick={handleGenerate}
              disabled={!videoFile || !audioText.trim() || isProcessing}
              sx={{ minWidth: 200 }}
            >
              {isProcessing ? 'Processing...' : 'Generate Lip Sync'}
            </Button>
          </Paper>

          {/* Tips */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Lip Sync Tips
            </Typography>
            <Typography variant="body2" paragraph>
              • Upload a video with a clear face view for best results
            </Typography>
            <Typography variant="body2" paragraph>
              • The text should match the natural speaking rhythm
            </Typography>
            <Typography variant="body2" paragraph>
              • Keep text length appropriate for video duration
            </Typography>
            <Typography variant="body2">
              • Natural voice type works best for most videos
            </Typography>
          </Paper>
        </Grid>

        {/* Right Panel - Preview */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Mic sx={{ mr: 1, verticalAlign: 'middle' }} />
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
                <PlayArrow sx={{ fontSize: 48, color: 'grey.500' }} />
              </Box>
              <Typography variant="body2" color="text.secondary">
                Your lip-synced video will appear here
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Supported Languages
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese'].map((lang) => (
                  <Chip key={lang} label={lang} size="small" variant="outlined" />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default LipSync;