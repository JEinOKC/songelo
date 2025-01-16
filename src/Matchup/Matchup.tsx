import { useEffect, useState } from 'react';
import { useAppState } from '../state/AppStateContext';
import { PlaylistSong, SpotifyTrack } from '../interfaces';
import Song from '../Song/Song';

const Matchup = () => {

	const { selectedPlaylist, selectedPlaylistSongs } = useAppState();
	const [matchupHappening, setMatchupHappening] = useState(false);
	const [matchupSongs, setMatchupSongs] = useState<PlaylistSong[]>([]);
	// const recentSongs = new Set<PlaylistSong>();

	const matchupSize = 4;
	const decayTime:number = 0.000005//a smaller decay number will theoretically make it take longer for a song to re-appear on a matchup

	useEffect(()=>{
		console.log('selectedPlaylist',selectedPlaylist);
		console.log('selectedPlaylistSongs',selectedPlaylistSongs);
		resetMatchup();
		console.log('matchupSongs',matchupSongs);
	},[matchupHappening])
	useEffect(()=>{
		//may or may not need this...
	},[selectedPlaylist]);

	const findRandomSongs = (count: number): PlaylistSong[] => {
		const usedIndices = new Set<number>();
		const result: PlaylistSong[] = [];
		const currentTime = Date.now();
		
	  
		if (count >= selectedPlaylistSongs.length) {
		  return [...selectedPlaylistSongs];
		}
	  
		// Step 1: Calculate weights for all songs
		const weights = selectedPlaylistSongs.map((song) => {

			const lastPlayed = song.lastPlayed ?? 0;

			// For unplayed songs, we want a weight of 1
			if (lastPlayed === 0) {
				return 1;
			}
			
			const timeSincePlayed = currentTime - lastPlayed;
			const sigmoidValue = 1 / (1 + Math.exp(-decayTime * timeSincePlayed)); // Sigmoid decay

			// Stretch the sigmoid value to our desired range
			// For example, transform 0.5 to 0.1, and 1 to 1, by applying a linear transformation
			const transformedWeight = (sigmoidValue - 0.5) * 0.8 + 0.1;

  			return transformedWeight;


		});
	  
		// Step 2: Normalize weights to create a probability distribution
		const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
		const normalizedWeights = weights.map((weight) => weight / totalWeight);
	  
		// Step 3: Weighted random selection
		while (result.length < count) {
		  const random = Math.random();
		  let cumulative = 0;
	  
		  for (let i = 0; i < selectedPlaylistSongs.length; i++) {
			cumulative += normalizedWeights[i];
			if (random <= cumulative && !usedIndices.has(i)) {
			  usedIndices.add(i);
			  result.push(selectedPlaylistSongs[i]);
			  break;
			}
		  }
		}
	  
		return result;
	}

	const resetMatchup = ()=>{
		console.log('resetting the matchup');
		setMatchupSongs(findRandomSongs(matchupSize));
	}

	const songWasChosen = (_?:React.MouseEvent<HTMLAnchorElement>,track?:SpotifyTrack)=>{
		const now = Date.now();
		
		if(track){
			//find the spotify track in the selected matchup songs
			matchupSongs.forEach(song =>{
				if(song.track_info.id === track.id){
					song.lastPlayed = now;
					return;
				}
			})
		}
		
		resetMatchup();
	}
	

	return (<div>
		{matchupHappening ? 
		<>
			<span>matchup happening</span>

			{matchupSongs.map((song) => (
				<li key={song.id}>
					<Song track={song.track_info} playlistId={selectedPlaylist} canAddToPlaylist={false} onPlay={songWasChosen} />
				</li>
			))}

			<button onClick={resetMatchup}>Shuffle</button>
			<button onClick={()=>setMatchupHappening(false)}>Done</button>
			
		</>
		:
		<button onClick={()=>setMatchupHappening(true)}>
			Create Matchup
		</button>
		}
		
	</div>
	);
}

export default Matchup;