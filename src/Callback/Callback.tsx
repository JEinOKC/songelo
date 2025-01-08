import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from '../state/AuthStateContext';
import axios from 'axios';

const Callback = () => {
  // const { isLoggedIn, setIsLoggedIn, handleLogin, refreshAppToken, refreshSpotifyToken } = useAuthState();
  const { confirmSpotifyLoginCode } = useAuthState();
  const navigate = useNavigate();
  const hasFetched = useRef(false); // Track if the effect has run
  const domainUrl = import.meta.env.VITE_DOMAIN_URL || 'http://localhost:5000';

  useEffect(() => {
    if (hasFetched.current) return; // Prevent duplicate execution

    const fetchData = async () =>{
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      if (code) {
        hasFetched.current = true; // Set the flag to true after execution
        await confirmSpotifyLoginCode(code);

        navigate('/');
      }
    }

    fetchData();
    
  }, [navigate]);

  return <div>Loading...</div>;
};

export default Callback;