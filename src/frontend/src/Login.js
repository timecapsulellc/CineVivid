import { useState } from 'react';
import axios from 'axios';

export default function Login({ setToken }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post('/token', new URLSearchParams({
      username: email,
      password: password,
    }));
    setToken(response.data.access_token);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Login</button>
    </form>
  );
}
