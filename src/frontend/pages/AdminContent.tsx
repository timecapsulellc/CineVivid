import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tabs,
  Tab,
  Alert,
  Snackbar,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Home,
  Dashboard,
  Build,
  People,
  Payment,
  VideoLibrary,
  Save,
  Restore,
  Backup,
  Edit,
  Delete,
} from '@mui/icons-material';

interface ContentSection {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

interface ContentEditorProps {
  content: any;
  onUpdate: (path: (string | number)[], value: any) => void;
}

const AdminContent: React.FC = () => {
  const [activeSection, setActiveSection] = useState('landing');
  const [content, setContent] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [backupDialog, setBackupDialog] = useState(false);

  const sections: ContentSection[] = [
    { id: 'landing', name: 'Landing Page', icon: <Home />, description: 'Hero section, features, testimonials' },
    { id: 'dashboard', name: 'Dashboard', icon: <Dashboard />, description: 'Welcome message, sample videos, stats' },
    { id: 'tools', name: 'Tools Page', icon: <Build />, description: 'Tool descriptions, categories, ratings' },
    { id: 'pricing', name: 'Pricing', icon: <Payment />, description: 'Plans, features, pricing tiers' },
  ];

  useEffect(() => {
    loadContent();
  }, [activeSection]);

  const loadContent = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/admin/content/${activeSection}`);
      if (response.ok) {
        const data = await response.json();
        setContent(data);
      } else {
        // Load preview content if no custom content exists
        const previewResponse = await fetch(`/content/${activeSection}`);
        if (previewResponse.ok) {
          const data = await previewResponse.json();
          setContent(data);
        }
      }
    } catch (error) {
      console.error('Error loading content:', error);
      setSnackbar({ open: true, message: 'Failed to load content', severity: 'error' });
    }
    setLoading(false);
  };

  const saveContent = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/admin/content/${activeSection}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });

      if (response.ok) {
        setSnackbar({ open: true, message: 'Content saved successfully!', severity: 'success' });
      } else {
        throw new Error('Failed to save content');
      }
    } catch (error) {
      console.error('Error saving content:', error);
      setSnackbar({ open: true, message: 'Failed to save content', severity: 'error' });
    }
    setSaving(false);
  };

  const resetContent = async () => {
    if (!confirm('Are you sure you want to reset this section to defaults? This will delete all custom content.')) {
      return;
    }

    try {
      const response = await fetch(`/admin/content/${activeSection}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSnackbar({ open: true, message: 'Content reset to defaults', severity: 'success' });
        loadContent(); // Reload content
      } else {
        throw new Error('Failed to reset content');
      }
    } catch (error) {
      console.error('Error resetting content:', error);
      setSnackbar({ open: true, message: 'Failed to reset content', severity: 'error' });
    }
  };

  const createBackup = async () => {
    try {
      const response = await fetch('/admin/content/backup', {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        setSnackbar({ open: true, message: `Backup created: ${data.backup_file}`, severity: 'success' });
      } else {
        throw new Error('Failed to create backup');
      }
    } catch (error) {
      console.error('Error creating backup:', error);
      setSnackbar({ open: true, message: 'Failed to create backup', severity: 'error' });
    }
    setBackupDialog(false);
  };

  const updateNestedField = (path: (string | number)[], value: any) => {
    const newContent = { ...content };
    let current = newContent;
    for (let i = 0; i < path.length - 1; i++) {
      const key = path[i];
      if (!current[key]) current[key] = {};
      current = current[key];
    }
    current[path[path.length - 1]] = value;
    setContent(newContent);
  };

  const renderContentEditor = () => {
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      );
    }

    switch (activeSection) {
      case 'landing':
        return <LandingEditor content={content} onUpdate={updateNestedField} />;
      case 'dashboard':
        return <DashboardEditor content={content} onUpdate={updateNestedField} />;
      case 'tools':
        return <ToolsEditor content={content} onUpdate={updateNestedField} />;
      case 'pricing':
        return <PricingEditor content={content} onUpdate={updateNestedField} />;
      default:
        return <Typography>Select a section to edit</Typography>;
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        🎨 Content Management System
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Customize all content areas of your CineVivid platform. Changes are applied immediately.
      </Typography>

      <Grid container spacing={3}>
        {/* Section Navigation */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Content Sections
            </Typography>
            <List>
              {sections.map((section) => (
                <Box
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 2,
                    borderRadius: 1,
                    cursor: 'pointer',
                    bgcolor: activeSection === section.id ? 'action.selected' : 'transparent',
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                >
                  <ListItemIcon sx={{ color: activeSection === section.id ? 'primary.main' : 'inherit' }}>
                    {section.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={section.name}
                    secondary={section.description}
                  />
                </Box>
              ))}
            </List>

            <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h6" gutterBottom>
                System Actions
              </Typography>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Backup />}
                onClick={() => setBackupDialog(true)}
                sx={{ mb: 1 }}
              >
                Create Backup
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Content Editor */}
        <Grid item xs={12} md={9}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h5">
                {sections.find(s => s.id === activeSection)?.name} Editor
              </Typography>
              <Box>
                <Button
                  variant="outlined"
                  startIcon={<Delete />}
                  onClick={resetContent}
                  color="error"
                  sx={{ mr: 1 }}
                >
                  Reset to Defaults
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={saveContent}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </Box>
            </Box>

            {renderContentEditor()}
          </Paper>
        </Grid>
      </Grid>

      {/* Backup Dialog */}
      <Dialog open={backupDialog} onClose={() => setBackupDialog(false)}>
        <DialogTitle>Create Content Backup</DialogTitle>
        <DialogContent>
          <Typography>
            This will create a backup of all your custom content. You can restore from this backup later if needed.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBackupDialog(false)}>Cancel</Button>
          <Button onClick={createBackup} variant="contained">Create Backup</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

