import React from 'react';
import { useAuthState } from '../state/AuthStateContext';
import { PlaybackControlProps } from '../interfaces';

const PlaybackControl: React.FC<PlaybackControlProps> = ({ track, onClose }) => {
  const { spotifyToken } = useAuthState();
  const playTrack = async () => {
    if (spotifyToken) {
      try {
        await fetch('https://api.spotify.com/v1/me/player/play', {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${spotifyToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uris: [track.uri], // Play the selected track
          }),
        });
      } catch (error) {
        console.error('Error playing track:', error);
      }
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.8)', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h2>{track.name} by {track.artists[0].name}</h2>
      <img src={track.album.images[1].url} alt={track.name} style={{ width: 200, height: 200 }} />
      <button onClick={playTrack} style={{ margin: '10px', padding: '10px', fontSize: '16px' }}>Play</button>
      <button onClick={onClose} style={{ margin: '10px', padding: '10px', fontSize: '16px' }}>Close</button>
    </div>
  );
};

export default PlaybackControl;
