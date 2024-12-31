import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Callback = () => {
  const navigate = useNavigate();
  const hasFetched = useRef(false); // Track if the effect has run

  useEffect(() => {
    if (hasFetched.current) return; // Prevent duplicate execution

    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (code) {
      hasFetched.current = true; // Set the flag to true after execution
      axios
        .post('http://localhost:5000/api/spotify/callback', { code })
        .then((response) => {
          console.log({ 'response data': response.data });
          localStorage.setItem('spotify_access_token', response.data.access_token);
          navigate('/'); // Redirect to home page
        })
        .catch((error) => {
          console.error('Error during OAuth callback:', error);
        });
    }
  }, [navigate]);

  return <div>Loading...</div>;
};

export default Callback;
