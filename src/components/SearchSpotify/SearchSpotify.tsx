import { useState, useEffect } from 'react';
import axios from 'axios';
import Song from '../Song/Song';
import { useAppState } from '../../stores/AppStateContext';
import { useAuthState } from '../../stores/AuthStateContext';
import { SpotifyTrack } from '../../types/interfaces';
import './SearchSpotify.css';

const SpotifyRecommendations = () => {
	const [searchResults, setSearchResults] = useState<SpotifyTrack[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const { selectedPlaylist, isTrackInPlaylist } = useAppState();
	const { spotifyToken } = useAuthState();

	useEffect(() => {
		
	}, []);

	const performSpotifySearch = () => {
		const fakeQueryString = 'q=track:Never%20Gonna%20Give%20You%20Up%20';
		if (spotifyToken) {
			axios
				.get('https://api.spotify.com/v1/search', {
					headers: { Authorization: `Bearer ${spotifyToken}` },
					params: {
						offset: 0,
						limit: 10,
						type: 'track',
						q: fakeQueryString
					}
				})
				.then((response) => {
					setSearchResults(response.data.items);
					setLoading(false);
				})
				.catch(() => {
					setError('Failed to fetch recommendations');
					setLoading(false);
				});
		}
	}

	if (loading) return <div>Searching Spotify...</div>;
  	if (error) return <div>{error}</div>;

	return (
		<>
			{searchResults && searchResults.length > 0 ? (
				<div>
					<h2 className="page-header">Your Search Results</h2>
					<ul>
						{searchResults
						.filter((track: SpotifyTrack) => !isTrackInPlaylist(track))
						.map((track: SpotifyTrack) => (
						<li key={track.id}>
							<Song track={track} playlistId={selectedPlaylist} canAddToPlaylist={true}/>
						</li>
						))}
					</ul>
				</div>	
			) : (searchResults && searchResults.length === 0) ? (
				<div>
					<button onClick={performSpotifySearch}>Search Spotify</button>
				</div>
			)
			:
			(
				<></>
			)
		}
			
		</>
	  );
};

export default SpotifyRecommendations;