// Content Editor Components
const LandingEditor: React.FC<ContentEditorProps> = ({ content, onUpdate }) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>Hero Section</Typography>
      <TextField
        fullWidth
        label="Hero Title"
        value={content.hero?.title || ''}
        onChange={(e) => onUpdate(['hero', 'title'], e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        multiline
        rows={3}
        label="Hero Subtitle"
        value={content.hero?.subtitle || ''}
        onChange={(e) => onUpdate(['hero', 'subtitle'], e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Background Image URL"
        value={content.hero?.background_image || ''}
        onChange={(e) => onUpdate(['hero', 'background_image'], e.target.value)}
        sx={{ mb: 3 }}
      />

      <Typography variant="h6" gutterBottom>Features</Typography>
      {content.features?.map((feature: any, index: number) => (
        <Card key={index} sx={{ mb: 2, p: 2 }}>
          <TextField
            fullWidth
            label="Feature Title"
            value={feature.title || ''}
            onChange={(e) => onUpdate(['features', index, 'title'], e.target.value)}
            sx={{ mb: 1 }}
          />
          <TextField
            fullWidth
            multiline
            label="Feature Description"
            value={feature.description || ''}
            onChange={(e) => onUpdate(['features', index, 'description'], e.target.value)}
          />
        </Card>
      ))}
    </Box>
  );
};

const DashboardEditor: React.FC<{ content: any; onUpdate: (path: string[], value: any) => void }> = ({ content, onUpdate }) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>Dashboard Settings</Typography>
      <TextField
        fullWidth
        label="Welcome Message"
        value={content.welcome_message || ''}
        onChange={(e) => onUpdate(['welcome_message'], e.target.value)}
        sx={{ mb: 3 }}
      />

      <Typography variant="h6" gutterBottom>Sample Videos</Typography>
      {content.sample_videos?.map((video: any, index: number) => (
        <Card key={index} sx={{ mb: 2, p: 2 }}>
          <TextField
            fullWidth
            label="Video Title"
            value={video.title || ''}
            onChange={(e) => onUpdate(['sample_videos', index.toString(), 'title'], e.target.value)}
            sx={{ mb: 1 }}
          />
          <TextField
            fullWidth
            label="Thumbnail URL"
            value={video.thumbnail || ''}
            onChange={(e) => onUpdate(['sample_videos', index.toString(), 'thumbnail'], e.target.value)}
          />
        </Card>
      ))}
    </Box>
  );
};

const ToolsEditor: React.FC<{ content: any; onUpdate: (path: string[], value: any) => void }> = ({ content, onUpdate }) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>Tools Page Settings</Typography>
      <TextField
        fullWidth
        label="Page Title"
        value={content.page_title || ''}
        onChange={(e) => onUpdate(['page_title'], e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Page Subtitle"
        value={content.page_subtitle || ''}
        onChange={(e) => onUpdate(['page_subtitle'], e.target.value)}
        sx={{ mb: 3 }}
      />

      <Typography variant="h6" gutterBottom>Tools</Typography>
      {content.tools?.map((tool: any, index: number) => (
        <Card key={index} sx={{ mb: 2, p: 2 }}>
          <TextField
            fullWidth
            label="Tool Title"
            value={tool.title || ''}
            onChange={(e) => onUpdate(['tools', index.toString(), 'title'], e.target.value)}
            sx={{ mb: 1 }}
          />
          <TextField
            fullWidth
            multiline
            label="Tool Description"
            value={tool.description || ''}
            onChange={(e) => onUpdate(['tools', index.toString(), 'description'], e.target.value)}
            sx={{ mb: 1 }}
          />
          <TextField
            fullWidth
            label="Image URL"
            value={tool.image || ''}
            onChange={(e) => onUpdate(['tools', index.toString(), 'image'], e.target.value)}
          />
        </Card>
      ))}
    </Box>
  );
};

const PricingEditor: React.FC<{ content: any; onUpdate: (path: string[], value: any) => void }> = ({ content, onUpdate }) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>Pricing Page Settings</Typography>
      <TextField
        fullWidth
        label="Page Title"
        value={content.title || ''}
        onChange={(e) => onUpdate(['title'], e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Page Subtitle"
        value={content.subtitle || ''}
        onChange={(e) => onUpdate(['subtitle'], e.target.value)}
        sx={{ mb: 3 }}
      />

      <Typography variant="h6" gutterBottom>Pricing Tiers</Typography>
      {Object.entries(content.tiers || {}).map(([tierKey, tier]: [string, any]) => (
        <Card key={tierKey} sx={{ mb: 2, p: 2 }}>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
            {tier.name} ({tierKey})
          </Typography>
          <TextField
            label="Price"
            type="number"
            value={tier.price || 0}
            onChange={(e) => onUpdate(['tiers', tierKey, 'price'], parseFloat(e.target.value))}
            sx={{ mr: 2, width: 100 }}
          />
          <TextField
            label="Credits"
            type="number"
            value={tier.credits || 0}
            onChange={(e) => onUpdate(['tiers', tierKey, 'credits'], parseInt(e.target.value))}
            sx={{ width: 100 }}
          />
        </Card>
      ))}
    </Box>
  );
};

export default AdminContent;