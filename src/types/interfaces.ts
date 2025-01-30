export interface SpotifyTrack {
	id: string;
	name: string;
	artists: { name: string }[];
	album: { images: { url: string }[] };
}

export interface PlaylistSong {
	id: string;
	lastPlayed: number | null;
	score: number;
	track_info: SpotifyTrack;
	insert_date: string;
	queue_id: string;
}

export interface AppState {
	selectedPlaylist: string;
	setSelectedPlaylist: (playlistId: string) => void;
	selectedPlaylistSongs: PlaylistSong[];
	setSelectedPlaylistSongs: (playlistSongArray: PlaylistSong[]) => void;
	isTrackInPlaylist: (track: SpotifyTrack) => boolean;
	addSongToPlaylist: (track: PlaylistSong) => void;
	submitMatchupResult: (winner: PlaylistSong, losers: PlaylistSong[]) => void;
	fetchPlaylists: () => Promise<any>;
	getPlaylistRecommendedTracks: (playlistID: string) => Promise<any>;
	saveSongInPlaylist: (track: SpotifyTrack, enqueue:boolean) => Promise<void>;
	selectedPlaylistWaitingList: PlaylistSong[];
	promoteSongInPlaylist: (track: SpotifyTrack) => Promise<void>;
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
	needReLogin: () => boolean;
}

export interface MatchTrack {
	match_artist: string;
	match_count: number;
	match_score: number;
	match_track_name: string;
	playlist_matches: {
		track: string;
		artist: string;
		spotify_id: string;
	}[];
}

export interface SpotifySearchResult {
	tracks: {
		href: string,
		items: SpotifyTrack[]
	}
}