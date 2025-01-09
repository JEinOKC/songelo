import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TopTracks from '../TopTracks/TopTracks';
import SongeloPlaylistsDropdown from '../SongeloPlaylistsDropdown/SongeloPlaylistsDropdown';
import ListSongeloPlaylistSongs from '../ListSongeloPlaylistSongs/ListSongeloPlaylistSongs';
import { useAppState } from '../state/AppStateContext';
import { useAuthState } from '../state/AuthStateContext';
import './App.css';


const App = () => {
	const { selectedPlaylist, setSelectedPlaylist } = useAppState();
	const { isLoggedIn, appTokenExpiration, spotifyTokenExpiration , handleLogin, refreshAppToken, refreshSpotifyToken, isTokenExpired } = useAuthState();
	const configMode:'DEV'|'PROD' = import.meta.env.VITE_CONFIG;
	const [showTopTracks, setShowTopTracks] = useState(false);
	const { playlistID } = useParams<{ playlistID: string }>();

	const toggleTopTracks = () =>{
		setShowTopTracks(!showTopTracks);
	}

	useEffect(() => {
		if (playlistID) {
			setSelectedPlaylist(playlistID); // Update the state safely after render
		}
	}, [playlistID, setSelectedPlaylist]);

  useEffect(() => {

	//in theory this should check to see if the user has expired tokens and re-fetch them, but instead this is just running an endless loop
	//it believes that the spotify token is always expired
	if(isLoggedIn){
		if(isTokenExpired(appTokenExpiration)){
			refreshAppToken();
		}
		if(isTokenExpired(spotifyTokenExpiration)){
			refreshSpotifyToken();
		}
	}
	
	// const token = localStorage.getItem('spotify_access_token');
	// const expiration = localStorage.getItem('spotify_token_expiration');
	// const refreshToken = localStorage.getItem('spotify_refresh_token');
	// const appToken = localStorage.getItem('app_token');
	// const appTokenExpiration = localStorage.getItem('app_token_expiration');
	// const appRefreshToken = localStorage.getItem('app_refresh_token');

	/*
	isTokenExpired and checkTokens need to be moved out of this component

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

	*/
  }, []);

  

  return (
	<div>
		{configMode === 'DEV' ? (
			<>
				<h1>Welcome to Songelo!</h1>
				<p>This is the home page of the app.</p>
				{isLoggedIn ? (
				
				<div className="logged-in-user-container">

					<div className="headerContent">
					<p>You are logged in with Spotify!</p>

					<div>
						{selectedPlaylist && (
						<button onClick={toggleTopTracks} style={{ padding: '10px 20px', fontSize: '16px' }}>
						Toggle Top Tracks
						</button>	
						)}
						<button onClick={refreshAppToken} style={{ padding: '10px 20px', fontSize: '16px' }}>
						Refresh App Token
						</button>
						<button onClick={refreshSpotifyToken} style={{ padding: '10px 20px', fontSize: '16px' }}>
						Refresh Spotify Token
						</button>
					</div>
					</div>

					<div className="mainContent">

					<div className="leftPanel">
					<h1>Show top tracks? {showTopTracks.toString()}</h1>
						{selectedPlaylist && showTopTracks && <TopTracks/>}
					</div>

					
						<div className="centerContent">
						<SongeloPlaylistsDropdown />
						{selectedPlaylist && (
							<ListSongeloPlaylistSongs playlistId={selectedPlaylist} />
						)}
						</div>
					
					</div>

					
				</div>
				) : (
				<button onClick={handleLogin} style={{ padding: '10px 20px', fontSize: '16px' }}>
					Login with Spotify
				</button>
				)}
			</>
		) : (
			<>
				<h1>Coming Soon!</h1>
			</>
		)}
	  
	</div>
  );
};

export default App;
