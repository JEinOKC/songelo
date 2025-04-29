import { createContext, useContext, useState, ReactNode } from 'react';
import { PlaylistSong, AppState, SpotifyTrack, Playlist} from '../types/interfaces';
import { useAuthState } from './AuthStateContext';


const AppStateContext = createContext<AppState | undefined>(undefined);

export const AppStateProvider = ({ children }: { children: ReactNode }) => {
	const [selectedPlaylist, setRawSelectedPlaylist] = useState<string>('');
	const [playlists, setPlaylists] = useState<Playlist[]>([]);
	const [selectedPlaylistSongs, setSelectedPlaylistSongs] = useState<PlaylistSong[]>([]);
	const [selectedPlaylistWaitingList, setSelectedPlaylistWaitingList] = useState<PlaylistSong[]>([]);
	const { appToken, appAxiosInstance, handleLogout } = useAuthState();
	const [loadingPlaylists, setLoadingPlaylists] = useState<boolean>(true);

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
		setLoadingPlaylists(true);
		
		setRawSelectedPlaylist(playlistID);
		
		if(playlistID === ''){
			setSelectedPlaylistSongs([]);
			setSelectedPlaylistWaitingList([]);
			setLoadingPlaylists(false);
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

			setLoadingPlaylists(false);
			
		};

		fetchSongs(playlistID);

	}

	const submitMatchupResult = async (winner: PlaylistSong, losers: PlaylistSong[]) => {
		const playlistID = selectedPlaylist;

		if (!appToken || !playlistID) return;

		const response = await appAxiosInstance.post(`${import.meta.env.VITE_DOMAIN_URL}/api/playlists/${playlistID}/matchup`,{
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

	const fetchPlaylistExportData = async () => {
		const playlistID = selectedPlaylist;

		if (!appToken || !playlistID) return;

		const response = await appAxiosInstance.get(`${import.meta.env.VITE_DOMAIN_URL}/api/playlists/${playlistID}/export`);
		if(response.status === 200){
			const data = await response.data;
			if (data.success) {
				return data.exportData;
			}
		}
		else{
			//failure
			return null;
		}
	};

	const submitExportedPlaylist = async (spotifyPlaylistID:string) => {
		if (!appToken || !selectedPlaylist) return;

		const response = await appAxiosInstance.post(`${import.meta.env.VITE_DOMAIN_URL}/api/playlists/${selectedPlaylist}/export`,{
			spotify_playlist_id: spotifyPlaylistID
		});

		if(response.status === 200){
			const data = await response.data;
			if (data.success) {
				return data.result;
			}
		}
		else{
			//failure
			return null;
		}
	};

	const getCurrentPlaylistName = ():string => {
		if(!playlists.length || !selectedPlaylist){
			return '';
		}

		for(var i = 0; i < playlists.length; i++){
			if(playlists[i].id === selectedPlaylist){
				return playlists[i].name;
			}
		}
		
		return '';
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

	const forgetUser = async () => {
		await handleLogout();

		return;
		if (!appToken) {
			return;
		}

		const response = await appAxiosInstance.post(`${import.meta.env.VITE_DOMAIN_URL}/api/forget-me`);

		if(response.status === 200){
			const data = await response.data;
			if(data.success){
				handleLogout();
				return true;
			}
		}
		else{
			//failure
			return false;
		}
	}

	const downloadMyData = async () => {
		if (!appToken) {
			return;
		}
		const response = await appAxiosInstance.get(`${import.meta.env.VITE_DOMAIN_URL}/api/user-data`);
		if(response.status === 200){
			const data = await response.data;
			if(data.success){
				
				const jsonData = JSON.stringify(data.userData);

				const blob = new Blob([jsonData], { type: 'application/json' });
				const url = URL.createObjectURL(blob);
				const downloadLink = document.createElement('a');
				downloadLink.href = url;
				downloadLink.download = 'songelo_data.json';
				document.body.appendChild(downloadLink);
				downloadLink.click();
				URL.revokeObjectURL(url);
				// Clean up and remove the link
				downloadLink.remove();
			}
		}
		else{
			//failure
		}
	}

	const saveMultipleSongsInPlaylist = async (tracks: SpotifyTrack[], active:boolean=true) =>{
		if (!appToken || !selectedPlaylist) {
			return;
		}

		const response = await appAxiosInstance.post(`${import.meta.env.VITE_DOMAIN_URL}/api/playlists/${selectedPlaylist}/songs`, {
			tracks: tracks.map((song) =>{
				return {
					track_id: song.id,
					track_info: song,
					active: active
				}
			}),
			active: active
		});

		if(response.status === 200){

			const data = await response.data;
			
			if(data.success){
				addMultipleSongsToPlaylist(data.songs);
			}
			
		} else {
			//failure
		}
	}

	//this was created before the save multiple functionality and now they are the same.
	const saveSongInPlaylist = async (track: SpotifyTrack, active:boolean=false) => {
		return saveMultipleSongsInPlaylist([track], active);
	};

	const addSongToPlaylist = (track: PlaylistSong) => {
		if (!isTrackInPlaylist(track.track_info)) {
			setSelectedPlaylistSongs((prevSongs) => [...prevSongs, track]);
		}
	};

	const addMultipleSongsToPlaylist = (tracks: PlaylistSong[]) => {
		
		setSelectedPlaylistSongs((prevSongs) => [...prevSongs, ...tracks.filter((track) => {
			return !isTrackInPlaylist(track.track_info)
		})]);
		
	}
  

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
			saveMultipleSongsInPlaylist,
			selectedPlaylistWaitingList,
			promoteSongInPlaylist,
			createNewPlaylist,
			loadingPlaylists,
			fetchPlaylistExportData,
			submitExportedPlaylist,
			getCurrentPlaylistName,
			downloadMyData,
			forgetUser
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
