import { createContext, useContext, useState, ReactNode } from 'react';
import { PlaylistSong, AppState, SpotifyTrack} from '../interfaces';


const AppStateContext = createContext<AppState | undefined>(undefined);

export const AppStateProvider = ({ children }: { children: ReactNode }) => {
  const [selectedPlaylist, setSelectedPlaylist] = useState<string>('');
  const [selectedPlaylistSongs, setSelectedPlaylistSongs] = useState<PlaylistSong[]>([]);

  const isTrackInPlaylist = (track:SpotifyTrack) => {
    
    return selectedPlaylistSongs.some((playlistTrack: any) => {
      return playlistTrack.track_info.id === track.id;
    });

  };

  // const addTrackToPlaylist = (track:SpotifyTrack) => {

  // }

  return (
    <AppStateContext.Provider 
      value={{ 
        selectedPlaylist, setSelectedPlaylist,
        selectedPlaylistSongs, setSelectedPlaylistSongs,
        isTrackInPlaylist
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
