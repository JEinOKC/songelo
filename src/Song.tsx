import { useState } from 'react';

interface SongProps {
  track: {
    id: string;
    name: string;
    artists: { name: string }[];
    album: { images: { url: string }[] };
  };
  playlistId: string;
  onSongAdded?: () => void;
  canAddToPlaylist?: boolean;
}

const Song: React.FC<SongProps> = ({ track, playlistId, onSongAdded, canAddToPlaylist = true }) => {
  const [isAdding, setIsAdding] = useState<boolean>(false);

  const handleAddToPlaylist = async () => {
    setIsAdding(true);
    const appToken = localStorage.getItem('app_token');
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

    if (response.ok && onSongAdded) {
      onSongAdded();
    } else if (!response.ok) {
      alert('Failed to add song to playlist.');
    }
    setIsAdding(false);
  };

  return (
    <span key={track.id}>
      <img
        src={track.album.images[2].url}
        alt={track.name}
        style={{ width: 50, height: 50 }}
      />
      <span>
        {track.name} by {track.artists[0].name}
      </span>
      <br />
      <a
        href={`https://open.spotify.com/track/${track.id}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Play on Spotify
      </a>
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
