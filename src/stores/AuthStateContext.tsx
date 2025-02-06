import { createContext, useContext, ReactNode } from 'react';
import { AuthState } from '../types/interfaces';
import useStateWithLocalStorage from './useStateWithLocalStorage';
import useStateWithCookies from './useStateWithCookies';
import axios from 'axios';

/** 
 * Axios interceptor logic brought in from https://medium.com/@velja/token-refresh-with-axios-interceptors-for-a-seamless-authentication-experience-854b06064bde
 * **/



const AuthStateContext = createContext<AuthState | undefined>(undefined);

export const AuthStateProvider = ({ children }: { children: ReactNode }) => {
	const [isLoggedIn, setIsLoggedIn] = useStateWithLocalStorage('isLoggedIn',false);//this goes first because the tokens used later can change this value
	const [spotifyToken,setSpotifyToken] = useStateWithLocalStorage('spotifyToken','');
	const [spotifyRefreshToken,setSpotifyRefreshToken] = useStateWithCookies('spotifyRefreshToken','');
	const [spotifyTokenExpiration,setSpotifyTokenExpiration] = useStateWithLocalStorage('spotifyTokenExpiration',0);
	const [appToken,setAppToken] = useStateWithLocalStorage('appToken','');
	const [appRefreshToken,setAppRefreshToken] = useStateWithCookies('appRefreshToken','');
	const [appTokenExpiration, setAppTokenExpiration] = useStateWithLocalStorage('appTokenExpiration',0);

	const spotifyAxiosInstance = axios.create({
		baseURL: import.meta.env.VITE_DOMAIN_URL,
		headers: {
			'Content-Type': 'application/json',
		},
	});

	spotifyAxiosInstance.interceptors.request.use(request => {
			const accessToken = spotifyToken;
			
			if (accessToken) {
				request.headers['Authorization'] = `Bearer ${accessToken}`;
			}
			return request;
		}, error => {
			return Promise.reject(error);
	});

	spotifyAxiosInstance.interceptors.response.use(
		response => response, // Directly return successful responses.
		async error => {
			const originalRequest = error.config;
			
			if (error.response.status === 401 && !originalRequest._retry) {
				originalRequest._retry = true; // Mark the request as retried to avoid infinite loops.

				try {

					const refreshToken = spotifyRefreshToken; // Retrieve the stored refresh token.
					// Make a request to your auth server to refresh the token.
					const response = await axios.post(`${import.meta.env.VITE_DOMAIN_URL}/api/refresh-spotify-token`, {
						refreshToken,
					});
					const { accessToken, refreshToken: newRefreshToken } = response.data;
					setSpotifyToken(accessToken);
					setSpotifyRefreshToken(newRefreshToken);

					// Update the authorization header with the new access token.
					appAxiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
					return spotifyAxiosInstance(originalRequest); // Retry the original request with the new access token.

				} catch (refreshError) {
					// Handle refresh token errors by clearing stored tokens and redirecting to the login page.
					handleLogout();
				}
			}
			return Promise.reject(error); // For all other errors, return the error as is.
		}
	);

	const appAxiosInstance = axios.create({
		baseURL: import.meta.env.VITE_DOMAIN_URL,
		headers: {
			'Content-Type': 'application/json',
		},
	});

	appAxiosInstance.interceptors.request.use(request => {
			const accessToken = appToken;
			if (accessToken) {
				request.headers['Authorization'] = `Bearer ${accessToken}`;
			}
			return request;
		}, error => {
			return Promise.reject(error);
	});

	appAxiosInstance.interceptors.response.use(
		response => response, // Directly return successful responses.
		async error => {
			const originalRequest = error.config;
			
			if (error.response.status === 401 && !originalRequest._retry) {
				originalRequest._retry = true; // Mark the request as retried to avoid infinite loops.

				try {

					const refreshToken = appRefreshToken; // Retrieve the stored refresh token.
					// Make a request to your auth server to refresh the token.
					const response = await axios.post(`${import.meta.env.VITE_DOMAIN_URL}/api/refresh-token`, {
						refreshToken,
					});
					const { accessToken, refreshToken: newRefreshToken } = response.data;
					setAppToken(accessToken);
					setAppRefreshToken(newRefreshToken);
					setIsLoggedIn(true);

					// Update the authorization header with the new access token.
					appAxiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
					return appAxiosInstance(originalRequest); // Retry the original request with the new access token.

				} catch (refreshError) {
					// Handle refresh token errors by clearing stored tokens and redirecting to the login page.
					handleLogout();
				}
			}
			return Promise.reject(error); // For all other errors, return the error as is.
		}
	);

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

	const handleLogout = () => {
		setIsLoggedIn(false);
		setAppToken('');
		setAppRefreshToken('');
		setSpotifyToken('');
		setSpotifyRefreshToken('');
	}

	const isTokenExpired = (expiration:number): boolean => {
		expiration = expiration * 1000;
		if (expiration) {
			return Date.now() > expiration; // Compare current time with expiration time
		}
		return true; // If no expiration time is found, consider it expired
	};

	//function that handles the callback of the spotify login, gathers a token and logs them into our system
	const confirmSpotifyLoginCode = async (code:string) => {

		try {
			const response = await axios.post(`${import.meta.env.VITE_DOMAIN_URL}/api/spotify/callback`, {
				code: code
			});

			if(response.status === 200){
				const data = await response.data;
				const { access_token, expires_in, app_token, app_token_expiration, refresh_token, app_refresh_token } = data;

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
			}
			else{
				handleLogout();
			}
			
		} catch (error) {
			handleLogout();
		}


		



	}

	if(isLoggedIn && needReLogin()){
		handleLogout();
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
				handleLogin,
				handleLogout,
				confirmSpotifyLoginCode,
				isTokenExpired,
				needReLogin,
				appAxiosInstance,
				spotifyAxiosInstance
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