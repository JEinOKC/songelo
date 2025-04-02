import { SpotifyTrack } from './interfaces';

export interface PlaybackControlProps {
	track: any;
	onClose: () => void;
}

export interface SongProps {
	track: SpotifyTrack;
	playlistId: string;
	canAddToPlaylist?: boolean;
	canPromote?: boolean;
	score?: number;
	onPlay?: (event?:React.MouseEvent<HTMLAnchorElement>,track?:SpotifyTrack) => void;
}

export interface ListSongeloPlaylistSongsProps {
	playlistId: string;
	enqueued?: boolean|null;
  }