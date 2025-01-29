import { useState, useEffect } from 'react';
import { useAppState } from '../../stores/AppStateContext';
import './PlaylistRecommendedTracks.css';

interface MatchTrack {
	match_artist: string;
	match_count: number;
	match_score: number;
	match_track_name: string;
	playlist_matches: {
		track: string;
		artist: string;
		spotify_id: string;
	}[];
}

const PlaylistRecommendedTracks = () => {
	const { getPlaylistRecommendedTracks, selectedPlaylist } = useAppState();
	const [tracks, setTracks] = useState<MatchTrack[]>([]);

	useEffect(() => {
		getPlaylistRecommendedTracks(selectedPlaylist).then((data:MatchTrack[]) => {
			console.log('fetch recommended tracks worked as planned',data);
			setTracks(data);
		});
	}, []);

	return (
		<div>
			<h1>Recommended Tracks</h1>
			<ul>
				{tracks.map((track) => (
					<li key={track.match_track_name}>
						<p>Track: {track.match_track_name}</p>
						<p>Artist: {track.match_artist}</p>
						<p>Track Matches: {track.match_count}</p>
						<p>Match Score: {track.match_score}</p>
						<p>Recommendation Based Off Of:</p>
						<ul>
							{track.playlist_matches.map((playlist) => (
								<li key={playlist.spotify_id}>
									<p>Track: {playlist.track}</p>
									<p>Artist: {playlist.artist}</p>
									<p>Spotify ID: {playlist.spotify_id}</p>
								</li>
							))}
						</ul>
					</li>
				))}
			</ul>
		</div>
	)
}

export default PlaylistRecommendedTracks;