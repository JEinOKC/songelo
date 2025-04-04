import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
	const [votedSong, setVotedSong] = useState<PlaylistSong | null>(null);
	const [waiting, setWaiting] = useState<boolean>(false);

	const matchupSize = 4;
	const decayTime:number = 0.000005//a smaller decay number will theoretically make it take longer for a song to re-appear on a matchup

	useEffect(()=>{
		console.log('reset matchup because of matchupHappening effect');
		resetMatchup();
	},[matchupHappening])
	useEffect(()=>{
		console.log('reset matchup because of selectedPlaylist,selectedPlaylistSongs effect');
		resetMatchup();
		setWaiting(false);
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
		console.log('reset matchup called');
		setVotedSong(null);
		setMatchupSongs(findRandomSongs(matchupSize));
	}

	const handleVoteSelect = (song:PlaylistSong) => {
		setVotedSong(song);
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
			setWaiting(true);
			submitMatchupResult(winner,losers);
		}
	}

	return (
	<div className='matchup-window-container'>
		{ ( matchupHappening && matchupSongs.length > 0 && !waiting ) ? (
			<>
				<h2 className="page-header">Vote on a Song</h2>
				<div className='matchup-container'>
					{matchupSongs.map((song) => (
						<div key={song.id} className="relative cursor-pointer hover:bg-lighter-7 border-2 border-transparent hover:border-gray-200"  onClick={(()=>{
							setVotedSong(song);
						})}>
							<Song track={song.track_info} playlistId={selectedPlaylist} canAddToPlaylist={false} />
							<input disabled={waiting} checked={votedSong?.id === song.id} type="radio" name="song" id={song.id} className="peer hidden" onChange={()=>{
								handleVoteSelect(song);
							}}></input>
							<label htmlFor={song.id} className="absolute top-1/2 -translate-y-1/2 left-2 w-6 h-6 bg-white border-2 border-gray-400 rounded-full peer-checked:border-blue-500 peer-checked:bg-blue-500 flex items-center justify-center">
								<svg className="hidden peer-checked:block peer-disabled:hidden w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
									<path fillRule="evenodd" d="M20.707 5.293a1 1 0 0 1 0 1.414l-11 11a1 1 0 0 1-1.414 0l-5-5a1 1 0 1 1 1.414-1.414L9 15.586l10.293-10.293a1 1 0 0 1 1.414 0z" clipRule="evenodd"/>
								</svg>
							</label>
						</div>
						
					))}

				</div>

				{(votedSong && !waiting) && (
					<div className="text-center mt-4">
						<a className="btn btn-lg btn-primary" href="#" onClick={(e)=>{
							e.preventDefault();
							songWasChosen(e,votedSong.track_info);
						}} title='Vote'>
							Vote
						</a>
					</div>
				)}

				{matchupSongs.length > 0 && (
					<>
						<a className="shuffle-matchup mt-6" href="#" onClick={(e)=>{
							e.preventDefault();
							console.log('reset matchup after shuffle');
							resetMatchup();
						}} title='Shuffle'>
							<FontAwesomeIcon icon={faShuffle} size="3x" />
						</a>
						{/* <button onClick={()=>setMatchupHappening(false)}>Done</button> */}
					</>
				)}
			</>
		)
		: ( waiting ) ? (
			<div className="alert-message">
				Loading matchup...
			</div>
		)
		: (
			<>
				<div className="alert-message">
					There are not enough tracks in your playlist. <br/>Please add more.
				</div>
				<ul className='text-center'>
					<li>
						<Link to={`/playlist/${selectedPlaylist}/top-tracks`} className="btn btn-default mb-4">Browse My Top Spotify Tracks</Link>
					</li>
					<li>
						<Link to={`/playlist/${selectedPlaylist}/import`} className="btn btn-default">Import From Spotify Playlist</Link>
					</li>
				</ul>

			</>
		)}
		
	</div>
	);
}

export default Matchup;