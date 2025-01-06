import { useState, useEffect } from 'react';
import CreateSongeloPlaylistForm from '../CreateSongeloPlaylistForm/CreateSongeloPlaylistForm';
import { useAppState } from '../state/AppStateContext';

const SongeloPlaylistsDropdown = () => {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const { selectedPlaylist, setSelectedPlaylist } = useAppState();
  const [wantNewPlaylist, setWantNewPlaylist] = useState<boolean>(false);

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
      {playlists.length > 0 ? (
      <select id="songelo-playlists" value={selectedPlaylist} onChange={handleChange}>
        <option value="" disabled>Select a playlist</option>
        {playlists.map((playlist) => (
          <option key={playlist.id} value={playlist.id}>
            {playlist.name}
          </option>
        ))}
      </select>)
      : (
        <div>No Playlists Available</div>
      )
    }
      {wantNewPlaylist && <CreateSongeloPlaylistForm onCreate={fetchPlaylists} />}
      
      {
        wantNewPlaylist ? 
       (
        <button onClick={() => {setWantNewPlaylist(false)}}>Cancel</button>
       ) 
        :
        (<button onClick={() => {setWantNewPlaylist(true)}}>Create New Playlist</button>)
      }

    </div>
  );
};

export default SongeloPlaylistsDropdown;
