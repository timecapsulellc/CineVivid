import { useState } from 'react';
import axios from 'axios';

export default function Dashboard({ token }) {
  const [t2vPrompt, setT2vPrompt] = useState('');
  const [i2vPrompt, setI2vPrompt] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [status, setStatus] = useState('');
  const [voiceoverText, setVoiceoverText] = useState('');
  const [voiceId, setVoiceId] = useState('21m00Tcm4TlvDq8ikWAM'); // Default voice
  const [videoFile, setVideoFile] = useState(null);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(0);
  const [fadeIn, setFadeIn] = useState(0);
  const [fadeOut, setFadeOut] = useState(0);
  const [editedVideoPath, setEditedVideoPath] = useState('');

  const authHeaders = { Authorization: `Bearer ${token}` };

  const handleT2vGenerate = async (e) => {
    e.preventDefault();
    const res = await axios.post('/api/t2v', { 
      prompt: t2vPrompt, 
      voiceover_text: voiceoverText, 
      voice_id: voiceId 
    }, { headers: authHeaders });
    setStatus(`T2V Task ${res.data.task_id} submitted.`);
  };

  const handleI2vGenerate = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      setStatus('Please select an image file.');
      return;
    }
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('prompt', i2vPrompt);
    formData.append('voiceover_text', voiceoverText);
    formData.append('voice_id', voiceId);

    const res = await axios.post('/api/i2v', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...authHeaders,
      },
    });
    setStatus(`I2V Task ${res.data.task_id} submitted.`);
  };

  const handleEnhancePrompt = async (prompt, setPrompt) => {
    const res = await axios.post('/api/enhance', { prompt }, { headers: authHeaders });
    setPrompt(res.data.enhanced_prompt);
  };

  const handleEditVideo = async (e) => {
    e.preventDefault();
    if (!videoFile) {
      setStatus('Please select a video file.');
      return;
    }
    const formData = new FormData();
    formData.append('file', videoFile);
    formData.append('trim_start', trimStart);
    formData.append('trim_end', trimEnd);
    formData.append('fade_in', fadeIn);
    formData.append('fade_out', fadeOut);

    const res = await axios.post('/api/edit', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...authHeaders,
      },
    });
    setEditedVideoPath(res.data.path);
  };

  return (
    <div className="bg-neutral-dark text-white p-4">
      <h1 className="font-poppins text-2xl">CineVivid</h1>

      <h2>Text-to-Video</h2>
      <form onSubmit={handleT2vGenerate}>
        <textarea className="bg-gray-800 text-white" value={t2vPrompt} onChange={e => setT2vPrompt(e.target.value)} />
        <button type="button" onClick={() => handleEnhancePrompt(t2vPrompt, setT2vPrompt)}>Enhance Prompt</button>
        <br />
        <textarea placeholder="Voiceover Text" className="bg-gray-800 text-white" value={voiceoverText} onChange={e => setVoiceoverText(e.target.value)} />
        <select value={voiceId} onChange={e => setVoiceId(e.target.value)}>
          <option value="21m00Tcm4TlvDq8ikWAM">Rachel</option>
          <option value="29vD33N1CtxCmqQRPOHJ">Drew</option>
          <option value="5Q0t7uMcjvnagumLfvZi">Clyde</option>
        </select>
        <button className="bg-primary" type="submit">Generate T2V</button>
        {status && <p>{status}</p>}
      </form>

      <h2>Image-to-Video</h2>
      <form onSubmit={handleI2vGenerate}>
        <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} />
        <textarea className="bg-gray-800 text-white" value={i2vPrompt} onChange={e => setI2vPrompt(e.target.value)} />
        <button type="button" onClick={() => handleEnhancePrompt(i2vPrompt, setI2vPrompt)}>Enhance Prompt</button>
        <br />
        <textarea placeholder="Voiceover Text" className="bg-gray-800 text-white" value={voiceoverText} onChange={e => setVoiceoverText(e.target.value)} />
        <select value={voiceId} onChange={e => setVoiceId(e.target.value)}>
          <option value="21m00Tcm4TlvDq8ikWAM">Rachel</option>
          <option value="29vD33N1CtxCmqQRPOHJ">Drew</option>
          <option value="5Q0t7uMcjvnagumLfvZi">Clyde</option>
        </select>
        <button className="bg-primary" type="submit">Generate I2V</button>
        {status && <p>{status}</p>}
      </form>

      <h2>Video Editing</h2>
      <form onSubmit={handleEditVideo}>
        <input type="file" accept="video/*" onChange={e => setVideoFile(e.target.files[0])} />
        <br />
        <label>Trim Start:</label>
        <input type="number" value={trimStart} onChange={e => setTrimStart(e.target.value)} />
        <label>Trim End:</label>
        <input type="number" value={trimEnd} onChange={e => setTrimEnd(e.target.value)} />
        <br />
        <label>Fade In:</label>
        <input type="number" value={fadeIn} onChange={e => setFadeIn(e.target.value)} />
        <label>Fade Out:</label>
        <input type="number" value={fadeOut} onChange={e => setFadeOut(e.target.value)} />
        <br />
        <button className="bg-primary" type="submit">Edit Video</button>
        {editedVideoPath && <p>Edited video path: {editedVideoPath}</p>}
      </form>
    </div>
  );
}
