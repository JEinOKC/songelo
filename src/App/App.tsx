import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TopTracks from '../TopTracks/TopTracks';
import SongeloPlaylistsDropdown from '../SongeloPlaylistsDropdown/SongeloPlaylistsDropdown';
import ListSongeloPlaylistSongs from '../ListSongeloPlaylistSongs/ListSongeloPlaylistSongs';
import Matchup from '../Matchup/Matchup';
import { useAppState } from '../state/AppStateContext';
import { useAuthState } from '../state/AuthStateContext';
import './App.css';
import TopMenu from '../TopMenu/TopMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpotify } from '@fortawesome/free-brands-svg-icons';


const App = () => {
	const { selectedPlaylist, setSelectedPlaylist } = useAppState();
	const { isLoggedIn, appTokenExpiration, spotifyTokenExpiration , handleLogin, refreshAppToken, refreshSpotifyToken, isTokenExpired } = useAuthState();
	const configMode:'DEV'|'PROD' = import.meta.env.VITE_CONFIG;
	const [showTopTracks, setShowTopTracks] = useState(false);
	const [showPlaylistSongs, setShowPlaylistSongs] = useState(false);
	const { playlistID } = useParams<{ playlistID: string }>();
	const { viewStyle } = useParams<{ viewStyle: string }>();

	const toggleTopTracks = () =>{
		setShowTopTracks(!showTopTracks);
	}

	const togglePlaylistSongs = () =>{
		setShowPlaylistSongs(!showPlaylistSongs);
	}

	useEffect(() => {
		console.log({'viewStyle':viewStyle});
		if (viewStyle === 'standings') {
			setShowPlaylistSongs(true);
		}
		else{
			setShowPlaylistSongs(false);
		}
	}, [viewStyle]);

	useEffect(() => {
		if (playlistID) {
			setSelectedPlaylist(playlistID); // Update the state safely after render
		}
		else{
			setSelectedPlaylist('');
		}
	}, [playlistID]);

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

	}, []);

	useEffect(() =>{
		// console.log('isLoggedIn changed',isLoggedIn);
	},[isLoggedIn])

  

  return (
	<div>
		{configMode === 'DEV' ? (
			<>
				<TopMenu />
				{isLoggedIn ? (
				
				<div className="logged-in-user-container">
					
					<SongeloPlaylistsDropdown />

					<div className="header-content hidden">
						<p>You are logged in with Spotify!</p>

						<div>
							
							{selectedPlaylist && (
							<button onClick={togglePlaylistSongs} style={{ padding: '10px 20px', fontSize: '16px' }}>
							Toggle Playlist Songs
							</button>	
							)}
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

					<div className="main-content">

						{(selectedPlaylist && showPlaylistSongs) ? (
								<ListSongeloPlaylistSongs playlistId={selectedPlaylist} />
						) : selectedPlaylist ? (
								<Matchup />
						) : (
							<></>
						)}

					
						{selectedPlaylist && showTopTracks && (
							<div className="left-panel">
								<TopTracks/>
							</div>
						)}
					

					
						<div className="center-content">
							
							

							
						</div>
					
					</div>

					
				</div>
				) : (
				<button className="login-button" onClick={handleLogin} >
					Login with Spotify&nbsp;&nbsp;<FontAwesomeIcon icon={faSpotify} size='xl'/>
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
