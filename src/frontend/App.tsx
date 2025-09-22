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
import GenerateDrama from './pages/GenerateDrama';
import TrainModel from './pages/TrainModel';
// import LoraList from './pages/LoraList';
import ShortFilm from './pages/ShortFilm';
import TalkingAvatar from './pages/TalkingAvatar';
import Templates from './pages/Templates';
import VideoEditor from './pages/VideoEditor';
import AdminDashboard from './pages/AdminDashboard';
import AdminContent from './pages/AdminContent';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
          <Navigation />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/home/my-library" element={<Dashboard />} />
            <Route path="/home/tools/all" element={<AllTools />} />
            <Route path="/home/tools/to-video" element={<ToVideo />} />
            <Route path="/home/tools/lip-sync" element={<LipSync />} />
            <Route path="/home/tools/text2image" element={<TextToImage />} />
            <Route path="/home/generate-drama" element={<GenerateDrama />} />
            <Route path="/home/tools/train-model" element={<TrainModel />} />
            {/* <Route path="/home/tools/lora-list" element={<LoraList />} /> */}
            <Route path="/home/tools/talking-avatar" element={<TalkingAvatar />} />
            <Route path="/home/templates" element={<Templates />} />
            <Route path="/home/tools/video-editor" element={<VideoEditor />} />
            <Route path="/home/short-film" element={<ShortFilm />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/content" element={<AdminContent />} />
          </Routes>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App;