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
  Alert,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { School, Upload, Settings, CheckCircle } from '@mui/icons-material';

const TrainModel: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [modelName, setModelName] = useState('');
  const [modelType, setModelType] = useState('lora');
  const [trainingData, setTrainingData] = useState<File[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [progress, setProgress] = useState(0);
  const [trainingComplete, setTrainingComplete] = useState(false);

  const steps = ['Upload Data', 'Configure Model', 'Train Model', 'Download Model'];

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setTrainingData(files);
  };

  const handleTrain = async () => {
    setIsTraining(true);
    setProgress(0);

    // Simulate training progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          setIsTraining(false);
          setTrainingComplete(true);
          setActiveStep(3);
          return 100;
        }
        return prev + 5;
      });
    }, 1000);
  };

  const trainingTypes = [
    {
      type: 'lora',
      title: 'LoRA Fine-tuning',
      description: 'Efficient fine-tuning for style adaptation',
      features: ['Fast training', 'Low VRAM usage', 'Style transfer', 'Character consistency']
    },
    {
      type: 'dreambooth',
      title: 'DreamBooth Training',
      description: 'Subject-specific model training',
      features: ['Subject focus', 'High fidelity', 'Concept learning', 'Personalization']
    },
    {
      type: 'full_finetune',
      title: 'Full Model Fine-tuning',
      description: 'Complete model adaptation',
      features: ['Maximum control', 'High quality', 'Custom datasets', 'Advanced customization']
    }
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Grid container spacing={6}>
        {/* Left Panel - Training Form */}
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
              Train Custom AI Model
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
              Create personalized AI models trained on your specific content and style
            </Typography>

            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {/* Step 1: Upload Data */}
            {activeStep === 0 && (
              <Box>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Step 1: Upload Training Data
                </Typography>

                <Paper
                  sx={{
                    p: 3,
                    mb: 3,
                    border: '2px dashed',
                    borderColor: 'primary.main',
                    backgroundColor: 'grey.50',
                    textAlign: 'center',
                  }}
                >
                  <Upload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Upload Your Training Images
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
                    Upload 10-50 high-quality images of your subject or style
                  </Typography>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="training-data-upload"
                    multiple
                    type="file"
                    onChange={handleFileUpload}
                  />
                  <label htmlFor="training-data-upload">
                    <Button variant="contained" component="span">
                      Choose Files
                    </Button>
                  </label>
                </Paper>

                {trainingData.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      Selected files: {trainingData.length}
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {trainingData.slice(0, 5).map((file, index) => (
                        <Chip
                          key={index}
                          label={file.name.length > 20 ? file.name.substring(0, 20) + '...' : file.name}
                          size="small"
                          onDelete={() => {
                            const newData = trainingData.filter((_, i) => i !== index);
                            setTrainingData(newData);
                          }}
                        />
                      ))}
                      {trainingData.length > 5 && (
                        <Chip label={`+${trainingData.length - 5} more`} size="small" />
                      )}
                    </Stack>
                  </Box>
                )}

                <Alert severity="info" sx={{ mb: 3 }}>
                  <Typography variant="body2">
                    <strong>Tips:</strong> Use consistent lighting, angles, and subjects. Include various poses and expressions for better results.
                  </Typography>
                </Alert>
              </Box>
            )}

            {/* Step 2: Configure Model */}
            {activeStep === 1 && (
              <Box>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Step 2: Configure Your Model
                </Typography>

                <TextField
                  fullWidth
                  label="Model Name"
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  sx={{ mb: 3 }}
                  placeholder="e.g., My Character Style, Product Photography"
                />

                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Training Type
                </Typography>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                  {trainingTypes.map((type) => (
                    <Grid item xs={12} md={4} key={type.type}>
                      <Card
                        sx={{
                          cursor: 'pointer',
                          border: modelType === type.type ? '2px solid' : '1px solid',
                          borderColor: modelType === type.type ? 'primary.main' : 'grey.300',
                          backgroundColor: modelType === type.type ? 'primary.50' : 'white',
                        }}
                        onClick={() => setModelType(type.type)}
                      >
                        <CardContent sx={{ p: 2 }}>
                          <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                            {type.title}
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                            {type.description}
                          </Typography>
                          <Stack spacing={0.5}>
                            {type.features.map((feature, index) => (
                              <Typography key={index} variant="caption" sx={{ display: 'flex', alignItems: 'center' }}>
                                <CheckCircle sx={{ fontSize: 14, mr: 0.5, color: 'success.main' }} />
                                {feature}
                              </Typography>
                            ))}
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>

                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Training Duration</InputLabel>
                  <Select value="standard" label="Training Duration">
                    <MenuItem value="quick">Quick (15 min) - Basic results</MenuItem>
                    <MenuItem value="standard">Standard (1 hour) - Good quality</MenuItem>
                    <MenuItem value="extended">Extended (4 hours) - Best quality</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            )}

            {/* Step 3: Train Model */}
            {activeStep === 2 && (
              <Box>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Step 3: Start Training
                </Typography>

                <Paper sx={{ p: 3, mb: 3, backgroundColor: 'grey.50' }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>Training Summary</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Model Name:</Typography>
                      <Typography variant="body1">{modelName || 'Untitled Model'}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Training Type:</Typography>
                      <Typography variant="body1">{trainingTypes.find(t => t.type === modelType)?.title}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Training Images:</Typography>
                      <Typography variant="body1">{trainingData.length} files</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Estimated Time:</Typography>
                      <Typography variant="body1">1 hour</Typography>
                    </Grid>
                  </Grid>
                </Paper>

                <Alert severity="warning" sx={{ mb: 3 }}>
                  <Typography variant="body2">
                    Training will consume credits. Make sure you have sufficient credits before starting.
                  </Typography>
                </Alert>

                {isTraining && (
                  <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        Training your custom model...
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
              </Box>
            )}

            {/* Step 4: Download Model */}
            {activeStep === 3 && trainingComplete && (
              <Box>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Step 4: Training Complete!
                </Typography>

                <Alert severity="success" sx={{ mb: 3 }}>
                  <Typography variant="body2">
                    Your custom model has been trained successfully! You can now use it in your AI generations.
                  </Typography>
                </Alert>

                <Paper sx={{ p: 3, mb: 3, backgroundColor: 'success.50' }}>
                  <Typography variant="h6" sx={{ mb: 2, color: 'success.main' }}>
                    Model Details
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Model ID:</Typography>
                      <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                        {modelName.toLowerCase().replace(/\s+/g, '_')}_v1
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Training Type:</Typography>
                      <Typography variant="body1">{trainingTypes.find(t => t.type === modelType)?.title}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Status:</Typography>
                      <Chip label="Ready to Use" color="success" size="small" />
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Credits Used:</Typography>
                      <Typography variant="body1">50 credits</Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Box>
            )}

            {/* Navigation Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                variant="outlined"
              >
                Back
              </Button>

              <Box>
                {activeStep === 2 && !isTraining && !trainingComplete && (
                  <Button
                    variant="contained"
                    onClick={handleTrain}
                    disabled={!modelName.trim() || trainingData.length === 0}
                    sx={{ mr: 2 }}
                  >
                    Start Training
                  </Button>
                )}

                {activeStep < 2 && (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={
                      (activeStep === 0 && trainingData.length === 0) ||
                      (activeStep === 1 && !modelName.trim())
                    }
                  >
                    Next
                  </Button>
                )}

                {trainingComplete && (
                  <Button variant="contained" color="success">
                    Use Model
                  </Button>
                )}
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Right Panel - Info & Tips */}
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
                <School sx={{ mr: 1, verticalAlign: 'middle' }} />
                Training Guide
              </Typography>

              <Typography variant="body2" sx={{ mb: 2 }}>
                <strong>What is Model Training?</strong><br />
                Custom AI training allows you to create models that understand your specific style, subject, or concept.
              </Typography>

              <Typography variant="body2" sx={{ mb: 2 }}>
                <strong>Training Types:</strong>
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                  LoRA Fine-tuning
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Efficient training for style adaptation and character consistency
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                  DreamBooth
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Subject-specific training for high-fidelity personalization
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                  Full Fine-tuning
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Complete model adaptation for maximum control
                </Typography>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                💡 Best Practices
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ color: 'primary.main', mr: 2, mt: 0.5 }}>•</Box>
                <Typography variant="body2">
                  <strong>Quality over Quantity:</strong> Use high-quality, consistent images
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ color: 'primary.main', mr: 2, mt: 0.5 }}>•</Box>
                <Typography variant="body2">
                  <strong>Diverse Angles:</strong> Include multiple perspectives and lighting conditions
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ color: 'primary.main', mr: 2, mt: 0.5 }}>•</Box>
                <Typography variant="body2">
                  <strong>Clear Subject:</strong> Ensure your main subject is clearly visible in all images
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ color: 'primary.main', mr: 2, mt: 0.5 }}>•</Box>
                <Typography variant="body2">
                  <strong>Consistent Style:</strong> Maintain similar artistic style across training images
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TrainModel;