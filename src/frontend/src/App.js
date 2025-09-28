import { useState, useEffect } from 'react';
import axios from 'axios';
import Dashboard from './Dashboard';
import Login from './Login';
import Register from './Register';

function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        const response = await axios.get('/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      }
    };
    fetchUser();
  }, [token]);

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  if (!token) {
    return (
      <div>
        <Login setToken={setToken} />
        <Register />
      </div>
    );
  }

  return (
    <div className="App">
      <button onClick={logout}>Logout</button>
      {user && <p>Credits: {user.credits}</p>}
      <Dashboard token={token} />
    </div>
  );
}

export default App;
