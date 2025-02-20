import axios from "axios";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from '../../stores/AuthStateContext';
import { useAppState } from "../../stores/AppStateContext";
import { SpotifyPlaylist, SpotifyTrack } from '../../types/interfaces';
import Song from "../Song/Song";

interface PlaylistResponse {
	href: string;
	limit: number;
	next: string;
	offset: number;
	previous: string|null;
	total: number;
	items: SpotifyPlaylist[];
}

interface PlaylistItem {
	track: SpotifyTrack;
	is_local: boolean;
	added_at: string;
	added_by: {
		href: string;
		id: string;
		type: string;
		uri: string;	
	}
}

interface PlaylistItemsResponse {
	href: string;
	items: PlaylistItem[];
	limit: number;
	next: null;
	offset: number;
	previous: null;
	total: number;
}

const InDevelopment = () => {
	const { selectedPlaylist } = useAppState();
	const { spotifyToken, isLoggedIn, spotifyID } = useAuthState();
	const [spotifyPlaylists,setSpotifyPlaylists] = useState<SpotifyPlaylist[]>([]);
	const [selectedSpotifyPlaylist,setSelectedSpotifyPlaylist] = useState<SpotifyPlaylist|null>();
	const [selectedSpotifyPlaylistSongs,setSelectedSpotifyPlaylistSongs] = useState<PlaylistItem[]>([]);
	const navigate = useNavigate();

	useEffect(() => {
		performPlaylistSearch();

		if(!isLoggedIn){
			navigate('/');
		}
	}, []);

	useEffect(() => {
		findPlaylistSongs();
	},[selectedSpotifyPlaylist])

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
				console.log({'data':data});
			}
		}	
	}

	return (
		<>
			<h1>Your Playlists On Spotify:</h1>
			<p>
				eventually this should be filtered out so that only the playlists that the user has created are displayed. Then we can connect the songelo playlist with the spotify playlist
			</p>
			{!selectedSpotifyPlaylist && (
				<>
					<h2>Playlists</h2>
					<ul className="text-left">
						{spotifyPlaylists
							.filter((playlist) => playlist.owner.id === spotifyID)
							.map((playlist) => (
							<li key={playlist.id} className="mb-5">
								<h2 className="hover:cursor-pointer" onClick={()=>setSelectedSpotifyPlaylist(playlist)}><strong>{playlist.name}</strong></h2>
								<p>Owner ID: {playlist.owner.id}</p>
							</li>
						))}		
					</ul>
				</>
			)}

			{selectedSpotifyPlaylist && (
				<>
					<h2> Playlist Tracks</h2>
					<button className="hover:cursor-pointer" onClick={()=>{
							setSelectedSpotifyPlaylist(null);
							setSelectedSpotifyPlaylistSongs([]);
						}}>Cancel</button>
					<ul className="text-left">
						{selectedSpotifyPlaylistSongs.map((song)=> (
							<li key={song.track.id}>
								<Song track={song.track} playlistId={selectedPlaylist} canAddToPlaylist={true}/>
							</li>
						))} 
					</ul>
				</>
			)}
			
		</>
	);
};

export default InDevelopment;