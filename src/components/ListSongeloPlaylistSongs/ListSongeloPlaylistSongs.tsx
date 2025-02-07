import Song from '../Song/Song';
import { useAppState } from '../../stores/AppStateContext';
import "./ListSongeloPlaylistSongs.css";
import { ListSongeloPlaylistSongsProps } from '../../types/props';
import TopTracks from '../TopTracks/TopTracks';
import { useEffect, useState } from 'react';
import { PlaylistSong } from '../../types/interfaces';


const ListSongeloPlaylistSongs: React.FC<ListSongeloPlaylistSongsProps> = ({ playlistId, enqueued }) => {
	const { selectedPlaylistSongs, selectedPlaylistWaitingList } = useAppState();
	const [filteredActiveSongs,setFilteredActiveSongs] = useState<PlaylistSong[]>([]);
	const [filteredInactiveSongs,setFilteredInactiveSongs] = useState<PlaylistSong[]>([]);

	useEffect(() =>{

		setFilteredActiveSongs(selectedPlaylistSongs
			.filter((song) => song.active === true)
			.sort((a, b) => b.score - a.score));

		setFilteredInactiveSongs(selectedPlaylistWaitingList
			.sort((a, b) => new Date(a.insert_date).getTime() - new Date(b.insert_date).getTime()));

	},[selectedPlaylistSongs,selectedPlaylistWaitingList]);
	

	if(enqueued){

		if(selectedPlaylistWaitingList.length === 0){
			return <></>;
		}

		return (
			<div className="playlist-songs">
				{filteredActiveSongs.length > 0 &&
				(
					<>
						<h2 className="page-header">Track Risking Relegation</h2>
						<div className="alert-message bg-danger">
							Promoting a track from the waiting list will result in this track being deactivated from the playlist
						</div>
						<ul>
							<li key={filteredActiveSongs[filteredActiveSongs.length - 1].id}>
								<Song
								track={filteredActiveSongs[filteredActiveSongs.length - 1].track_info}
								playlistId={playlistId}
								canAddToPlaylist={false}
								score={filteredActiveSongs[filteredActiveSongs.length - 1].score}
								/>
							</li>
						</ul>
					</>
				)}
				

				<h2 className="page-header">Tracks in Waiting List</h2>
				<ul>
				{filteredInactiveSongs.map((song) => (
					<li key={song.id}>
						<Song track={song.track_info} playlistId={playlistId} canAddToPlaylist={false} canPromote={true} score={song.score} />
					</li>
				))}
				</ul>
			</div>
		);
		
	}

	return (
		<div className="playlist-songs">
			<h2 className="page-header">Tracks in Playlist</h2>
			<ul>
				{filteredActiveSongs.map((song) => (
					<li key={song.id}>
						<Song track={song.track_info} playlistId={playlistId} canAddToPlaylist={false} score={song.score} />
					</li>
				))}
				{filteredActiveSongs.length === 0 && (
					<>
						<div className="alert-message">
							You currently have no active tracks in your playlist. <br/>Please add more.
						</div>
						<TopTracks/>
					</>
				)
				}
			</ul>
		</div>
	);
};

export default ListSongeloPlaylistSongs;
