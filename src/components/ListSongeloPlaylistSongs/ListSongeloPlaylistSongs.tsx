import Song from '../Song/Song';
import { useAppState } from '../../stores/AppStateContext';
import './ListSongeloPlaylistSongs.css';
import { ListSongeloPlaylistSongsProps } from '../../types/props';


const ListSongeloPlaylistSongs: React.FC<ListSongeloPlaylistSongsProps> = ({ playlistId, enqueued }) => {
  const { selectedPlaylistSongs, selectedPlaylistWaitingList } = useAppState();

  if(enqueued){

    if(selectedPlaylistWaitingList.length === 0){
      return <></>;
    }

    return (
      <div className="playlist-songs">
        <h2 className="page-header">Songs in Waiting List</h2>
        <ul>
          {selectedPlaylistWaitingList
            .sort((a, b) => new Date(a.insert_date).getTime() - new Date(b.insert_date).getTime())
            .map((song) => (
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
      <h2 className="page-header">Songs in Playlist</h2>
      <ul>
        {selectedPlaylistSongs
          .filter((song) => song.active === true)
          .sort((a, b) => b.score - a.score)
          .map((song) => (
          <li key={song.id}>
            <Song track={song.track_info} playlistId={playlistId} canAddToPlaylist={false} score={song.score} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListSongeloPlaylistSongs;
