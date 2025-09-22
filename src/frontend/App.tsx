import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { theme } from './styles/theme';
import Navigation from './components/Navigation';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import ToVideo from './pages/ToVideo';
import AllTools from './pages/AllTools';
import LipSync from './pages/LipSync';
import TextToImage from './pages/TextToImage';
// import LoraList from './pages/LoraList';
import ShortFilm from './pages/ShortFilm';
import AdminDashboard from './pages/AdminDashboard';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/home/*" element={
              <>
                <Navigation />
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/my-library" element={<Dashboard />} />
                  <Route path="/tools/all" element={<AllTools />} />
                  <Route path="/tools/to-video" element={<ToVideo />} />
                  <Route path="/tools/lip-sync" element={<LipSync />} />
                  <Route path="/tools/text2image" element={<TextToImage />} />
                  {/* <Route path="/tools/lora-list" element={<LoraList />} /> */}
                  <Route path="/short-film" element={<ShortFilm />} />
                </Routes>
              </>
            } />
            <Route path="/admin" element={
              <>
                <Navigation />
                <AdminDashboard />
              </>
            } />
          </Routes>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App;