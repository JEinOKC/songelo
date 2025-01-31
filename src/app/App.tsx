import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TopTracks from '../components/TopTracks/TopTracks';
import SongeloPlaylistsDropdown from '../components/SongeloPlaylistsDropdown/SongeloPlaylistsDropdown';
import ListSongeloPlaylistSongs from '../components/ListSongeloPlaylistSongs/ListSongeloPlaylistSongs';
import Matchup from '../components/Matchup/Matchup';
import { useAppState } from '../stores/AppStateContext';
import { useAuthState } from '../stores/AuthStateContext';
import './App.css';
import TopMenu from '../components/TopMenu/TopMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpotify } from '@fortawesome/free-brands-svg-icons';
import PlaylistRecommendedTracks from '../components/PlaylistRecommendedTracks/PlaylistRecommendedTracks';
// import SearchSpotify from '../components/SearchSpotify/SearchSpotify';


const App = () => {
	const { selectedPlaylist, setSelectedPlaylist } = useAppState();
	const { isLoggedIn, appTokenExpiration, spotifyTokenExpiration , handleLogin, refreshAppToken, refreshSpotifyToken, isTokenExpired } = useAuthState();
	// const configMode:'DEV'|'PROD' = import.meta.env.VITE_CONFIG;
	const [showTopTracks, setShowTopTracks] = useState(false);
	const [showPlaylistSongs, setShowPlaylistSongs] = useState(false);
	const [showRecommendedTracks, setShowRecommendedTracks] = useState(false);
	const { playlistID } = useParams<{ playlistID: string }>();
	const { viewStyle } = useParams<{ viewStyle: string }>();

	useEffect(() => {
		if (viewStyle === 'standings') {
			setShowPlaylistSongs(true);
		}
		else{
			setShowPlaylistSongs(false);
		}

		if(viewStyle === 'recommended-tracks'){
			setShowRecommendedTracks(true);
		}
		else{
			setShowRecommendedTracks(false);
		}

		if(viewStyle === 'top-tracks'){
			setShowTopTracks(true);
		}
		else{
			setShowTopTracks(false);
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
		<TopMenu />
		{isLoggedIn ? (
		
		<div className="logged-in-user-container">
			
			<SongeloPlaylistsDropdown />

			{/* <div className="header-content hidden">
				<p>You are logged in with Spotify!</p>

				<div>
					<button onClick={refreshAppToken} style={{ padding: '10px 20px', fontSize: '16px' }}>
					Refresh App Token
					</button>
					<button onClick={refreshSpotifyToken} style={{ padding: '10px 20px', fontSize: '16px' }}>
					Refresh Spotify Token
					</button>
				</div>
			</div> */}

			<div className="main-content">

				{(selectedPlaylist && showPlaylistSongs) ? (
					<>
						<ListSongeloPlaylistSongs playlistId={selectedPlaylist} />
						<ListSongeloPlaylistSongs playlistId={selectedPlaylist} enqueued={true}/>
					</>
				) : (selectedPlaylist && showRecommendedTracks) ? (
					<PlaylistRecommendedTracks />
				) : (selectedPlaylist && showTopTracks) ? (
					<TopTracks/>
				) : (selectedPlaylist && selectedPlaylist) ? (
					<Matchup />
				) : (
					<></>
				)}

			
			</div>

			
		</div>
		) : (
		<button className="login-button" onClick={handleLogin} >
			Login with Spotify&nbsp;&nbsp;<FontAwesomeIcon icon={faSpotify} size='xl'/>
		</button>
		)}
	  
	</div>
  );
};

export default App;
