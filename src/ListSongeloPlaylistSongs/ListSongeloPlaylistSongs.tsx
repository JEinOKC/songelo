import { useEffect } from 'react';
import Song from '../Song/Song';
import { useAuthState } from '../state/AuthStateContext';
import { useAppState } from '../state/AppStateContext';

const ListSongeloPlaylistSongs = ({ playlistId }: { playlistId: string }) => {
  const { appToken } = useAuthState();
  const { selectedPlaylistSongs, setSelectedPlaylistSongs } = useAppState();

  useEffect(() => {
    const fetchSongs = async () => {
      if (!appToken || !playlistId) return;

      const response = await fetch(`${import.meta.env.VITE_DOMAIN_URL}/api/playlists/${playlistId}/songs`, {
        headers: {
          Authorization: `Bearer ${appToken}`,
        },
      });

      const data = await response.json();
      
      if (data.success && data.songs) {
        setSelectedPlaylistSongs(data.songs);
      }
    };

    fetchSongs();
  }, [playlistId]);

  return (
    <div>
      <h2>Songs in Playlist</h2>
      <ul>
        {selectedPlaylistSongs.map((song) => (
          <li key={song.id}>
            <Song track={song.track_info} playlistId={playlistId} canAddToPlaylist={false} onSongAdded={undefined} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListSongeloPlaylistSongs;
