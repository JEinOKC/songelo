import { PlaylistSong, PlaylistItemsResponse, SpotifyPlaylist, PlaylistItem, PlaylistResponse, SpotifySearchResult, SpotifyTrack} from '../types/interfaces';
import { useAuthState } from '../stores/AuthStateContext';
import { useAppState } from '../stores/AppStateContext';

const SpotifyComms = () => {

	const { spotifyID, spotifyToken, spotifyAxiosInstance } = useAuthState();
	const { submitExportedPlaylist } = useAppState();

	const findPlaylistSongs = async (selectedSpotifyPlaylist:string): Promise<PlaylistItem[]> => {
		
		if(spotifyToken && selectedSpotifyPlaylist){
			const response = await spotifyAxiosInstance.get(`https://api.spotify.com/v1/playlists/${selectedSpotifyPlaylist}/tracks`);
	
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

	const addSongsToSpotifyPlaylist = async (playlistID:string, songs:PlaylistSong[]):Promise<boolean> => {
		if(spotifyToken && playlistID && songs.length > 0){
			const response = await spotifyAxiosInstance.post(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`,{
				uris: songs.map((song) => song.track_info.uri)
			});

			if(response.status === 201){
				return true;
			}
			else{
				//failure
				throw new Error("Failed to export songs to playlist");
			}
		}
		throw new Error("Invalid parameters for exporting songs to playlist");
	}

	const createSpotifyPlaylist = async (playlistName:string, songs:PlaylistSong[]):Promise<boolean> => {
		if(spotifyToken && playlistName && songs.length > 0 || !spotifyID){
			
			const response = await spotifyAxiosInstance.post(`https://api.spotify.com/v1/users/${spotifyID}/playlists`,{
				name: playlistName,
				description: "Playlist created by Songelo",
			});

			if(response.status === 201){
				const playlistID = response.data.id;
				
				await Promise.all([addSongsToSpotifyPlaylist(playlistID, songs), submitExportedPlaylist(playlistID)]);

				//success
				return true;
			}
			else{
				//failure
				throw new Error("Failed to export songs to playlist");
			}
		}

		throw new Error("Invalid parameters for exporting songs to playlist");
	}
	const performPlaylistSearch = async ():Promise<SpotifyPlaylist[]> => {
		if(spotifyToken){
			const response = await spotifyAxiosInstance.get('https://api.spotify.com/v1/me/playlists');
	
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
		getPlaylists,
		createSpotifyPlaylist
	};
}

export default SpotifyComms;

