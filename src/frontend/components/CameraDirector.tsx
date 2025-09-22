import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Slider,
} from '@mui/material';
import {
  Videocam,
  ExpandMore,
  Camera,
  Movie,
  SlowMotionVideo,
  FastForward,
} from '@mui/icons-material';

interface CameraDirectorProps {
  onShotTypeChange: (shotType: string) => void;
  onCameraMovementChange: (movement: string) => void;
  onDurationChange: (duration: number) => void;
  onAngleChange: (angle: string) => void;
  initialValues?: {
    shotType?: string;
    cameraMovement?: string;
    duration?: number;
    angle?: string;
  };
}

const CameraDirector: React.FC<CameraDirectorProps> = ({
  onShotTypeChange,
  onCameraMovementChange,
  onDurationChange,
  onAngleChange,
  initialValues = {}
}) => {
  const [shotType, setShotType] = useState(initialValues.shotType || 'medium');
  const [cameraMovement, setCameraMovement] = useState(initialValues.cameraMovement || 'static');
  const [duration, setDuration] = useState(initialValues.duration || 5);
  const [angle, setAngle] = useState(initialValues.angle || 'eye-level');

  const shotTypes = [
    {
      id: 'extreme-wide',
      name: 'Extreme Wide Shot',
      description: 'Shows the subject in relation to a large environment',
      icon: '🌄',
      example: '[EXTREME WIDE SHOT]'
    },
    {
      id: 'wide',
      name: 'Wide Shot',
      description: 'Shows the subject from head to toe',
      icon: '🏞️',
      example: '[WIDE SHOT]'
    },
    {
      id: 'medium',
      name: 'Medium Shot',
      description: 'Shows the subject from waist up',
      icon: '👤',
      example: '[MEDIUM SHOT]'
    },
    {
      id: 'close-up',
      name: 'Close-Up',
      description: 'Focuses on face or specific detail',
      icon: '👁️',
      example: '[CLOSE-UP]'
    },
    {
      id: 'extreme-close-up',
      name: 'Extreme Close-Up',
      description: 'Shows only eyes or small details',
      icon: '👀',
      example: '[EXTREME CLOSE-UP]'
    },
    {
      id: 'over-the-shoulder',
      name: 'Over-the-Shoulder',
      description: 'Shows subject from behind another person',
      icon: '👥',
      example: '[OVER-THE-SHOULDER]'
    }
  ];

  const cameraMovements = [
    {
      id: 'static',
      name: 'Static',
      description: 'Camera stays in one position',
      icon: '📷',
      example: '[STATIC]'
    },
    {
      id: 'pan-left',
      name: 'Pan Left',
      description: 'Camera moves horizontally left',
      icon: '⬅️',
      example: '[PAN LEFT]'
    },
    {
      id: 'pan-right',
      name: 'Pan Right',
      description: 'Camera moves horizontally right',
      icon: '➡️',
      example: '[PAN RIGHT]'
    },
    {
      id: 'tilt-up',
      name: 'Tilt Up',
      description: 'Camera moves vertically upward',
      icon: '⬆️',
      example: '[TILT UP]'
    },
    {
      id: 'tilt-down',
      name: 'Tilt Down',
      description: 'Camera moves vertically downward',
      icon: '⬇️',
      example: '[TILT DOWN]'
    },
    {
      id: 'zoom-in',
      name: 'Zoom In',
      description: 'Camera moves closer to subject',
      icon: '🔍',
      example: '[ZOOM IN]'
    },
    {
      id: 'zoom-out',
      name: 'Zoom Out',
      description: 'Camera moves away from subject',
      icon: '🔭',
      example: '[ZOOM OUT]'
    },
    {
      id: 'dolly-in',
      name: 'Dolly In',
      description: 'Camera physically moves toward subject',
      icon: '📹',
      example: '[DOLLY IN]'
    },
    {
      id: 'dolly-out',
      name: 'Dolly Out',
      description: 'Camera physically moves away from subject',
      icon: '🎥',
      example: '[DOLLY OUT]'
    },
    {
      id: 'tracking',
      name: 'Tracking Shot',
      description: 'Camera follows moving subject',
      icon: '🏃',
      example: '[TRACKING SHOT]'
    },
    {
      id: 'dutch-angle',
      name: 'Dutch Angle',
      description: 'Camera tilted to create tension',
      icon: '📐',
      example: '[DUTCH ANGLE]'
    }
  ];

  const cameraAngles = [
    { id: 'birdseye', name: 'Bird\'s Eye', description: 'Looking straight down' },
    { id: 'high-angle', name: 'High Angle', description: 'Looking down at subject' },
    { id: 'eye-level', name: 'Eye Level', description: 'At subject\'s eye height' },
    { id: 'low-angle', name: 'Low Angle', description: 'Looking up at subject' },
    { id: 'wormseye', name: 'Worm\'s Eye', description: 'Looking up from ground level' }
  ];

  const handleShotTypeSelect = (selectedShot: string) => {
    setShotType(selectedShot);
    onShotTypeChange(selectedShot);
  };

  const handleCameraMovementSelect = (selectedMovement: string) => {
    setCameraMovement(selectedMovement);
    onCameraMovementChange(selectedMovement);
  };

  const handleDurationChange = (_: Event, newValue: number | number[]) => {
    const value = newValue as number;
    setDuration(value);
    onDurationChange(value);
  };

  const handleAngleChange = (selectedAngle: string) => {
    setAngle(selectedAngle);
    onAngleChange(selectedAngle);
  };

  const generatePromptTags = () => {
    const tags = [];
    if (shotType !== 'medium') {
      const shot = shotTypes.find(s => s.id === shotType);
      if (shot) tags.push(shot.example);
    }
    if (cameraMovement !== 'static') {
      const movement = cameraMovements.find(m => m.id === cameraMovement);
      if (movement) tags.push(movement.example);
    }
    if (angle !== 'eye-level') {
      tags.push(`[${angle.toUpperCase()} ANGLE]`);
    }
    return tags;
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <Videocam sx={{ mr: 1 }} />
        Camera Director
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Control cinematic camera techniques to enhance your video's visual storytelling
      </Typography>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1">Shot Composition</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            {shotTypes.map((shot) => (
              <Grid item xs={12} sm={6} md={4} key={shot.id}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    border: shotType === shot.id ? '2px solid #1976d2' : '1px solid #e0e0e0',
                    '&:hover': { boxShadow: 3 }
                  }}
                  onClick={() => handleShotTypeSelect(shot.id)}
                >
                  <CardContent sx={{ textAlign: 'center', py: 2 }}>
                    <Typography variant="h4" sx={{ mb: 1 }}>{shot.icon}</Typography>
                    <Typography variant="subtitle2" gutterBottom>
                      {shot.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                      {shot.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1">Camera Movement</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            {cameraMovements.map((movement) => (
              <Grid item xs={12} sm={6} md={4} key={movement.id}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    border: cameraMovement === movement.id ? '2px solid #1976d2' : '1px solid #e0e0e0',
                    '&:hover': { boxShadow: 3 }
                  }}
                  onClick={() => handleCameraMovementSelect(movement.id)}
                >
                  <CardContent sx={{ textAlign: 'center', py: 2 }}>
                    <Typography variant="h4" sx={{ mb: 1 }}>{movement.icon}</Typography>
                    <Typography variant="subtitle2" gutterBottom>
                      {movement.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                      {movement.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1">Camera Settings</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Camera Angle</InputLabel>
                <Select
                  value={angle}
                  label="Camera Angle"
                  onChange={(e) => handleAngleChange(e.target.value)}
                >
                  {cameraAngles.map((angleOption) => (
                    <MenuItem key={angleOption.id} value={angleOption.id}>
                      {angleOption.name} - {angleOption.description}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography gutterBottom>Duration: {duration} seconds</Typography>
              <Slider
                value={duration}
                onChange={handleDurationChange}
                min={3}
                max={15}
                step={1}
                marks
                valueLabelDisplay="auto"
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Generated Prompt Tags */}
      <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
        <Typography variant="subtitle2" gutterBottom>
          Generated Camera Tags:
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {generatePromptTags().map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              size="small"
              color="primary"
              variant="outlined"
            />
          ))}
          {generatePromptTags().length === 0 && (
            <Typography variant="body2" color="text.secondary">
              No camera tags selected (using defaults)
            </Typography>
          )}
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          These tags will be automatically added to your prompt for precise camera control.
        </Typography>
      </Box>
    </Box>
  );
};

export default CameraDirector;