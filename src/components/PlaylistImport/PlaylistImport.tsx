import axios from "axios";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from '../../stores/AuthStateContext';
import { useAppState } from "../../stores/AppStateContext";
import { PlaylistItemsResponse, PlaylistItem, PlaylistResponse, SpotifyPlaylist, Playlist, PlaylistSong } from '../../types/interfaces';
import Song from "../Song/Song";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

const PlaylistImport = () => {
	const { selectedPlaylist, playlists, selectedPlaylistSongs, selectedPlaylistWaitingList, isTrackInPlaylist, saveMultipleSongsInPlaylist } = useAppState();
	const { spotifyToken, isLoggedIn, /*spotifyID*/ } = useAuthState();
	const [spotifyPlaylists,setSpotifyPlaylists] = useState<SpotifyPlaylist[]>([]);
	const [selectedSpotifyPlaylist,setSelectedSpotifyPlaylist] = useState<SpotifyPlaylist|null>();
	const [selectedSpotifyPlaylistSongs,setSelectedSpotifyPlaylistSongs] = useState<PlaylistItem[]>([]);
	const [currentPlaylistObject,setCurrentPlaylistObject] = useState<Playlist>();
	const [filteredActiveSongs,setFilteredActiveSongs] = useState<PlaylistSong[]>([]);
	const navigate = useNavigate();
	

	useEffect(() => {
		performPlaylistSearch();

		if(!isLoggedIn){
			navigate('/');
		}

		findPlaylistInPlaylists();
	}, []);

	useEffect(() => {
		findPlaylistSongs();
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

	const findPlaylistSongs = async () => {
		if(spotifyToken && selectedSpotifyPlaylist){
			const response = await axios.get(`https://api.spotify.com/v1/playlists/${selectedSpotifyPlaylist.id}/tracks`,{
				headers: { Authorization: `Bearer ${spotifyToken}` }
			});

			if(response.status === 200){
				const data:PlaylistItemsResponse = response.data;
				setSelectedSpotifyPlaylistSongs(data.items);
				console.log({'data':data});
			}

		}
		
	}
	
	const performPlaylistSearch = async () => {
		if(spotifyToken){
			const response = await axios.get('https://api.spotify.com/v1/me/playlists',{
				headers: { Authorization: `Bearer ${spotifyToken}` }
			});

			if(response.status === 200){
				const data:PlaylistResponse = response.data;
				setSpotifyPlaylists(data.items);
			}
		}	
	}

	const importSpotifySongs = async () => {
		if(typeof currentPlaylistObject === 'undefined'){
			return;
		}
		
		const currentPlaylistMaxLength = currentPlaylistObject.max_length;

		const allowedSongs = selectedSpotifyPlaylistSongs
			.filter((song) => !isTrackInPlaylist(song.track))
			.map((song) => {
				return song.track
			})
			.slice(0, currentPlaylistMaxLength);

		console.log({'allowedSongs':allowedSongs});
		saveMultipleSongsInPlaylist(allowedSongs,true);
		
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

					{(filteredActiveSongs.length == 0 && selectedSpotifyPlaylistSongs.length > 0) && (
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
								<Song track={song.track} playlistId={selectedPlaylist} canAddToPlaylist={!isTrackInPlaylist(song.track)}/>
							</li>
						))} 
					</ul>
				</div>
			)}
			
		</div>
	);
};

export default PlaylistImport;