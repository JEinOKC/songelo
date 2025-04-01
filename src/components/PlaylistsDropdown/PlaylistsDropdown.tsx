import { useState, useEffect } from 'react';
import { useAuthState } from '../../stores/AuthStateContext';
import SpotifyComms from '../../utils/SpotifyComms';

const PlaylistsDropdown = () => {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<string>('');
  const { spotifyToken } = useAuthState();
  const { getPlaylists } = SpotifyComms();

  useEffect(() => {
    const fetchPlaylists = async () => {
      if (!spotifyToken) return;

      try {
        const response = await getPlaylists();
        setPlaylists(response);  
      } catch (error) {
        console.error('Error fetching playlists:', error);
      }
      
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
