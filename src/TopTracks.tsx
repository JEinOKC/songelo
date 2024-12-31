import { useState, useEffect } from 'react';
import axios from 'axios';

const TopTracks = () => {
  const [topTracks, setTopTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch top tracks when component mounts
  useEffect(() => {
    const token = localStorage.getItem('spotify_access_token');
    if (token) {
      axios
        .get('https://api.spotify.com/v1/me/top/tracks?limit=50', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setTopTracks(response.data.items); // Set top tracks data
          setLoading(false); // Set loading to false after fetching data
        })
        .catch((err) => {
          setError('Failed to fetch top tracks');
          setLoading(false);
        });
    }
  }, []);

  if (loading) {
    return <div>Loading top tracks...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Your Top Tracks</h2>
      <ul>
        {topTracks.map((track: any) => (
          <li key={track.id}>
            <img src={track.album.images[2].url} alt={track.name} style={{ width: 50, height: 50 }} />
            <span>{track.name} by {track.artists[0].name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopTracks;
