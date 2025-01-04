import { useState, useEffect } from 'react';
import TopTracks from './TopTracks';
import SongeloPlaylistsDropdown from './SongeloPlaylistsDropdown';
import ListSongeloPlaylistSongs from './ListSongeloPlaylistSongs';
import { useAppState } from './AppStateContext';


const App = () => {
  const { isLoggedIn, setIsLoggedIn, selectedPlaylist } = useAppState();

  const refreshAppTokenTmp = async () => {
    const appRefreshToken = localStorage.getItem('app_refresh_token');
    const response = await fetch(`${import.meta.env.VITE_DOMAIN_URL}/api/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: appRefreshToken }),
    });

    const data = await response.json();
    console.log({'app token data': data});
    localStorage.setItem('app_token', data.app_token);
    localStorage.setItem('app_token_expiration', data.app_token_expiration);
  };

  useEffect(() => {
    const token = localStorage.getItem('spotify_access_token');
    const expiration = localStorage.getItem('spotify_token_expiration');
    const refreshToken = localStorage.getItem('spotify_refresh_token');
    const appToken = localStorage.getItem('app_token');
    const appTokenExpiration = localStorage.getItem('app_token_expiration');
    const appRefreshToken = localStorage.getItem('app_refresh_token');

    const refreshSpotifyToken = async () => {
      // const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
      // const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
      // const authString = btoa(`${clientId}:${clientSecret}`);

      // const response = await fetch('https://accounts.spotify.com/api/token', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/x-www-form-urlencoded',
      //     'Authorization': `Basic ${authString}`,
      //   },
      //   body: new URLSearchParams({
      //     grant_type: 'refresh_token',
      //     refresh_token: refreshToken || '',
      //   }),
      // });

      // const data = await response.json();
      // const expirationTime = new Date().getTime() + data.expires_in;
      
      // localStorage.setItem('spotify_access_token', data.access_token);
      // localStorage.setItem('spotify_token_expiration', expirationTime.toString());
    };

    const refreshAppToken = async () => {
      const response = await fetch(`${import.meta.env.VITE_DOMAIN_URL}/api/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: appRefreshToken }),
      });

      const data = await response.json();
      
      localStorage.setItem('app_token', data.access_token);
      localStorage.setItem('app_token_expiration', (new Date().getTime() + data.expires_in).toString());
    };

    const isTokenExpired = (serverTimestamp: number): boolean => {
      const serverExpiration = serverTimestamp * 1000; // Convert to milliseconds
      const currentTime = new Date().getTime(); // Already in milliseconds

      return currentTime >= serverExpiration;
    };

    const checkTokens = async () => {
      const isSpotifyTokenExpired = !token || !expiration || token && expiration && isTokenExpired(parseInt(expiration, 10));
      const isAppTokenExpired = !appToken || !appTokenExpiration || appToken && appTokenExpiration && isTokenExpired(parseInt(appTokenExpiration, 10));

      if (isSpotifyTokenExpired && refreshToken) {
        await refreshSpotifyToken();
      }

      if (isAppTokenExpired && appRefreshToken) {
        await refreshAppToken();
      }

      if (!isSpotifyTokenExpired && !isAppTokenExpired) {
        console.log('setting login flag as true');
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    };

    checkTokens();
  }, []);

  const handleLogin = () => {
    const domainUrl = import.meta.env.VITE_DOMAIN_URL || 'http://localhost:5000';
    const loginUrl = `${domainUrl}/login`;
    window.location.href = loginUrl;
  };

  return (
    <div>
      <h1>Welcome to Songelo!</h1>
      <p>This is the home page of the app.</p>
      {isLoggedIn ? (
        <div>
          <p>You are logged in with Spotify!</p>
          <button onClick={refreshAppTokenTmp} style={{ padding: '10px 20px', fontSize: '16px' }}>
            Refresh App Token
          </button>
          {selectedPlaylist && <TopTracks onSongAdded={() => { /* handle song added */ }} />}
          <SongeloPlaylistsDropdown />

          {selectedPlaylist && (
            <>
              <ListSongeloPlaylistSongs playlistId={selectedPlaylist} />
            </>
          )}
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
