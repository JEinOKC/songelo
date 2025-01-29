import { createContext, useContext, ReactNode } from 'react';
import axios from 'axios';
import { AuthState } from '../types/interfaces';
import useStateWithLocalStorage from './useStateWithLocalStorage';



const AuthStateContext = createContext<AuthState | undefined>(undefined);

export const AuthStateProvider = ({ children }: { children: ReactNode }) => {
	const [isLoggedIn, setIsLoggedIn] = useStateWithLocalStorage('isLoggedIn',false);//this goes first because the tokens used later can change this value
	const [spotifyToken,setSpotifyToken] = useStateWithLocalStorage('spotifyToken','');
	const [spotifyRefreshToken,setSpotifyRefreshToken] = useStateWithLocalStorage('spotifyRefreshToken','');
	const [spotifyTokenExpiration,setSpotifyTokenExpiration] = useStateWithLocalStorage('spotifyTokenExpiration',0);
	const [appToken,setAppToken] = useStateWithLocalStorage('appToken','');
	const [appRefreshToken,setAppRefreshToken] = useStateWithLocalStorage('appRefreshToken','');
	const [appTokenExpiration, setAppTokenExpiration] = useStateWithLocalStorage('appTokenExpiration',0);

	const needReLogin = (): boolean => {
		if(appToken === '' || appRefreshToken === '' || spotifyToken === '' || spotifyRefreshToken === '' ){
			return true;

		}
		return false;
	};
	
	const handleLogin = () => {
		const domainUrl = import.meta.env.VITE_DOMAIN_URL || 'http://localhost:5000';
		const loginUrl = `${domainUrl}/login`;
		window.location.href = loginUrl;
	};

	const isTokenExpired = (expiration:number): boolean => {
		expiration = expiration * 1000;
		if (expiration) {
			return Date.now() > expiration; // Compare current time with expiration time
		}
		return true; // If no expiration time is found, consider it expired
	};

	//function that handles the callback of the spotify login, gathers a token and logs them into our system
	const confirmSpotifyLoginCode = async (code:string) => {
		const domainUrl = import.meta.env.VITE_DOMAIN_URL || 'http://localhost:5000';
		axios
        .post(domainUrl+'/api/spotify/callback', { code })
        .then((response) => {
			// Extract token and expiration time
			const { access_token, expires_in, app_token, app_token_expiration, refresh_token, app_refresh_token } = response.data;

			// Calculate expiration timestamp
			const expirationTime = Math.floor(new Date().getTime() / 1000) + expires_in;//convert to seconds so it is standardized with the other timestamps

			//store spotify token information
			setSpotifyToken(access_token);
			setSpotifyRefreshToken(refresh_token);
			setSpotifyTokenExpiration(expirationTime);

			//store app token information
			setAppToken(app_token);
			setAppRefreshToken(app_refresh_token);
			setAppTokenExpiration(app_token_expiration);

			//we are all logged in
			setIsLoggedIn(true);
          
        })
        .catch((error) => {
          console.error('Error during OAuth callback:', error);
		  setIsLoggedIn(false);
        });
	}

	// Function to refresh app token
	const refreshAppToken = async () => {
		// const appRefreshToken = localStorage.getItem('app_refresh_token');

		try {
			const response = await fetch(`${import.meta.env.VITE_DOMAIN_URL}/api/refresh-token`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ refresh_token: appRefreshToken }),
			});

			const data = await response.json();

			setAppToken(data.app_token);
			setIsLoggedIn(true);// user remains logged in
		} catch (error) {
			console.error('Failed to refresh app token:', error);
			console.log('logging out');
			setIsLoggedIn(false); // Optionally log the user out on failure
		}
	};

	// Function to refresh Spotify token
	const refreshSpotifyToken = async () => {
		//not ready yet...
		try {
			const response = await fetch(`${import.meta.env.VITE_DOMAIN_URL}/api/refresh-spotify-token`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ refresh_token: spotifyRefreshToken }),
			});

			const data = await response.json();

			setSpotifyToken(data.access_token);

			// Calculate expiration timestamp
			const expirationTime = Math.floor(new Date().getTime() / 1000) + data.expires_in;//convert to seconds so it is standardized with the other timestamps
			setSpotifyTokenExpiration(expirationTime);

		} catch (error) {
			console.error('Failed to refresh Spotify token:', error);
			setIsLoggedIn(false); // Optionally log the user out on failure
		}
	};

	if(isLoggedIn && needReLogin()){
		setIsLoggedIn(false);
	}

	return (
		<AuthStateContext.Provider
			value={{
				spotifyToken,
				spotifyRefreshToken,
				spotifyTokenExpiration,
				setSpotifyToken,
				setSpotifyRefreshToken,
				setSpotifyTokenExpiration,
				appToken,
				appRefreshToken,
				appTokenExpiration,
				setAppToken,
				setAppRefreshToken,
				setAppTokenExpiration,
				isLoggedIn, 
				setIsLoggedIn,
				refreshAppToken,
				refreshSpotifyToken,
				handleLogin,
				confirmSpotifyLoginCode,
				isTokenExpired,
				needReLogin

			}}>
				{children}
		</AuthStateContext.Provider>
	)
};

export const useAuthState = () => {
	const context = useContext(AuthStateContext);
	  if (!context) {
		throw new Error('useAuthState must be used within an AuthStateProvider');
	  }
	  return context;
}