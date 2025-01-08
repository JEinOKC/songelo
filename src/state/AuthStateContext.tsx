import { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';

interface AuthState {
	isLoggedIn: boolean;
	setIsLoggedIn: (loggedIn: boolean) => void;

	spotifyToken: string;
	setSpotifyToken: (token: string) => void;

	spotifyRefreshToken: string;
	setSpotifyRefreshToken: (token: string) => void;

	spotifyTokenExpiration: number;
	setSpotifyTokenExpiration: (token: number) => void;

	appToken: string;
	setAppToken: (token: string) => void;

	appRefreshToken: string;
	setAppRefreshToken: (token: string) => void;

	appTokenExpiration: number;
	setAppTokenExpiration: (token: number) => void;

	handleLogin: () => void;
	refreshAppToken: () => Promise<void>;
	refreshSpotifyToken: () => Promise<void>;
	confirmSpotifyLoginCode: (code:string) => Promise<void>;
}

const AuthStateContext = createContext<AuthState | undefined>(undefined);

export const AuthStateProvider = ({ children }: { children: ReactNode }) => {
	const [spotifyToken,setSpotifyToken] = useState<string>('');
	const [spotifyRefreshToken,setSpotifyRefreshToken] = useState<string>('');
	const [spotifyTokenExpiration,setSpotifyTokenExpiration] = useState<number>(0);
	const [appToken,setAppToken] = useState<string>('');
	const [appRefreshToken,setAppRefreshToken] = useState<string>('');
	const [appTokenExpiration, setAppTokenExpiration] = useState<number>(0);
	const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
	
	const handleLogin = () => {
		const domainUrl = import.meta.env.VITE_DOMAIN_URL || 'http://localhost:5000';
		const loginUrl = `${domainUrl}/login`;
		window.location.href = loginUrl;
	};

	//function that handles the callback of the spotify login, gathers a token and logs them into our system
	const confirmSpotifyLoginCode = async (code:string) => {
		const domainUrl = import.meta.env.VITE_DOMAIN_URL || 'http://localhost:5000';
		axios
        .post(domainUrl+'/api/spotify/callback', { code })
        .then((response) => {
			console.log({ 'response data': response.data });

			// Extract token and expiration time
			const { access_token, expires_in, app_token, app_token_expiration, refresh_token, app_refresh_token } = response.data;

			// Calculate expiration timestamp
			const expirationTime = Math.floor(( new Date().getTime() + expires_in ) / 1000);//convert to seconds so it is standardized with the other timestamps

			console.log({
				'spotify' : {
					'access_token':	access_token,
					'refresh_token':refresh_token,
					'expirationTime':expirationTime
				},
				'app' : {
					'access_token':	app_token,
					'refresh_token':app_refresh_token,
					'expirationTime':app_token_expiration
				}
			})

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
			const expirationTime = Math.floor(( new Date().getTime() + data.expires_in ) / 1000);//convert to seconds so it is standardized with the other timestamps
			setSpotifyTokenExpiration(expirationTime);

			console.log({
				'after refresh' : {
					'spotify token' : spotifyToken,
					'spotify expiration' : spotifyTokenExpiration,
					'response data' : response
				}
			})

		} catch (error) {
			console.error('Failed to refresh Spotify token:', error);
			setIsLoggedIn(false); // Optionally log the user out on failure
		}
	};

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
				confirmSpotifyLoginCode

			}}>
				{children}
		</AuthStateContext.Provider>
	)
};

export const useAuthState = () => {
	const context = useContext(AuthStateContext);
	  if (!context) {
		console.log({'context':context});
		throw new Error('useAuthState must be used within an AuthStateProvider');
	  }
	  return context;
}