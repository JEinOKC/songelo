import { useAppState } from '../../stores/AppStateContext';
import { useEffect, useState } from 'react';
import { PlaylistSong } from '../../types/interfaces';
import Song from '../Song/Song';



const PlaylistHome: React.FC = () => {
	const { selectedPlaylist, selectedPlaylistSongs, selectedPlaylistWaitingList } = useAppState();
	const [filteredActiveSongs,setFilteredActiveSongs] = useState<PlaylistSong[]>([]);
	const [filteredInactiveSongs,setFilteredInactiveSongs] = useState<PlaylistSong[]>([]);

	useEffect(() =>{

		setFilteredActiveSongs(selectedPlaylistSongs
			.filter((song) => song.active === true)
			.sort((a, b) => b.score - a.score));

		setFilteredInactiveSongs(selectedPlaylistWaitingList
			.sort((a, b) => new Date(a.insert_date).getTime() - new Date(b.insert_date).getTime()));

	},[selectedPlaylistSongs,selectedPlaylistWaitingList]);

	return (
		<div className='w-full justify-start items-start h-screen'>
			<div className="flex flex-col items-start justify-start ">
				<p className="text-lg"><span className='font-extrabold text-2xl'>{filteredActiveSongs.length}</span> Active Songs</p>
			</div>
			
			<hr className='border-0.5 mt-2 mb-8 w-full' />

			{selectedPlaylist && filteredActiveSongs.length > 0 &&
				(
					<>
						<h2 className="page-header mt-4 text-left">Top Song</h2>
						<Song
							track={filteredActiveSongs[0].track_info}
							playlistId={selectedPlaylist}
							canAddToPlaylist={false}
							score={filteredActiveSongs[0].score}
						/>
					</>
				)}
			{selectedPlaylist && filteredActiveSongs.length > 1 &&
				(
					<>
						<h2 className="page-header mt-4 text-left">Bottom Song</h2>
						
						<Song
							track={filteredActiveSongs[filteredActiveSongs.length-1].track_info}
							playlistId={selectedPlaylist}
							canAddToPlaylist={false}
							score={filteredActiveSongs[filteredActiveSongs.length-1].score}
						/>
					</>
				)}
			{selectedPlaylist && filteredInactiveSongs.length > 0 &&
				(
					<>
						<hr className='border-8 border-hue-right-4 mt-8 w-full' />
						<hr className='border-8 border-hue-left-4 mb-8 w-full' />
						
						<h2 className="page-header text-left">Next Song Up</h2>
						
						<Song
							track={filteredInactiveSongs[0].track_info}
							playlistId={selectedPlaylist}
							canAddToPlaylist={false}
							score={filteredInactiveSongs[0].score}
						/>

						<hr className='border-0.5 my-8 w-full' />

						<div className="flex flex-col items-start justify-start ">
							<p className="text-lg"><span className='font-extrabold text-2xl'>{filteredInactiveSongs.length}</span> Songs in the Waiting List</p>
						</div>

						
					</>
				)}
		</div>
	);
}

export default PlaylistHome;