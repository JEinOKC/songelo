import { useState, useEffect } from 'react';
import axios from 'axios';
import Song from './Song';


const TopTracks = () => {
  const [topTracks, setTopTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('spotify_access_token');
    if (token) {
      axios
        .get('https://api.spotify.com/v1/me/top/tracks?limit=50', {
          headers: { Authorization: `Bearer ${token}` },
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

  if (loading) return <div>Loading top tracks...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Your Top Tracks</h2>
      <ul>
        {topTracks.map((track: any) => (
          <li key={track.id}>
            <Song track={track} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopTracks;
