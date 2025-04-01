import { PlaylistItemsResponse, SpotifyPlaylist, PlaylistItem, PlaylistResponse} from '../types/interfaces';
import { useAuthState } from '../stores/AuthStateContext';

const SpotifyComms = () => {

	const { spotifyToken, spotifyAxiosInstance } = useAuthState();

	const findPlaylistSongs = async (selectedSpotifyPlaylist:string): Promise<PlaylistItem[]> => {
		
		if(spotifyToken && selectedSpotifyPlaylist){
			const response = await spotifyAxiosInstance.get(`https://api.spotify.com/v1/playlists/${selectedSpotifyPlaylist}/tracks`,{
				headers: { Authorization: `Bearer ${spotifyToken}` }
			});
	
			if(response.status === 200){
				const data:PlaylistItemsResponse = response.data;
				return data.items;
			}
			else{
				//failure
				throw new Error("Failed to fetch playlist songs");
				
			}
	
		}
	
		return [];
		
	}
	
	const performPlaylistSearch = async ():Promise<SpotifyPlaylist[]> => {
		if(spotifyToken){
			const response = await spotifyAxiosInstance.get('https://api.spotify.com/v1/me/playlists',{
				headers: { Authorization: `Bearer ${spotifyToken}` }
			});
	
			if(response.status === 200){
				const data:PlaylistResponse = response.data;
				return data.items;
			}
		}	
		return [];
	}

	return {
		findPlaylistSongs,
		performPlaylistSearch
	};
}

export default SpotifyComms;

