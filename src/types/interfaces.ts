import { AxiosInstance } from "axios";
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
	active: boolean;
	queue_id: string;
}

export interface SpotifyPlaylist {
	collaborative: boolean;
	description: string|null;
	external_urls: object;
	href: string;
	id: string;
	images: {
		height: number;
		width: number;
		url: string;
	}[];
	name: string;
	owner: {
		display_name: string;
		external_urls: object;
		href: string;
		id: string;
		type: string;
		uri: string;
	}
	primary_color: string|null;
	public: boolean;
	snapshot_id: string;
	tracks: {
		href: string;
		total: number;
	}
	type: "playlist";
	uri: string;

}

export interface AppState {
	selectedPlaylist: string;
	setSelectedPlaylist: (playlistId: string) => void;
	selectedPlaylistSongs: PlaylistSong[];
	setSelectedPlaylistSongs: (playlistSongArray: PlaylistSong[]) => void;
	playlists: Playlist[];
	setPlaylists: (playlistArray:Playlist[]) => void;

	isTrackInPlaylist: (track: SpotifyTrack) => boolean;
	addSongToPlaylist: (track: PlaylistSong) => void;
	submitMatchupResult: (winner: PlaylistSong, losers: PlaylistSong[]) => void;
	fetchPlaylists: () => Promise<any>;
	getPlaylistRecommendedTracks: (playlistID: string) => Promise<any>;
	saveSongInPlaylist: (track: SpotifyTrack, enqueue:boolean) => Promise<void>;
	selectedPlaylistWaitingList: PlaylistSong[];
	promoteSongInPlaylist: (track: SpotifyTrack) => Promise<void>;
	createNewPlaylist: (name: string, isPublic: boolean, maxSize: number) => Promise<string>;
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

	spotifyID: string;
	setSpotifyID: (token: string) => void;

	appToken: string;
	setAppToken: (token: string) => void;

	appRefreshToken: string;
	setAppRefreshToken: (token: string) => void;

	appTokenExpiration: number;
	setAppTokenExpiration: (token: number) => void;

	handleLogin: () => void;
	handleLogout: () => void;
	confirmSpotifyLoginCode: (code:string) => Promise<void>;
	isTokenExpired: (expiration:number) => boolean;
	needReLogin: () => boolean;

	appAxiosInstance: AxiosInstance;
	spotifyAxiosInstance: AxiosInstance;
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


export interface Playlist{
	id: string;
	creator_id: string;
	date_created: string;
	date_last_edited: string;
	is_active: boolean;
	is_public: boolean;
	max_length: number;
	name: string;	
}