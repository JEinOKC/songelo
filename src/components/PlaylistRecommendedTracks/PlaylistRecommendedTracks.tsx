import { useState, useEffect } from 'react';
import { useAppState } from '../../stores/AppStateContext';
import { useAuthState } from '../../stores/AuthStateContext';
import './PlaylistRecommendedTracks.css';
import { SpotifyTrack, MatchTrack, SpotifySearchResult  } from '../../types/interfaces';
import Song from '../Song/Song';



const PlaylistRecommendedTracks = () => {
	const { getPlaylistRecommendedTracks, selectedPlaylist, selectedPlaylistSongs } = useAppState();
	const { spotifyToken } = useAuthState();
	const [tracks, setTracks] = useState<MatchTrack[]>([]);
	const [tracksLoaded, setTracksLoaded] = useState<boolean>(false);
	const [spotifyRecommendations, setSpotifyRecommendations] = useState<any[]>([]);
	const [findMoreTracks, setFindMoreTracks] = useState<boolean>(false);
	const maxRecommendations = 10;
	const [hiddenRecommendations, setHiddenRecommendations] = useState<any[]>([]);
	const [trackRecommendationIndex, setTrackRecommendationIndex] = useState(0);

	// Fetch playlist recommended tracks once when component mounts or playlist changes
	useEffect(() => {

		if(!selectedPlaylist) return;

		setTracks([]);
		setTracksLoaded(false);

		getPlaylistRecommendedTracks(selectedPlaylist)
			.then((data:MatchTrack[]) => {
			setTracks(data);
			setTracksLoaded(true);
			})
			.catch((error) => {
				console.error('Error fetching recommended tracks:', error);
			});
		
	}, [selectedPlaylist]);

	//fetch Spotify recommendations when tracks are loaded
	useEffect(() =>{
		if(tracksLoaded){
			setTrackRecommendationIndex(0);
			findRecommendationOnSpotfiy();
		}
	}, [tracksLoaded]);

	useEffect(() => {
		if(spotifyRecommendations.length < maxRecommendations && trackRecommendationIndex < tracks.length){
			setFindMoreTracks(true);
			findRecommendationOnSpotfiy();
		}
		else{
			setFindMoreTracks(false);
		}

	}, [spotifyRecommendations]);

	const hideRecommendation = (recommendation: SpotifyTrack) => {
		// Use functional update to ensure latest state
		setHiddenRecommendations((prevHidden) => [...prevHidden, recommendation]);
	
		// Remove recommendation from spotifyRecommendations
		setSpotifyRecommendations((prevRecommendations) =>
			prevRecommendations.filter((rec) => rec.id !== recommendation.id)
		);
	};
	

	const findRecommendationOnSpotfiy = async () => {
		if (!spotifyToken) return;

		if(trackRecommendationIndex >= tracks.length){
			return;
		}

		const track = tracks[trackRecommendationIndex];

		const query = `track:${track.match_track_name} artist:${track.match_artist}`;
		const encodedQuery = encodeURIComponent(query);

		const response = await fetch(`https://api.spotify.com/v1/search?type=track&limit=1&q=${encodedQuery}`, {
			headers: {
			Authorization: `Bearer ${spotifyToken}`,
			},
		});

      	const result:SpotifySearchResult = await response.json();

		if(result.tracks.items.length > 0){	
			const recommendation = result.tracks.items[0];
			const alreadyExists = selectedPlaylistSongs.some(item => item.track_info.id === recommendation.id);

			if(alreadyExists){
				console.log({'this recommendation already exists in the playlist':recommendation});
				setSpotifyRecommendations([...spotifyRecommendations]);
			}
			//only add the recommendation if it is not already in the list
			else if(!spotifyRecommendations.some((rec) => rec.id === recommendation.id) && !hiddenRecommendations.some((rec) => rec.id === recommendation.id)){
				setSpotifyRecommendations([...spotifyRecommendations,recommendation]);
			}

			// setSpotifyRecommendations([...spotifyRecommendations,recommendation]);
		}

		setTrackRecommendationIndex(trackRecommendationIndex+1);
		
	}

	// console.log('line 104');
	// spotifyRecommendations.map((recommendation) => {
	// 	console.log({'recommendation':recommendation});
	// });

	return (
		<div>
			
			{findMoreTracks && (
				<p>Finding Recommendations...</p>
			)}

			<h1>Spotify Recommendations</h1>
			<ul>
				{spotifyRecommendations.map((recommendation) => (
					<li key={recommendation.id} className="spotify-recommendation">
						<Song track={recommendation} playlistId={selectedPlaylist} canAddToPlaylist={true}/>
						<div className="spotify-recommendation-actions">
							<a href="#" onClick={(e)=>{
								e.preventDefault();
								hideRecommendation(recommendation);
							}}>Hide Recommendation</a>
						</div>
					</li>
				))}

				{spotifyRecommendations.length === 0 && (
					<li>No recommendations available. Please come back as you add more songs.</li>
				)}
			</ul>

			{/* <h1>Last.fm Recommended Tracks</h1>
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
			</ul> */}
		</div>
	)
}

export default PlaylistRecommendedTracks;