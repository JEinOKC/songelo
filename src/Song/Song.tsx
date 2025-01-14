import { useState } from 'react';
import { useAuthState } from '../state/AuthStateContext';
import { SongProps } from '../interfaces';
import { useAppState } from '../state/AppStateContext';
import './Song.css';

const Song: React.FC<SongProps> = ({ track, playlistId, canAddToPlaylist = true }) => {
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const { appToken } = useAuthState();
  const { addSongToPlaylist } = useAppState();

  const handleAddToPlaylist = async () => {
    setIsAdding(true);
    if (!appToken || !playlistId) {
      console.error({
        'appToken': appToken,
        'playlistId': playlistId
      });
      setIsAdding(false);
      return;
    }

    const response = await fetch(`${import.meta.env.VITE_DOMAIN_URL}/api/playlists/${playlistId}/songs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${appToken}`,
      },
      body: JSON.stringify({ track_id: track.id, track_info: track }),
    });

    if (response.ok) {
      const data = await response.json();
      
      if(data.success){
        addSongToPlaylist(data.song);
      }
      
    } else if (!response.ok) {
      alert('Failed to add song to playlist.');
    }
    setIsAdding(false);
  };

  return (
    <span className="song-container" key={track.id}>
      <img
        src={track.album.images[2].url}
        alt={track.name}
      />
      <div className="track-info">
        <span className="song">
          {track.name}
        </span>
        <span className="artist">
          {track.artists[0].name}
        </span>
        <a
          href={`https://open.spotify.com/track/${track.id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Play on Spotify
        </a>
      </div>
      <br />
      
      <br />
      {canAddToPlaylist && (
        <button onClick={handleAddToPlaylist} disabled={isAdding}>
          {isAdding ? 'Adding...' : 'Add to Playlist'}
        </button>
      )}
    </span>
  );
};

export default Song;
