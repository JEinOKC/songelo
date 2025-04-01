import { PlaylistItemsResponse, SpotifyPlaylist, PlaylistItem, PlaylistResponse, SpotifySearchResult, SpotifyTrack} from '../types/interfaces';
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

	const spotifyTrackSearch = async (encodedQuery:string):Promise<SpotifySearchResult> => {
		if(!spotifyToken){
			throw new Error("Spotify token is not available");
		}

		const response = await spotifyAxiosInstance.get(`https://api.spotify.com/v1/search?type=track&limit=1&q=${encodedQuery}`);

		if(response.status !== 200){
			//failure
			throw new Error("Failed to fetch playlist songs");
		}

		const result:SpotifySearchResult = await response.data;
		return result;
	}

	const getTopTracks = async(limit:number = 50, offset:number = 0):Promise<SpotifyTrack[]> => {
		if(!spotifyToken){
			throw new Error("Spotify token is not available");
		}

		const response = await spotifyAxiosInstance.get(`https://api.spotify.com/v1/me/top/tracks?limit=${limit}&offset=${offset}`);

		if(response.status !== 200){
			//failure
			throw new Error("Failed to fetch playlist songs");
		}

		const result:SpotifyTrack[] = await response.data.items;
		
		return result;
	}

	const getPlaylists = async ():Promise<SpotifyPlaylist[]> => {
		if(!spotifyToken){
			throw new Error("Spotify token is not available");
		}
		const response = await spotifyAxiosInstance.get('https://api.spotify.com/v1/me/playlists');
		if(response.status !== 200){
			//failure
			throw new Error("Failed to fetch playlists");
		}
		const data:PlaylistResponse = await response.data;
		return data.items;
	}

	return {
		findPlaylistSongs,
		performPlaylistSearch,
		spotifyTrackSearch,
		getTopTracks,
		getPlaylists
	};
}

export default SpotifyComms;

