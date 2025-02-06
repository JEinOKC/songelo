import { createContext, useContext, useState, ReactNode } from 'react';
import { PlaylistSong, AppState, SpotifyTrack, Playlist} from '../types/interfaces';
import { useAuthState } from './AuthStateContext';


const AppStateContext = createContext<AppState | undefined>(undefined);

export const AppStateProvider = ({ children }: { children: ReactNode }) => {
	const [selectedPlaylist, setRawSelectedPlaylist] = useState<string>('');
	const [playlists, setPlaylists] = useState<Playlist[]>([]);
	const [selectedPlaylistSongs, setSelectedPlaylistSongs] = useState<PlaylistSong[]>([]);
	const [selectedPlaylistWaitingList, setSelectedPlaylistWaitingList] = useState<PlaylistSong[]>([]);
	const { appToken, appAxiosInstance } = useAuthState();

	const getPlaylistRecommendedTracks = async (playlistID:string) => {
		if (!appToken || !playlistID) return;

		const response = await appAxiosInstance.get(`${import.meta.env.VITE_DOMAIN_URL}/api/playlists/${playlistID}/recommended/tracks`);

		if(response.status === 200){
			const data = await response.data;

			if (data.success) {
				return data.tracks;
			}
		}
		else{
			//failure
		}
			

	}

	const setSelectedPlaylist = (playlistID:string) => {

		
		setRawSelectedPlaylist(playlistID);
		
		if(playlistID === ''){
			setSelectedPlaylistSongs([]);
			setSelectedPlaylistWaitingList([]);
			return;
		}

		const fetchSongs = async (playlistID:string) => {
			
			if (!appToken || !playlistID) return;

			const response = await appAxiosInstance.get(`${import.meta.env.VITE_DOMAIN_URL}/api/playlists/${playlistID}/songs`);

			if(response.status === 200){
				const data = await response.data;

				if (data.success && data.songs) {
					setSelectedPlaylistSongs(data.songs);
				}

				if(data.success && data.waitingList){
					setSelectedPlaylistWaitingList(data.waitingList);
				}
			}
			else{
				//failure
			}
			
		};

		fetchSongs(playlistID);

	}

	const submitMatchupResult = async (winner: PlaylistSong, losers: PlaylistSong[]) => {
		const playlistID = selectedPlaylist;

		if (!appToken || !playlistID) return;

		const response = await appAxiosInstance.post(`${import.meta.env.VITE_DOMAIN_URL}/api/playlists/${playlistID}/songs`,{
			winner: winner.id,
			losers: losers.map(loser => loser.id)
		});

		if(response.status === 200){

			const data = await response.data;
			
			if (data.success && data.songs) {
				setSelectedPlaylistSongs(data.songs);
			}

			if( data.success && data.waitingList){
				setSelectedPlaylistWaitingList(data.waitingList);
			}

		}
		else{
			//failure
		}

	
	};

	const isTrackInPlaylist = (track:SpotifyTrack) => {
		
		return selectedPlaylistSongs.some((playlistTrack: any) => {
			return playlistTrack.track_info.id === track.id;
		});

	};

	const fetchPlaylists = async () => {
		if (!appToken) return;

		const response = await appAxiosInstance.get(`${import.meta.env.VITE_DOMAIN_URL}/api/playlists`);
		
		if(response.status === 200){

			const data = await response.data;

			if (data.success) {
				setPlaylists(data.playlists);
				return data.playlists;
			}
		}
		else{
			//failure
		}

	};

	const promoteSongInPlaylist = async (track: SpotifyTrack) => {
		if (!appToken || !selectedPlaylist) {
			return;
		}

		const response = await appAxiosInstance.post(`${import.meta.env.VITE_DOMAIN_URL}/api/playlists/${selectedPlaylist}/promote`, {
			track_id: track.id
		});

		//return the updated playlist
		if(response.status === 200){

			const data = await response.data;

			if(data.success && data.songs){
				setSelectedPlaylistSongs(data.songs);
			}
			if(data.success && data.waitingList){
				setSelectedPlaylistWaitingList(data.waitingList);
			}
		}
		else{
			//failure
		}
	}

	const createNewPlaylist = async (name:string, isPublic:boolean, maxSize:number) => {
		if (!appToken) {
			return '';
		}

		if(maxSize > 200 || maxSize < 1){
			return '';
		}

		const response = await appAxiosInstance.post(`${import.meta.env.VITE_DOMAIN_URL}/api/playlists`, {
			name : name, 
			is_public : isPublic, 
			max_length : maxSize 
		});

		if(response.status === 200){

			const data = await response.data;
			if(data.success && data.playlist){
				return data.playlist.id
			}
			else{
				return '';
			}
			
		}
		else{
			//failure
		}
	}

	const saveSongInPlaylist = async (track: SpotifyTrack, active:boolean=false) => {

		if (!appToken || !selectedPlaylist) {
			return;
		}

		const response = await appAxiosInstance.post(`${import.meta.env.VITE_DOMAIN_URL}/api/playlists/${selectedPlaylist}/songs`, {
			track_id: track.id, 
			track_info: track, 
			active: active
		});

		if(response.status === 200){

			const data = await response.data;
			
			if(data.success){
			  addSongToPlaylist(data.song);
			}
			
		} else {
			//failure
		}
	};

	const addSongToPlaylist = (track: PlaylistSong) => {
		if (!isTrackInPlaylist(track.track_info)) {
			setSelectedPlaylistSongs((prevSongs) => [...prevSongs, track]);
		}
	};
  

  // const addTrackToPlaylist = (track:SpotifyTrack) => {

  // }

	return (
		<AppStateContext.Provider 
		value={{ 
			selectedPlaylist, setSelectedPlaylist,
			selectedPlaylistSongs, setSelectedPlaylistSongs,
			playlists, setPlaylists,
			isTrackInPlaylist,
			addSongToPlaylist,
			submitMatchupResult,
			fetchPlaylists,
			getPlaylistRecommendedTracks,
			saveSongInPlaylist,
			selectedPlaylistWaitingList,
			promoteSongInPlaylist,
			createNewPlaylist
		}}>
		{children}
		</AppStateContext.Provider>
	);
};

export const useAppState = () => {
	const context = useContext(AppStateContext);
	if (!context) {
		throw new Error('useAppState must be used within an AppStateProvider');
	}
	return context;
};
