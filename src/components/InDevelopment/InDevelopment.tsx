import axios from "axios";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from '../../stores/AuthStateContext';
import { SpotifyPlaylist } from '../../types/interfaces';

interface PlaylistResponse {
	href: string;
	limit: number;
	next: string;
	offset: number;
	previous: string|null;
	total: number;
	items: SpotifyPlaylist[];
}

const InDevelopment = () => {
	const { spotifyToken, isLoggedIn } = useAuthState();
	const [spotifyPlaylists,setSpotifyPlaylists] = useState<SpotifyPlaylist[]>([]);
	const navigate = useNavigate();

	useEffect(() => {
		performPlaylistSearch();

		if(!isLoggedIn){
			navigate('/');
		}
	}, []);
	
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
			<ul className="text-left">
				{spotifyPlaylists.map((playlist) => (
					<li key={playlist.id} className="mb-5">
						<h2><strong>{playlist.name}</strong></h2>
						<p>Owner ID: {playlist.owner.id}</p>
					</li>
				))}		
			</ul>
		</>
	);
};

export default InDevelopment;