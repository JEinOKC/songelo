interface SongProps {
  track: {
    id: string;
    name: string;
    artists: { name: string }[];
    album: { images: { url: string }[] };
  };
}

const Song: React.FC<SongProps> = ({ track }) => {
  return (
    <span key={track.id}>
      <img
        src={track.album.images[2].url}
        alt={track.name}
        style={{ width: 50, height: 50 }}
      />
      <span>
        {track.name} by {track.artists[0].name}
      </span>
      <br />
      <a
        href={`https://open.spotify.com/track/${track.id}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Play on Spotify
      </a>
    </span>
  );
};

export default Song;
