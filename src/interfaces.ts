export interface SpotifyTrack {
	id: string;
	name: string;
	artists: { name: string }[];
	album: { images: { url: string }[] };
}

export interface SongProps {
	track: SpotifyTrack;
	playlistId: string;
	canAddToPlaylist?: boolean;
	onPlay?: (event?:React.MouseEvent<HTMLAnchorElement>) => void;
}

export interface PlaylistSong {
	id: string;
	track_info: SpotifyTrack;
}

export interface AppState {
	selectedPlaylist: string;
	setSelectedPlaylist: (playlistId: string) => void;
	selectedPlaylistSongs: PlaylistSong[];
	setSelectedPlaylistSongs: (playlistSongArray: PlaylistSong[]) => void;
	isTrackInPlaylist: (track: SpotifyTrack) => boolean;
	addSongToPlaylist: (track: PlaylistSong) => void;
}

export interface PlaybackControlProps {
	track: any;
	onClose: () => void;
}

export interface AuthState {
	isLoggedIn: boolean;
	setIsLoggedIn: (loggedIn: boolean) => void;

	spotifyToken: string;
	setSpotifyToken: (token: string) => void;

	spotifyRefreshToken: string;
	setSpotifyRefreshToken: (token: string) => void;

	spotifyTokenExpiration: number;
	setSpotifyTokenExpiration: (token: number) => void;

	appToken: string;
	setAppToken: (token: string) => void;

	appRefreshToken: string;
	setAppRefreshToken: (token: string) => void;

	appTokenExpiration: number;
	setAppTokenExpiration: (token: number) => void;

	handleLogin: () => void;
	refreshAppToken: () => Promise<void>;
	refreshSpotifyToken: () => Promise<void>;
	confirmSpotifyLoginCode: (code:string) => Promise<void>;
	isTokenExpired: (expiration:number) => boolean;
}