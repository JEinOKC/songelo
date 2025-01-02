import { useState, useEffect } from 'react';
import CreateSongeloPlaylistForm from './CreateSongeloPlaylistForm';

const SongeloPlaylistsDropdown = () => {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<string>('');

  const fetchPlaylists = async () => {
    const appToken = localStorage.getItem('app_token');
    if (!appToken) return;

    const response = await fetch(`${import.meta.env.VITE_DOMAIN_URL}/api/playlists`, {
      headers: {
        Authorization: `Bearer ${appToken}`,
      },
    });

    const data = await response.json();
    if (data.success) {
      setPlaylists(data.playlists);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPlaylist(event.target.value);
  };

  return (
    <div>
      <label htmlFor="songelo-playlists">Select a playlist:</label>
      <select id="songelo-playlists" value={selectedPlaylist} onChange={handleChange}>
        {playlists.map((playlist) => (
          <option key={playlist.id} value={playlist.id}>
            {playlist.name}
          </option>
        ))}
      </select>
      <CreateSongeloPlaylistForm onCreate={fetchPlaylists} />
    </div>
  );
};

export default SongeloPlaylistsDropdown;
