import { createContext, useContext, useState, ReactNode } from 'react';
import { PlaylistSong, AppState, SpotifyTrack} from '../types/interfaces';
import { useAuthState } from './AuthStateContext';


const AppStateContext = createContext<AppState | undefined>(undefined);

export const AppStateProvider = ({ children }: { children: ReactNode }) => {
  const [selectedPlaylist, setRawSelectedPlaylist] = useState<string>('');
  const [selectedPlaylistSongs, setSelectedPlaylistSongs] = useState<PlaylistSong[]>([]);
  const { appToken, appTokenExpiration, isTokenExpired, refreshAppToken } = useAuthState();

  const setSelectedPlaylist = (playlistID:string) => {

	
	setRawSelectedPlaylist(playlistID);
	
	if(playlistID === ''){
		setSelectedPlaylistSongs([]);
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

		const data = await response.json();
		
		if (data.success && data.songs) {
			setSelectedPlaylistSongs(data.songs);
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

		const data = await response.json();
		
		if (data.success && data.songs) {
			setSelectedPlaylistSongs(data.songs);
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

	const data = await response.json();

	if (data.success) {
		return data.playlists;
	}
};

  const addSongToPlaylist = (track: PlaylistSong) => {
	if (!isTrackInPlaylist(track.track_info)) {
		setSelectedPlaylistSongs((prevSongs) => [...prevSongs, track]);
		console.log('New playlist:', [...selectedPlaylistSongs, track]);
	}
  };
  

  // const addTrackToPlaylist = (track:SpotifyTrack) => {

  // }

  return (
	<AppStateContext.Provider 
	  value={{ 
		selectedPlaylist, setSelectedPlaylist,
		selectedPlaylistSongs, setSelectedPlaylistSongs,
		isTrackInPlaylist,
		addSongToPlaylist,
		submitMatchupResult,
		fetchPlaylists
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
