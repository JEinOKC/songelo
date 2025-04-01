import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from '../../stores/AuthStateContext';
import { useAppState } from "../../stores/AppStateContext";
import { PlaylistItem, SpotifyPlaylist, Playlist, PlaylistSong } from '../../types/interfaces';
import Song from "../Song/Song";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import SpotifyComms from '../../utils/SpotifyComms';

const PlaylistImport = () => {
	const { selectedPlaylist, playlists, selectedPlaylistSongs, selectedPlaylistWaitingList, isTrackInPlaylist, saveMultipleSongsInPlaylist } = useAppState();
	const { isLoggedIn, /*spotifyID*/ } = useAuthState();
	const [spotifyPlaylists,setSpotifyPlaylists] = useState<SpotifyPlaylist[]>([]);
	const [selectedSpotifyPlaylist,setSelectedSpotifyPlaylist] = useState<SpotifyPlaylist|null>();
	const [selectedSpotifyPlaylistSongs,setSelectedSpotifyPlaylistSongs] = useState<PlaylistItem[]>([]);
	const [currentPlaylistObject,setCurrentPlaylistObject] = useState<Playlist>();
	const [filteredActiveSongs,setFilteredActiveSongs] = useState<PlaylistSong[]>([]);
	const [importingAllSongs,setImportingAllSongs] = useState<boolean>(false);
	const { findPlaylistSongs, performPlaylistSearch } = SpotifyComms();
	const navigate = useNavigate();
	

	useEffect(() => {
		_performPlaylistSearch();

		if(!isLoggedIn){
			navigate('/');
		}

		findPlaylistInPlaylists();
	}, []);

	useEffect(() => {
		_findPlaylistSongs();
	},[selectedSpotifyPlaylist])

	useEffect(()=>{
		findPlaylistInPlaylists();
	},[selectedPlaylist,playlists])

	useEffect(() =>{

		setFilteredActiveSongs(selectedPlaylistSongs
			.filter((song) => song.active === true)
			.sort((a, b) => b.score - a.score));
			

	},[selectedPlaylistSongs,selectedPlaylistWaitingList]);

	const findPlaylistInPlaylists = () => {
		playlists.forEach((playlist)=>{
			if(playlist.id === selectedPlaylist){
				setCurrentPlaylistObject(playlist);
			};
		})
	}

	const _findPlaylistSongs = async () => {
		if(selectedSpotifyPlaylist){

			try {

				const items:PlaylistItem[] = await findPlaylistSongs(selectedSpotifyPlaylist.id);
				setSelectedSpotifyPlaylistSongs(items);
				
			} catch (error) {
				console.error("Error fetching playlist songs:", error);
				
			}

			

		}
		
	}
	
	const _performPlaylistSearch = async () => {
		try{
			const playlists:SpotifyPlaylist[] = await performPlaylistSearch();
			setSpotifyPlaylists(playlists);
		}
		catch(error){
			console.error("Error fetching playlists:", error);
		}
	}

	const importSpotifySongs = async () => {
		if(typeof currentPlaylistObject === 'undefined' || !selectedSpotifyPlaylist){
			return;
		}
		
		const currentPlaylistMaxLength = currentPlaylistObject.max_length;

		const allowedSongs = selectedSpotifyPlaylistSongs
			.filter((song) => !isTrackInPlaylist(song.track))
			.map((song) => {
				return song.track
			})
			.slice(0, currentPlaylistMaxLength);

		setImportingAllSongs(true);

		saveMultipleSongsInPlaylist(allowedSongs,true).then(()=>{
			setImportingAllSongs(false);
			navigate(`/playlist/${selectedPlaylist}`);
		});
		
	}

	return (
		<div>
			{/* <div>
				<div>
					{currentPlaylistObject?.id}
					<hr/>
					<strong>Song Length: {filteredActiveSongs.length}</strong>
					<br/>
					Songelo Playlist - {JSON.stringify(currentPlaylistObject)}
				</div>
				
			</div> */}

			{!selectedSpotifyPlaylist && (
				<>
					<h3 className="text-left">Your Playlists On Spotify:</h3>
					<ul className="text-left">
						{spotifyPlaylists
							// .filter((playlist) => playlist.owner.id === spotifyID)
							.map((playlist) => (
							<li key={playlist.id} className="mb-5">
								<h2 className="hover:cursor-pointe link" onClick={()=>setSelectedSpotifyPlaylist(playlist)}><strong>{playlist.name}</strong></h2>
								<p>Owner ID: {playlist.owner.id}</p>
							</li>
						))}		
					</ul>
				</>
			)}

			{selectedSpotifyPlaylist && (
				<div className="text-left">

					{importingAllSongs && (
						<div className="alert-message bg-neutral mb-4">
							Importing Songs. Please wait...
						</div>
					)}
					
					
					{(filteredActiveSongs.length == 0 && selectedSpotifyPlaylistSongs.length > 0 && !importingAllSongs) && (
						<div className="text-center">
							<div className="alert-message bg-danger mb-4">You may import up to 100 songs or {currentPlaylistObject?.max_length} (whichever is smaller)</div>
							<button className="btn btn-primary btn mb-4" onClick={importSpotifySongs.bind(this)}>Import Playlist</button>
						</div>
					)}

					<h3 className="text-left">Playlist Tracks - {selectedSpotifyPlaylist.name}</h3>
					<button className="hover:cursor-pointer" onClick={()=>{
							setSelectedSpotifyPlaylist(null);
							setSelectedSpotifyPlaylistSongs([]);
						}}><FontAwesomeIcon icon={faChevronLeft} />&nbsp; Go Back</button>
					<hr className="mb-2 mt-2"/>
					<ul className="text-left">
						{selectedSpotifyPlaylistSongs.map((song)=> (
							<li key={song.track.id}>
								<Song track={song.track} playlistId={selectedPlaylist} canAddToPlaylist={!isTrackInPlaylist(song.track) && !importingAllSongs}/>
							</li>
						))} 
					</ul>
				</div>
			)}
			
		</div>
	);
};

export default PlaylistImport;