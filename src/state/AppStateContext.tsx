import { createContext, useContext, useState, ReactNode } from 'react';

interface AppState {
  selectedPlaylist: string;
  setSelectedPlaylist: (playlistId: string) => void;
}

const AppStateContext = createContext<AppState | undefined>(undefined);

export const AppStateProvider = ({ children }: { children: ReactNode }) => {
  const [selectedPlaylist, setSelectedPlaylist] = useState<string>('');

  return (
    <AppStateContext.Provider 
      value={{ 
        selectedPlaylist, setSelectedPlaylist
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
