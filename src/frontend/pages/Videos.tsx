/**
 * Videos Page Component
 * Display user's generated videos with management features
 */
import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  LinearProgress,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  PlayArrow,
  Download,
  Delete,
  Refresh,
  FilterList,
  Search,
  Visibility,
  Share,
  Edit
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { apiClient, Video } from '../services/api';

const Videos: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const { user, refreshCredits } = useAuth();

  useEffect(() => {
    loadVideos();
  }, [page, statusFilter]);

  useEffect(() => {
    // Auto-refresh for processing videos
    const hasProcessing = videos.some(v => v.status === 'processing' || v.status === 'pending');
    
    if (hasProcessing) {
      const interval = setInterval(() => {
        loadVideos(false); // Don't show loading spinner for auto-refresh
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [videos]);

  const loadVideos = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      setError('');

      const response = await apiClient.getVideos({
        status: statusFilter,
        page,
        per_page: 12
      });

      setVideos(response.videos);
      setTotalPages(Math.ceil(response.total / 12));

    } catch (err: any) {
      setError(apiClient.handleError(err));
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadVideos();
    refreshCredits();
  };

  const handlePreview = (video: Video) => {
    setSelectedVideo(video);
    setPreviewOpen(true);
  };

  const handleDownload = (video: Video) => {
    if (video.output_url) {
      const fullUrl = apiClient.getVideoUrl(video.output_url);
      window.open(fullUrl, '_blank');
    }
  };

  const getStatusColor = (status: string): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    switch (status) {
      case 'completed': return 'success';
      case 'processing': return 'primary';
      case 'pending': return 'info';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
      case 'pending':
        return <CircularProgress size={16} />;
      default:
        return null;
    }
  };

  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (video.prompt && video.prompt.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          📹 My Videos
        </Typography>
        <Button
          variant="contained"
          startIcon={<Refresh />}
          onClick={handleRefresh}
        >
          Refresh
        </Button>
      </Box>

      {/* User Credits */}
      {user && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            Welcome back, <strong>{user.username}</strong>! 
            You have <strong>{user.credits} credits</strong> remaining.
            {videos.length > 0 && ` You've generated ${videos.length} videos.`}
          </Typography>
        </Alert>
      )}

      {/* Filters */}
      <Box mb={3}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search videos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Status Filter</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Status Filter"
              >
                <MenuItem value="all">All Videos</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="processing">Processing</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="failed">Failed</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography variant="body2" color="text.secondary">
              {filteredVideos.length} of {videos.length} videos
            </Typography>
          </Grid>
        </Grid>
      </Box>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Loading */}
      {loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Videos Grid */}
          {filteredVideos.length === 0 ? (
            <Box textAlign="center" py={8}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {videos.length === 0 ? "No videos yet" : "No videos match your filters"}
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                {videos.length === 0 
                  ? "Start creating amazing AI videos with our tools" 
                  : "Try adjusting your search or filter criteria"
                }
              </Typography>
              <Button variant="contained" href="/">
                Create Your First Video
              </Button>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {filteredVideos.map((video) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={video.id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    {/* Video Thumbnail/Preview */}
                    <Box sx={{ position: 'relative', paddingTop: '56.25%' /* 16:9 aspect ratio */ }}>
                      {video.output_url ? (
                        <CardMedia
                          component="video"
                          src={apiClient.getVideoUrl(video.output_url)}
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                          controls={false}
                        />
                      ) : (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: 'grey.100',
                            color: 'text.secondary'
                          }}
                        >
                          {video.status === 'processing' || video.status === 'pending' ? (
                            <Box textAlign="center">
                              <CircularProgress size={40} />
                              <Typography variant="body2" mt={1}>
                                {video.status === 'processing' ? 'Generating...' : 'Queued'}
                              </Typography>
                            </Box>
                          ) : (
                            <Typography variant="body2">
                              {video.status === 'failed' ? 'Generation Failed' : 'No Preview'}
                            </Typography>
                          )}
                        </Box>
                      )}

                      {/* Status Badge */}
                      <Chip
                        label={video.status}
                        color={getStatusColor(video.status)}
                        size="small"
                        icon={getStatusIcon(video.status)}
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          bgcolor: 'rgba(255, 255, 255, 0.9)'
                        }}
                      />

                      {/* Play Button Overlay */}
                      {video.output_url && (
                        <IconButton
                          sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            bgcolor: 'rgba(0, 0, 0, 0.6)',
                            color: 'white',
                            '&:hover': {
                              bgcolor: 'rgba(0, 0, 0, 0.8)'
                            }
                          }}
                          onClick={() => handlePreview(video)}
                        >
                          <PlayArrow sx={{ fontSize: 32 }} />
                        </IconButton>
                      )}
                    </Box>

                    {/* Video Info */}
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" component="div" gutterBottom noWrap>
                        {video.title}
                      </Typography>
                      
                      {video.prompt && (
                        <Typography variant="body2" color="text.secondary" sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          mb: 1
                        }}>
                          {video.prompt}
                        </Typography>
                      )}

                      <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(video.created_at).toLocaleDateString()}
                        </Typography>
                        {video.cost_credits && (
                          <Chip
                            label={`${video.cost_credits} credits`}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Box>

                      {/* Progress bar for processing videos */}
                      {(video.status === 'processing' || video.status === 'pending') && (
                        <Box mt={2}>
                          <LinearProgress 
                            variant="determinate" 
                            value={video.progress} 
                            sx={{ mb: 1 }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {video.progress}% complete
                          </Typography>
                        </Box>
                      )}
                    </CardContent>

                    {/* Actions */}
                    <CardActions>
                      {video.output_url ? (
                        <>
                          <Tooltip title="Preview">
                            <IconButton 
                              size="small" 
                              onClick={() => handlePreview(video)}
                              color="primary"
                            >
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Download">
                            <IconButton 
                              size="small" 
                              onClick={() => handleDownload(video)}
                              color="primary"
                            >
                              <Download />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Share">
                            <IconButton 
                              size="small" 
                              color="primary"
                            >
                              <Share />
                            </IconButton>
                          </Tooltip>
                        </>
                      ) : (
                        <Typography variant="caption" color="text.secondary">
                          {video.status === 'failed' ? 'Generation failed' : 'Processing...'}
                        </Typography>
                      )}
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
              />
            </Box>
          )}
        </>
      )}

      {/* Video Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedVideo?.title}
          <IconButton
            sx={{ position: 'absolute', right: 8, top: 8 }}
            onClick={() => setPreviewOpen(false)}
          >
            ×
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedVideo?.output_url && (
            <video
              width="100%"
              height="auto"
              controls
              autoPlay
              src={apiClient.getVideoUrl(selectedVideo.output_url)}
              style={{ borderRadius: '8px' }}
            />
          )}
          
          {selectedVideo?.prompt && (
            <Box mt={2}>
              <Typography variant="subtitle2" gutterBottom>
                Original Prompt:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedVideo.prompt}
              </Typography>
            </Box>
          )}

          <Box mt={2}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">
                  Status: <Chip label={selectedVideo?.status} color={getStatusColor(selectedVideo?.status || '')} size="small" />
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">
                  Created: {selectedVideo && new Date(selectedVideo.created_at).toLocaleString()}
                </Typography>
              </Grid>
              {selectedVideo?.duration && (
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Duration: {selectedVideo.duration}s
                  </Typography>
                </Grid>
              )}
              {selectedVideo?.cost_credits && (
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Cost: {selectedVideo.cost_credits} credits
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          {selectedVideo?.output_url && (
            <>
              <Button 
                startIcon={<Download />}
                onClick={() => selectedVideo && handleDownload(selectedVideo)}
              >
                Download
              </Button>
              <Button 
                startIcon={<Share />}
                variant="outlined"
              >
                Share
              </Button>
            </>
          )}
          <Button onClick={() => setPreviewOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );

  
};

export default Videos;