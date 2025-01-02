import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Callback = () => {
  const navigate = useNavigate();
  const hasFetched = useRef(false); // Track if the effect has run
  const domainUrl = import.meta.env.VITE_DOMAIN_URL || 'http://localhost:5000';

  useEffect(() => {
    if (hasFetched.current) return; // Prevent duplicate execution

    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (code) {
      hasFetched.current = true; // Set the flag to true after execution
      axios
        .post(domainUrl+'/api/spotify/callback', { code })
        .then((response) => {
          console.log({ 'response data': response.data });

          // Extract token and expiration time
          const { access_token, expires_in, app_token, app_token_expiration, refresh_token, app_refresh_token } = response.data;

          // Calculate expiration timestamp
          const expirationTime = Math.floor(( new Date().getTime() + expires_in ) / 1000);//convert to seconds so it is standardized with the other timestamps

          // Store token and expiration in localStorage
          localStorage.setItem('spotify_access_token', access_token);
          localStorage.setItem('spotify_refresh_token', refresh_token);
          localStorage.setItem('spotify_token_expiration', expirationTime.toString());

          localStorage.setItem('app_token', app_token);
          localStorage.setItem('app_token_expiration', app_token_expiration);
          localStorage.setItem('app_refresh_token', app_refresh_token);
          
          // Redirect to home page
          navigate('/');
        })
        .catch((error) => {
          console.error('Error during OAuth callback:', error);
        });
    }
  }, [navigate]);

  return <div>Loading...</div>;
};

export default Callback;
