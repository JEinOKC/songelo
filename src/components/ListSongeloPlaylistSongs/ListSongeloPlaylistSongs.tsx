import Song from '../Song/Song';
import { useAppState } from '../../stores/AppStateContext';
import './ListSongeloPlaylistSongs.css';

const ListSongeloPlaylistSongs = ({ playlistId }: { playlistId: string }) => {
  const { selectedPlaylistSongs } = useAppState();

  return (
    <div className="playlist-songs">
      <h2>Songs in Playlist</h2>
      <ul>
        {selectedPlaylistSongs
          .sort((a, b) => b.score - a.score)
          .map((song) => (
          <li key={song.id}>
            Score: {song.score}: <Song track={song.track_info} playlistId={playlistId} canAddToPlaylist={false} score={song.score} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListSongeloPlaylistSongs;
