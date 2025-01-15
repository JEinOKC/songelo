import { useEffect, useState } from 'react';
import { useAppState } from '../state/AppStateContext';
import { PlaylistSong } from '../interfaces';
import Song from '../Song/Song';

const Matchup = () => {

	const { selectedPlaylist, selectedPlaylistSongs } = useAppState();
	const [matchupHappening, setMatchupHappening] = useState(false);
	const [matchupSongs, setMatchupSongs] = useState<PlaylistSong[]>([]);
	const recentSongs = new Set<PlaylistSong>();

	const matchupSize = 4;

	useEffect(()=>{
		console.log('selectedPlaylist',selectedPlaylist);
		console.log('selectedPlaylistSongs',selectedPlaylistSongs);
		resetMatchup();
		console.log('matchupSongs',matchupSongs);
	},[matchupHappening])
	useEffect(()=>{
		//may or may not need this...
	},[selectedPlaylist]);

	const findRandomSongs = (count:number):PlaylistSong[] => {
		const usedIndices = new Set<number>();
		const result:PlaylistSong[] = [];

		//TODO: check to see if we need to release recent songs..
		
		if (count >= selectedPlaylistSongs.length) return [...selectedPlaylistSongs];

		while(result.length < count){
			const randomIndex = Math.floor(Math.random() * selectedPlaylistSongs.length);
			if(!usedIndices.has(randomIndex) && !recentSongs.has(selectedPlaylistSongs[randomIndex])){
				usedIndices.add(randomIndex);
				result.push(selectedPlaylistSongs[randomIndex]);
			}
		}

		return result;

	}

	const resetMatchup = ()=>{
		setMatchupSongs(findRandomSongs(matchupSize));
	}

	const addMatchupSongsToRecent = ()=>{
		matchupSongs.forEach(song =>{
			recentSongs.add(song);
		})
	}

	const songWasChosen = (event?:React.MouseEvent<HTMLAnchorElement>)=>{
		console.log('event',event);
		addMatchupSongsToRecent();
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