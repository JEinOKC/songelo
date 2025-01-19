import { createContext, useContext, useState, ReactNode } from 'react';
import { PlaylistSong, AppState, SpotifyTrack} from '../interfaces';
import { useAuthState } from './AuthStateContext';


const AppStateContext = createContext<AppState | undefined>(undefined);

export const AppStateProvider = ({ children }: { children: ReactNode }) => {
  const [selectedPlaylist, setRawSelectedPlaylist] = useState<string>('');
  const [selectedPlaylistSongs, setSelectedPlaylistSongs] = useState<PlaylistSong[]>([]);
  const { appToken } = useAuthState();

  const setSelectedPlaylist = (playlistID:string) => {
	
	setRawSelectedPlaylist(playlistID);
	
	if(playlistID === ''){
		setSelectedPlaylistSongs([]);
		return;
	}

	const fetchSongs = async (playlistID:string) => {
		
		if (!appToken || !playlistID) return;

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

  const isTrackInPlaylist = (track:SpotifyTrack) => {
	
	return selectedPlaylistSongs.some((playlistTrack: any) => {
	  return playlistTrack.track_info.id === track.id;
	});

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
		addSongToPlaylist
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
