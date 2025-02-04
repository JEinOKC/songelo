import { createContext, useContext, useState, ReactNode } from 'react';
import { PlaylistSong, AppState, SpotifyTrack, Playlist} from '../types/interfaces';
import { useAuthState } from './AuthStateContext';


const AppStateContext = createContext<AppState | undefined>(undefined);

export const AppStateProvider = ({ children }: { children: ReactNode }) => {
	const [selectedPlaylist, setRawSelectedPlaylist] = useState<string>('');
	const [playlists, setPlaylists] = useState<Playlist[]>([]);
	const [selectedPlaylistSongs, setSelectedPlaylistSongs] = useState<PlaylistSong[]>([]);
	const [selectedPlaylistWaitingList, setSelectedPlaylistWaitingList] = useState<PlaylistSong[]>([]);
	const { appToken, appTokenExpiration, isTokenExpired, refreshAppToken } = useAuthState();

	const getPlaylistRecommendedTracks = async (playlistID:string) => {
		if (!appToken || !playlistID) return;

		if(isTokenExpired(appTokenExpiration)){
			await refreshAppToken();
		}

		const response = await fetch(`${import.meta.env.VITE_DOMAIN_URL}/api/playlists/${playlistID}/recommended/tracks`, {
			headers: {
				Authorization: `Bearer ${appToken}`,
			},
		});

		if(response.ok){

			const data = await response.json();

			if (data.success) {
				return data.tracks;
			}

		}
		else{
			await refreshAppToken();
			getPlaylistRecommendedTracks(playlistID);
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

			if(isTokenExpired(appTokenExpiration)){
				await refreshAppToken();
			}

			const response = await fetch(`${import.meta.env.VITE_DOMAIN_URL}/api/playlists/${playlistID}/songs`, {
				headers: {
				Authorization: `Bearer ${appToken}`,
				},
			});

			if(response.ok){

				const data = await response.json();
				
				if (data.success && data.songs) {
					setSelectedPlaylistSongs(data.songs);
				}

				if(data.success && data.waitingList){
					setSelectedPlaylistWaitingList(data.waitingList);
				}

			}
			else{
				await refreshAppToken();
				fetchSongs(playlistID);
			}
		};

		fetchSongs(playlistID);

	}

	const submitMatchupResult = async (winner: PlaylistSong, losers: PlaylistSong[]) => {
		const playlistID = selectedPlaylist;

		if (!appToken || !playlistID) return;

		if(isTokenExpired(appTokenExpiration)){
			await refreshAppToken();
		}

		const response = await fetch(`${import.meta.env.VITE_DOMAIN_URL}/api/playlists/${playlistID}/matchup`, {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${appToken}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				winner: winner.id,
				losers: losers.map(loser => loser.id)
			})
		});

		if(response.ok){

			const data = await response.json();
			
			if (data.success && data.songs) {
				setSelectedPlaylistSongs(data.songs);
			}

			if( data.success && data.waitingList){
				setSelectedPlaylistWaitingList(data.waitingList);
			}

		}
		else{
			await refreshAppToken();
			submitMatchupResult(winner, losers);
		}

	
	};

	const isTrackInPlaylist = (track:SpotifyTrack) => {
		
		return selectedPlaylistSongs.some((playlistTrack: any) => {
			return playlistTrack.track_info.id === track.id;
		});

	};

	const fetchPlaylists = async () => {
		if (!appToken) return;

		if(isTokenExpired(appTokenExpiration)){
			await refreshAppToken();
		}

		const response = await fetch(`${import.meta.env.VITE_DOMAIN_URL}/api/playlists`, {
			headers: {
				Authorization: `Bearer ${appToken}`,
			},
		});
console.log(response);
		if(response.ok){

			const data = await response.json();

			if (data.success) {
				console.log({'playlists':data.playlists});
				setPlaylists(data.playlists);
				return data.playlists;
			}
		}
		else{
			await refreshAppToken();
			fetchPlaylists();
		}

	};

	const promoteSongInPlaylist = async (track: SpotifyTrack) => {
		if (!appToken || !selectedPlaylist) {
			return;
		}

		if(isTokenExpired(appTokenExpiration)){
			await refreshAppToken();
		}

		const response = await fetch(`${import.meta.env.VITE_DOMAIN_URL}/api/playlists/${selectedPlaylist}/promote`, {
			method: 'POST',
			headers: {
			  'Content-Type': 'application/json',
			  Authorization: `Bearer ${appToken}`,
			},
			body: JSON.stringify({ track_id: track.id }),
		});

		//return the updated playlist
		if(response.ok){
			const data = await response.json();
			if(data.success && data.songs){
				setSelectedPlaylistSongs(data.songs);
			}
			if(data.success && data.waitingList){
				setSelectedPlaylistWaitingList(data.waitingList);
			}
		}
		else{
			await refreshAppToken();
			promoteSongInPlaylist(track);
		}
	}

	const createNewPlaylist = async (name:string, isPublic:boolean, maxSize:number) => {
		if (!appToken) {
			return '';
		}

		if(isTokenExpired(appTokenExpiration)){
			await refreshAppToken();
		}

		if(maxSize > 200 || maxSize < 1){
			return '';
		}

		const response = await fetch(`${import.meta.env.VITE_DOMAIN_URL}/api/playlists`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${appToken}`,
			},
			body: JSON.stringify({ 
				'name' : name, 
				'is_public' : isPublic, 
				'max_length' : maxSize 
			}),
		});

		if(response.ok){
			const data = await response.json();
			if(data.success && data.playlist){
				return data.playlist.id
			}
			else{
				return '';
			}
			
		}
		else{
			await refreshAppToken();
			return createNewPlaylist(name, isPublic, maxSize);
		}
	}

	const saveSongInPlaylist = async (track: SpotifyTrack, active:boolean=false) => {

		if (!appToken || !selectedPlaylist) {
			return;
		}

		if(isTokenExpired(appTokenExpiration)){
			await refreshAppToken();
		}


		const response = await fetch(`${import.meta.env.VITE_DOMAIN_URL}/api/playlists/${selectedPlaylist}/songs`, {
			method: 'POST',
			headers: {
			  'Content-Type': 'application/json',
			  Authorization: `Bearer ${appToken}`,
			},
			body: JSON.stringify({ track_id: track.id, track_info: track, active: active }),
		});

		if (response.ok) {
			const data = await response.json();
			
			if(data.success){
			  addSongToPlaylist(data.song);
			}
			
		} else {
			await refreshAppToken();
			saveSongInPlaylist(track,active);
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
