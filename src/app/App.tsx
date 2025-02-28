import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TopTracks from '../components/TopTracks/TopTracks';
import SongeloPlaylistsDropdown from '../components/SongeloPlaylistsDropdown/SongeloPlaylistsDropdown';
import Matchup from '../components/Matchup/Matchup';
import { useAppState } from '../stores/AppStateContext';
import { useAuthState } from '../stores/AuthStateContext';
import './App.css';
import TopMenu from '../components/TopMenu/TopMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpotify } from '@fortawesome/free-brands-svg-icons';
import PlaylistRecommendedTracks from '../components/PlaylistRecommendedTracks/PlaylistRecommendedTracks';
import SongeloPlaylistViewer from '../components/SongeloPlaylistViewer/SongeloPlaylistViewer';
import PlaylistImport from '../components/PlaylistImport/PlaylistImport';
// import SearchSpotify from '../components/SearchSpotify/SearchSpotify';


const App = () => {
	const { selectedPlaylist, setSelectedPlaylist } = useAppState();
	const { isLoggedIn, handleLogin } = useAuthState();
	// const configMode:'DEV'|'PROD' = import.meta.env.VITE_CONFIG;
	const [showTopTracks, setShowTopTracks] = useState(false);
	const [showPlaylistSongs, setShowPlaylistSongs] = useState(false);
	const [showRecommendedTracks, setShowRecommendedTracks] = useState(false);
	const [showImportFromSpotify, setShowImportFromSpotify] = useState(false);
	const { playlistID } = useParams<{ playlistID: string }>();
	const { viewStyle } = useParams<{ viewStyle: string }>();

	useEffect(() => {
		console.log({
			'viewStyle':viewStyle
		});
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

		if(viewStyle === 'import'){
			setShowImportFromSpotify(true);
		}
		else{
			setShowImportFromSpotify(false);
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
	}, []);

	useEffect(() =>{
	},[isLoggedIn])


  return (
	<div>
		<TopMenu />
		{isLoggedIn ? (
		
		<div className="logged-in-user-container">
			
			<SongeloPlaylistsDropdown />

			<div className="main-content">


				{(selectedPlaylist && showPlaylistSongs) ? (
					<SongeloPlaylistViewer/>
				) : (selectedPlaylist && showRecommendedTracks) ? (
					<PlaylistRecommendedTracks />
				) : (selectedPlaylist && showTopTracks) ? (
					<TopTracks/>
				) : (selectedPlaylist && showImportFromSpotify) ? (
					<PlaylistImport />
				) : (selectedPlaylist) ? (
					<Matchup />
				) : (
					<></>
				)}

			
			</div>

			
		</div>
		) : (
		<div className="max-w-[480px] mx-auto text-center">
			<button className="bg-darker-4 rounded-md login-button" onClick={handleLogin} >
				Login with Spotify&nbsp;&nbsp;<FontAwesomeIcon icon={faSpotify} size='xl'/>
			</button>
		</div>
		)}
	  
	</div>
  );
};

export default App;
