import { useState } from 'react';
import { useAuthState } from '../state/AuthStateContext';
import { SongProps, SpotifyTrack } from '../interfaces';
import { useAppState } from '../state/AppStateContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpotify } from '@fortawesome/free-brands-svg-icons'
import './Song.css';

const Song: React.FC<SongProps> = ({ track, playlistId, canAddToPlaylist = true, onPlay }) => {
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const { appToken } = useAuthState();
  const { addSongToPlaylist } = useAppState();

  const handleSpotifyClick = (event:React.MouseEvent<HTMLAnchorElement>,track:SpotifyTrack) => {
    const trackURL = `https://open.spotify.com/track/${track.id}`;
    console.log('trackURL',trackURL);
    // window.open(trackURL, '_blank', 'noopener,noreferrer');
    onPlay ? onPlay(event,track) : null;
  }

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
    <div>
      <div className="song-container" key={track.id}>
        <img
          src={track.album.images[2].url}
          alt={track.name}
        />
        <div className="track-info">
          <span className="song" title={track.name} >
            {track.name}
          </span>
          <span className="artist" title={track.artists[0].name}>
            {track.artists[0].name}
          </span>
          <a
            href="#"
            onClick={(e:React.MouseEvent<HTMLAnchorElement>)=>{
              e.preventDefault();
              handleSpotifyClick(e,track);
            }} 
            className='spotify-link'
          >
            Play On Spotify <FontAwesomeIcon icon={faSpotify} size="lg" />
          </a>
        </div>
      </div>
      {canAddToPlaylist && (
          <div className='add-to-playlist-container'>
            <a 
              href="#" 
              onClick={(e)=>{
                e.preventDefault();
                handleAddToPlaylist();
              }} 
              className={isAdding ? 'disabled' : ''}>
              {isAdding ? 'Adding...' : 'Add to Playlist'}
            </a>
          </div>
      )}
    </div>
  );
};

export default Song;
