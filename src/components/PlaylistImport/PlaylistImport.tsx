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
			console.log({'playlists':playlists});
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
		<>
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
				<div className="flex align-items-center flex-col justify-center w-full gap-2.5">
					<h2 className="page-header">Your Playlists On Spotify:</h2>
					<ul className="w-fit text-left">
					{spotifyPlaylists
							.map((playlist) => (
							<li key={playlist.id} className="odd:bg-white even:bg-lighter-2 mb-2 rounded-md hover:cursor-pointer border-2 border-transparent hover:border-lighter-7"  onClick={()=>setSelectedSpotifyPlaylist(playlist)}>
								<div className='flex flex-row items-center p-2 w-full max-w-full overflow-hidden'>
									<img src={playlist.images[0].url} alt="Album Cover" className="w-16 h-16 rounded-md mr-2 shrink-0"/>
									<span className="link block w-full flex-1">
										{playlist.name}
									</span>
								</div>
							</li>
						))}		
					</ul>
				</div>
			)}

			{selectedSpotifyPlaylist && (
				<div className="flex flex-col text-center w-full gap-2.5">

					{importingAllSongs && (
						<div className="alert-message bg-neutral mb-4">
							Importing Songs. Please wait...
						</div>
					)}
					
					
					{(filteredActiveSongs.length == 0 && selectedSpotifyPlaylistSongs.length > 0 && !importingAllSongs) && (
						<div className="text-center">
							<div className="alert-message bg-danger mb-4 w-full">You may import up to {currentPlaylistObject && currentPlaylistObject?.max_length < 100 ? currentPlaylistObject?.max_length : 100} songs</div>
							<button className="btn btn-primary btn mb-4" onClick={importSpotifySongs.bind(this)}>Import Playlist</button>
						</div>
					)}

					<h2 className="page-header">
						<strong>Playlist Tracks:</strong> 
						<br/>
						<span className="text-sm">{selectedSpotifyPlaylist.name}</span>
					</h2>
					<button className="hover:cursor-pointer inline-block" onClick={()=>{
							setSelectedSpotifyPlaylist(null);
							setSelectedSpotifyPlaylistSongs([]);
						}}><FontAwesomeIcon icon={faChevronLeft} />&nbsp; All Playlists</button>
					<hr className="mb-2 mt-2"/>
					<ul className="text-left">
						{selectedSpotifyPlaylistSongs.map((song)=> (
							<li className='mb-4 border-1 border-lighter-2 rounded-md' key={song.track.id}>
								<Song track={song.track} playlistId={selectedPlaylist} canAddToPlaylist={!isTrackInPlaylist(song.track) && !importingAllSongs}/>
							</li>
						))} 
					</ul>
				</div>
			)}
			
		</>
	);
};

export default PlaylistImport;