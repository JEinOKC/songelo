import { useEffect, useState } from 'react';
import { useAppState } from '../../stores/AppStateContext';
import { PlaylistSong, SpotifyTrack } from '../../types/interfaces';
import Song from '../Song/Song';
import './Matchup.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShuffle } from '@fortawesome/free-solid-svg-icons';

const Matchup = () => {

	const { selectedPlaylist, selectedPlaylistSongs, submitMatchupResult } = useAppState();
	const [matchupHappening] = useState(true);
	const [matchupSongs, setMatchupSongs] = useState<PlaylistSong[]>([]);

	const matchupSize = 4;
	const decayTime:number = 0.000005//a smaller decay number will theoretically make it take longer for a song to re-appear on a matchup

	useEffect(()=>{
		resetMatchup();
	},[matchupHappening])
	useEffect(()=>{
		resetMatchup();
	},[selectedPlaylist,selectedPlaylistSongs]);

	const findRandomSongs = (count: number): PlaylistSong[] => {
		const usedIndices = new Set<number>();
		const result: PlaylistSong[] = [];
		const currentTime = Date.now();

		const selectablePlaylistSongs = selectedPlaylistSongs.filter((song) => song.active === true);
	  
		if (count >= selectablePlaylistSongs.length) {
		  return [...selectablePlaylistSongs];
		}
	  
		// Step 1: Calculate weights for all songs
		const weights = selectablePlaylistSongs.map((song) => {

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
	  
		  for (let i = 0; i < selectablePlaylistSongs.length; i++) {
			cumulative += normalizedWeights[i];
			if (random <= cumulative && !usedIndices.has(i)) {
			  usedIndices.add(i);
			  result.push(selectablePlaylistSongs[i]);
			  break;
			}
		  }
		}
	  
		return result;
	}

	const resetMatchup = ()=>{
		setMatchupSongs(findRandomSongs(matchupSize));
	}

	const songWasChosen = (_?:React.MouseEvent<HTMLAnchorElement>,track?:SpotifyTrack)=>{
		const now = Date.now();
		let winner:PlaylistSong|null = null;
		let losers:PlaylistSong[] = [];
		
		if(track){
			//find the spotify track in the selected matchup songs
			matchupSongs.forEach(song =>{
				if(song.track_info.id === track.id){
					song.lastPlayed = now;
					winner = song;
				}
				else{
					losers.push(song);
				}
			});


		}

		if(winner){
			submitMatchupResult(winner,losers);
		}
		
		resetMatchup();
	}
	

	return (<div className='matchup-window-container'>
		{(matchupHappening && matchupSongs.length > 0) ? 
		<>
			<h2 className="page-header">Choose Your Next Song</h2>
			<div className='matchup-container'>
				{matchupSongs.map((song) => (
					<Song key={song.id} track={song.track_info} playlistId={selectedPlaylist} canAddToPlaylist={false} onPlay={songWasChosen} />
				))}
			</div>

			{matchupSongs.length > 0 && (
				<>
					<a className="shuffle-matchup" href="#" onClick={(e)=>{
						e.preventDefault();
						resetMatchup();
					}} title='Shuffle'>
						<FontAwesomeIcon icon={faShuffle} size="3x" />
					</a>
					{/* <button onClick={()=>setMatchupHappening(false)}>Done</button> */}
				</>
			)}
		</>
		:
		<p>Not enough songs</p>
		// <button onClick={()=>setMatchupHappening(true)}>
		// 	Create Matchup
		// </button>
		}
		
	</div>
	);
}

export default Matchup;