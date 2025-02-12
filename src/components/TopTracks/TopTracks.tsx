import { useState, useEffect } from 'react';
import axios from 'axios';
import Song from '../Song/Song';
import { useAppState } from '../../stores/AppStateContext';
import { useAuthState } from '../../stores/AuthStateContext';
import { SpotifyTrack } from '../../types/interfaces';
import './TopTracks.css';

const TopTracks = () => {
  const [topTracks, setTopTracks] = useState<SpotifyTrack[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { selectedPlaylist, isTrackInPlaylist } = useAppState();
  const { spotifyToken } = useAuthState();
  

  useEffect(() => {
    if (spotifyToken) {
      axios
        .get('https://api.spotify.com/v1/me/top/tracks?limit=50', {
          headers: { Authorization: `Bearer ${spotifyToken}` },
        })
        .then((response) => {
          setTopTracks(response.data.items);
          setLoading(false);
        })
        .catch(() => {
          setError('Failed to fetch top tracks');
          setLoading(false);
        });
    }
  }, []);

  if (loading) return (
    <div className="w-full alert-message">Loading top tracks...</div>
  );
  if (error) return <div>{error}</div>;

  return (
    <div className="TopTracks-container">
      <h2 className="page-header">Your Top Tracks</h2>
      <ul>
        {topTracks
        .filter((track: SpotifyTrack) => !isTrackInPlaylist(track))
        .map((track: SpotifyTrack) => (
          <li key={track.id} className="mb-2.5">
            <Song track={track} playlistId={selectedPlaylist} canAddToPlaylist={true}/>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopTracks;
