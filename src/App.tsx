import { useState, useEffect } from 'react';
import TopTracks from './TopTracks';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Check if access token exists in localStorage
  useEffect(() => {
    const token = localStorage.getItem('spotify_access_token');
    console.log({'token': token});
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogin = () => {
    // Redirect the user to your backend's Spotify login route
    window.location.href = 'http://localhost:5000/login';
  };

  return (
    <div>
      <h1>Welcome to Music Elo!</h1>
      <p>This is the home page of the app.</p>

      {isLoggedIn ? (
        <div>
          <p>You are logged in with Spotify!</p>
          {/* You can add more Spotify-related features here */}
          <TopTracks />
        </div>
      ) : (
        <button onClick={handleLogin} style={{ padding: '10px 20px', fontSize: '16px' }}>
          Login with Spotify
        </button>
      )}
    </div>
  );
};

export default App;
