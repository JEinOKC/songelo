import { createContext, useContext, useState, ReactNode } from 'react';

interface AppState {
  selectedPlaylist: string;
  setSelectedPlaylist: (playlistId: string) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (loggedIn: boolean) => void;
  spotifyToken: string;
  setSpotifyToken: (token: string) => void;
  appToken: string;
  setAppToken: (token: string) => void;
}

const AppStateContext = createContext<AppState | undefined>(undefined);

export const AppStateProvider = ({ children }: { children: ReactNode }) => {
  const [selectedPlaylist, setSelectedPlaylist] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  return (
    <AppStateContext.Provider 
      value={{ 
        selectedPlaylist, setSelectedPlaylist,
        isLoggedIn, setIsLoggedIn,
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
