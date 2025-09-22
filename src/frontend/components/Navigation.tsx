import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Button,
  Menu,
  MenuItem,
  Box,
  Typography,
  IconButton,
  Avatar,
  Chip,
  Container,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  KeyboardArrowDown,
  VideoLibrary,
  Image,
  Mic,
  Movie,
  SmartToy,
  PlayArrow,
  AccountCircle,
  Settings,
  Logout,
  Home,
} from '@mui/icons-material';

const Navigation: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [userMenuAnchor, setUserMenuAnchor] = React.useState<null | HTMLElement>(null);
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleToolsMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const toolsItems = [
    {
      text: 'Text to Video',
      path: '/home/tools/to-video',
      icon: <VideoLibrary sx={{ mr: 1, fontSize: 18 }} />,
      description: 'Transform ideas into vibrant videos',
      popular: true
    },
    {
      text: 'Image to Video',
      path: '/home/tools/image-to-video',
      icon: <Image sx={{ mr: 1, fontSize: 18 }} />,
      description: 'Animate static images',
      popular: true
    },
    {
      text: 'Talking Avatar',
      path: '/home/tools/talking-avatar',
      icon: <PlayArrow sx={{ mr: 1, fontSize: 18 }} />,
      description: 'Create animated avatars that speak',
      popular: true
    },
    {
      text: 'Lip Sync',
      path: '/home/tools/lip-sync',
      icon: <Mic sx={{ mr: 1, fontSize: 18 }} />,
      description: 'Sync audio with video',
      popular: false
    },
    {
      text: 'Text to Image',
      path: '/home/tools/text2image',
      icon: <Image sx={{ mr: 1, fontSize: 18 }} />,
      description: 'Generate images from text',
      popular: false
    },
    {
      text: 'Short Film Creator',
      path: '/home/short-film',
      icon: <Movie sx={{ mr: 1, fontSize: 18 }} />,
      description: 'Craft complete short films',
      popular: false
    },
    {
      text: 'LoRA Models',
      path: '/home/tools/lora-list',
      icon: <SmartToy sx={{ mr: 1, fontSize: 18 }} />,
      description: 'Browse custom-trained models',
      popular: false
    },
  ];

  const navItems = [
    { text: 'Home', path: '/', icon: <Home sx={{ mr: 1 }} /> },
    { text: 'My Library', path: '/home/my-library', icon: <VideoLibrary sx={{ mr: 1 }} /> },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid',
        borderColor: 'grey.200',
        color: 'text.primary',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 0, md: 2 } }}>
          {/* Logo and Brand */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{
                fontWeight: 800,
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textDecoration: 'none',
                mr: 3,
                fontSize: { xs: '1.1rem', md: '1.25rem' },
              }}
            >
              CineVivid
            </Typography>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                {navItems.map((item) => (
                  <Button
                    key={item.text}
                    component={Link}
                    to={item.path}
                    sx={{
                      color: isActive(item.path) ? 'primary.main' : 'text.primary',
                      fontWeight: isActive(item.path) ? 600 : 500,
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      '&:hover': {
                        backgroundColor: 'grey.50',
                      },
                    }}
                  >
                    {item.icon}
                    {item.text}
                  </Button>
                ))}

                {/* Tools Dropdown */}
                <Button
                  onClick={handleToolsMenu}
                  sx={{
                    color: 'text.primary',
                    fontWeight: 500,
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    '&:hover': {
                      backgroundColor: 'grey.50',
                    },
                  }}
                  endIcon={<KeyboardArrowDown />}
                >
                  Tools
                </Button>
              </Box>
            )}
          </Box>

          {/* Right Side Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Credits Chip */}
            <Chip
              label="100 Credits"
              size="small"
              sx={{
                backgroundColor: 'primary.main',
                color: 'white',
                fontWeight: 600,
                display: { xs: 'none', md: 'flex' },
              }}
            />

            {/* Create Button */}
            <Button
              variant="contained"
              component={Link}
              to="/home/tools/to-video"
              sx={{
                px: 3,
                py: 1.5,
                borderRadius: 3,
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                '&:hover': {
                  boxShadow: '0 6px 16px rgba(99, 102, 241, 0.4)',
                },
              }}
            >
              Create
            </Button>

            {/* User Menu */}
            <IconButton
              onClick={handleUserMenu}
              sx={{
                ml: 1,
                border: '2px solid',
                borderColor: 'grey.200',
                '&:hover': {
                  borderColor: 'primary.main',
                },
              }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: 'primary.main',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                }}
              >
                U
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </Container>

      {/* Tools Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 320,
            borderRadius: 3,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            border: '1px solid',
            borderColor: 'grey.200',
          },
        }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'grey.200' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            AI Tools
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Choose from our collection of AI-powered tools
          </Typography>
        </Box>

        {toolsItems.map((item, index) => (
          <MenuItem
            key={item.text}
            onClick={handleClose}
            component={Link}
            to={item.path}
            sx={{
              py: 2,
              px: 3,
              borderBottom: index < toolsItems.length - 1 ? '1px solid' : 'none',
              borderColor: 'grey.100',
              '&:hover': {
                backgroundColor: 'grey.50',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <Box sx={{ mr: 2, color: 'primary.main' }}>
                {item.icon}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {item.text}
                  </Typography>
                  {item.popular && (
                    <Chip
                      label="Popular"
                      size="small"
                      sx={{
                        height: 18,
                        fontSize: '0.7rem',
                        backgroundColor: 'secondary.main',
                        color: 'white',
                      }}
                    />
                  )}
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {item.description}
                </Typography>
              </Box>
            </Box>
          </MenuItem>
        ))}
      </Menu>

      {/* User Menu */}
      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleUserMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 200,
            borderRadius: 3,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          },
        }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'grey.200' }}>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            User Name
          </Typography>
          <Typography variant="body2" color="text.secondary">
            user@example.com
          </Typography>
        </Box>

        <MenuItem onClick={handleUserMenuClose} sx={{ py: 1.5 }}>
          <AccountCircle sx={{ mr: 2, fontSize: 20 }} />
          Profile
        </MenuItem>

        <MenuItem onClick={handleUserMenuClose} sx={{ py: 1.5 }}>
          <Settings sx={{ mr: 2, fontSize: 20 }} />
          Settings
        </MenuItem>

        <MenuItem onClick={handleUserMenuClose} sx={{ py: 1.5 }}>
          <VideoLibrary sx={{ mr: 2, fontSize: 20 }} />
          My Library
        </MenuItem>

        <Box sx={{ borderTop: '1px solid', borderColor: 'grey.200', mt: 1 }}>
          <MenuItem onClick={handleUserMenuClose} sx={{ py: 1.5, color: 'error.main' }}>
            <Logout sx={{ mr: 2, fontSize: 20 }} />
            Sign Out
          </MenuItem>
        </Box>
      </Menu>
    </AppBar>
  );
};

export default Navigation;