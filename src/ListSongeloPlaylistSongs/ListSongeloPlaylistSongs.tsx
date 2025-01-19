import Song from '../Song/Song';
import { useAppState } from '../state/AppStateContext';
import './ListSongeloPlaylistSongs.css';

const ListSongeloPlaylistSongs = ({ playlistId }: { playlistId: string }) => {
  const { selectedPlaylistSongs } = useAppState();

  return (
    <div>
      <h2>Songs in Playlist</h2>
      <ul>
        {selectedPlaylistSongs.map((song) => (
          <li key={song.id}>
            Score: {song.score}: <Song track={song.track_info} playlistId={playlistId} canAddToPlaylist={false} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListSongeloPlaylistSongs;
