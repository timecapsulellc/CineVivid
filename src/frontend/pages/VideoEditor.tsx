import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Slider,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Paper,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  Stop,
  SkipPrevious,
  SkipNext,
  VolumeUp,
  TextFields,
  Movie,
  Save,
  Download,
} from '@mui/icons-material';

const VideoEditor: React.FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(100);
  const [textOverlays, setTextOverlays] = useState<any[]>([]);
  const [selectedTransition, setSelectedTransition] = useState('fade');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setTrimEnd(videoRef.current.duration);
    }
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (_: Event, newValue: number | number[]) => {
    const value = newValue as number;
    if (videoRef.current) {
      videoRef.current.currentTime = value;
      setCurrentTime(value);
    }
  };

  const handleTrimChange = (start: number, end: number) => {
    setTrimStart(start);
    setTrimEnd(end);
  };

  const addTextOverlay = () => {
    const newOverlay = {
      id: Date.now(),
      text: 'Your Text Here',
      startTime: currentTime,
      endTime: currentTime + 3,
      x: 50,
      y: 50,
      fontSize: 24,
      color: '#ffffff',
      fontFamily: 'Arial'
    };
    setTextOverlays([...textOverlays, newOverlay]);
  };

  const updateTextOverlay = (id: number, updates: any) => {
    setTextOverlays(textOverlays.map(overlay =>
      overlay.id === id ? { ...overlay, ...updates } : overlay
    ));
  };

  const removeTextOverlay = (id: number) => {
    setTextOverlays(textOverlays.filter(overlay => overlay.id !== id));
  };

  const handleExport = async () => {
    setIsProcessing(true);
    setProgress(0);

    try {
      // Simulate processing
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      // In a real implementation, this would send the video and editing parameters to the backend
      const formData = new FormData();
      if (videoFile) {
        formData.append('video', videoFile);
      }
      formData.append('trimStart', trimStart.toString());
      formData.append('trimEnd', trimEnd.toString());
      formData.append('textOverlays', JSON.stringify(textOverlays));
      formData.append('transition', selectedTransition);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));

      clearInterval(progressInterval);
      setProgress(100);

      // Simulate download
      setTimeout(() => {
        setIsProcessing(false);
        setProgress(0);
        alert('Video exported successfully!');
      }, 1000);

    } catch (error) {
      console.error('Export failed:', error);
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const transitions = [
    { id: 'fade', name: 'Fade', description: 'Smooth fade in/out' },
    { id: 'wipe', name: 'Wipe', description: 'Horizontal wipe transition' },
    { id: 'dissolve', name: 'Dissolve', description: 'Cross dissolve' },
    { id: 'slide', name: 'Slide', description: 'Slide transition' },
  ];

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        <Movie sx={{ mr: 2, verticalAlign: 'middle' }} />
        Video Editor
      </Typography>

      <Grid container spacing={4}>
        {/* Left Panel - Video Player & Controls */}
        <Grid item xs={12} lg={8}>
          {/* File Upload */}
          {!videoUrl && (
            <Paper
              sx={{
                p: 4,
                textAlign: 'center',
                border: '2px dashed',
                borderColor: 'primary.main',
                borderRadius: 3,
                mb: 4,
                cursor: 'pointer'
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <Movie sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Upload a Video to Edit
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Support for MP4, MOV, AVI files up to 500MB
              </Typography>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
            </Paper>
          )}

          {/* Video Player */}
          {videoUrl && (
            <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
              <Box sx={{ position: 'relative', mb: 2 }}>
                <video
                  ref={videoRef}
                  src={videoUrl}
                  style={{
                    width: '100%',
                    maxHeight: '400px',
                    borderRadius: '12px',
                    backgroundColor: '#000'
                  }}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />

                {/* Text Overlays Preview */}
                {textOverlays.map((overlay) => (
                  currentTime >= overlay.startTime && currentTime <= overlay.endTime && (
                    <Box
                      key={overlay.id}
                      sx={{
                        position: 'absolute',
                        left: `${overlay.x}%`,
                        top: `${overlay.y}%`,
                        transform: 'translate(-50%, -50%)',
                        color: overlay.color,
                        fontSize: `${overlay.fontSize}px`,
                        fontFamily: overlay.fontFamily,
                        fontWeight: 'bold',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                        pointerEvents: 'none',
                        zIndex: 10
                      }}
                    >
                      {overlay.text}
                    </Box>
                  )
                ))}
              </Box>

              {/* Playback Controls */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <IconButton onClick={() => videoRef.current && (videoRef.current.currentTime = 0)}>
                  <SkipPrevious />
                </IconButton>
                <IconButton onClick={handlePlayPause} size="large">
                  {isPlaying ? <Pause /> : <PlayArrow />}
                </IconButton>
                <IconButton onClick={() => videoRef.current && videoRef.current.pause()}>
                  <Stop />
                </IconButton>
                <IconButton onClick={() => videoRef.current && (videoRef.current.currentTime = duration)}>
                  <SkipNext />
                </IconButton>

                <Typography variant="body2" sx={{ ml: 2 }}>
                  {formatTime(currentTime)} / {formatTime(duration)}
                </Typography>
              </Box>

              {/* Timeline Slider */}
              <Slider
                value={currentTime}
                onChange={handleSeek}
                min={0}
                max={duration || 100}
                step={0.1}
                sx={{ mb: 2 }}
              />

              {/* Trim Controls */}
              <Typography variant="h6" gutterBottom>
                Trim Video
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                  label="Start Time"
                  value={formatTime(trimStart)}
                  size="small"
                  sx={{ width: 120 }}
                />
                <TextField
                  label="End Time"
                  value={formatTime(trimEnd)}
                  size="small"
                  sx={{ width: 120 }}
                />
              </Box>
              <Slider
                value={[trimStart, trimEnd]}
                onChange={(_, newValue) => {
                  const values = newValue as number[];
                  handleTrimChange(values[0], values[1]);
                }}
                min={0}
                max={duration || 100}
                step={0.1}
                sx={{ mb: 3 }}
              />
            </Paper>
          )}

          {/* Processing Progress */}
          {isProcessing && (
            <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
              <Typography variant="h6" gutterBottom>
                Processing Video...
              </Typography>
              <LinearProgress variant="determinate" value={progress} sx={{ mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                {progress}% complete
              </Typography>
            </Paper>
          )}

          {/* Export Button */}
          {videoUrl && (
            <Box sx={{ textAlign: 'center' }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleExport}
                disabled={isProcessing}
                startIcon={<Download />}
                sx={{ minWidth: 200, borderRadius: 3 }}
              >
                {isProcessing ? 'Processing...' : 'Export Video'}
              </Button>
            </Box>
          )}
        </Grid>

        {/* Right Panel - Editing Tools */}
        <Grid item xs={12} lg={4}>
          {/* Transitions */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Transitions
              </Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Transition Type</InputLabel>
                <Select
                  value={selectedTransition}
                  label="Transition Type"
                  onChange={(e) => setSelectedTransition(e.target.value)}
                >
                  {transitions.map((transition) => (
                    <MenuItem key={transition.id} value={transition.id}>
                      {transition.name} - {transition.description}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </CardContent>
          </Card>

          {/* Text Overlays */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Text Overlays
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={addTextOverlay}
                  startIcon={<TextFields />}
                >
                  Add Text
                </Button>
              </Box>

              {textOverlays.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No text overlays added yet
                </Typography>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {textOverlays.map((overlay) => (
                    <Paper key={overlay.id} sx={{ p: 2, bgcolor: 'grey.50' }}>
                      <TextField
                        fullWidth
                        size="small"
                        value={overlay.text}
                        onChange={(e) => updateTextOverlay(overlay.id, { text: e.target.value })}
                        sx={{ mb: 1 }}
                      />
                      <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                        <TextField
                          label="Start"
                          size="small"
                          value={formatTime(overlay.startTime)}
                          onChange={(e) => updateTextOverlay(overlay.id, { startTime: parseFloat(e.target.value) || 0 })}
                          sx={{ width: 80 }}
                        />
                        <TextField
                          label="End"
                          size="small"
                          value={formatTime(overlay.endTime)}
                          onChange={(e) => updateTextOverlay(overlay.id, { endTime: parseFloat(e.target.value) || 0 })}
                          sx={{ width: 80 }}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Chip
                          label={`Size: ${overlay.fontSize}px`}
                          size="small"
                          onClick={() => {
                            const newSize = prompt('Font size:', overlay.fontSize.toString());
                            if (newSize) updateTextOverlay(overlay.id, { fontSize: parseInt(newSize) });
                          }}
                        />
                        <Button
                          size="small"
                          color="error"
                          onClick={() => removeTextOverlay(overlay.id)}
                        >
                          Remove
                        </Button>
                      </Box>
                    </Paper>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Editing Tips
              </Typography>
              <Typography variant="body2" paragraph>
                • Use trim controls to remove unwanted sections
              </Typography>
              <Typography variant="body2" paragraph>
                • Add text overlays at specific timestamps
              </Typography>
              <Typography variant="body2" paragraph>
                • Choose transitions for smooth scene changes
              </Typography>
              <Typography variant="body2">
                • Export in high quality for best results
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default VideoEditor;