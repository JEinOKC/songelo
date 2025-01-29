import { useState, useEffect } from 'react';
import { useAuthState } from '../../stores/AuthStateContext';

const PlaylistsDropdown = () => {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<string>('');
  const { spotifyToken } = useAuthState();

  useEffect(() => {
    const fetchPlaylists = async () => {
      if (!spotifyToken) return;

      const response = await fetch('https://api.spotify.com/v1/me/playlists', {
        headers: {
          Authorization: `Bearer ${spotifyToken}`,
        },
      });

      const data = await response.json();
      setPlaylists(data.items);
    };

    fetchPlaylists();
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPlaylist(event.target.value);
  };

  return (
    <div>
      <label htmlFor="playlists">Select a playlist:</label>
      <select id="playlists" value={selectedPlaylist} onChange={handleChange}>
        {playlists.map((playlist) => (
          <option key={playlist.id} value={playlist.id}>
            {playlist.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default PlaylistsDropdown;
