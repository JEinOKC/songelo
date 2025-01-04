import { useState, useEffect } from 'react';
import Song from './Song';

const ListSongeloPlaylistSongs = ({ playlistId }: { playlistId: string }) => {
  const [songs, setSongs] = useState<any[]>([]);

  useEffect(() => {
    const fetchSongs = async () => {
      const appToken = localStorage.getItem('app_token');
      if (!appToken || !playlistId) return;

      const response = await fetch(`${import.meta.env.VITE_DOMAIN_URL}/api/playlists/${playlistId}/songs`, {
        headers: {
          Authorization: `Bearer ${appToken}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setSongs(data.songs);
      }
    };

    fetchSongs();
  }, [playlistId]);

  return (
    <div>
      <h2>Songs in Playlist</h2>
      <ul>
        {songs.map((song) => (
          <li key={song.id}>
            <Song track={song.track_info} playlistId={playlistId} canAddToPlaylist={false} onSongAdded={undefined} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListSongeloPlaylistSongs;