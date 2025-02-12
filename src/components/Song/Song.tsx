import { useEffect, useState } from 'react';
import { SpotifyTrack, Playlist } from '../../types/interfaces';
import { SongProps } from '../../types/props';

import { useAppState } from '../../stores/AppStateContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpotify } from '@fortawesome/free-brands-svg-icons'
import './Song.css';

const Song: React.FC<SongProps> = ({ track, canAddToPlaylist = true, canPromote = false, score = -1, onPlay }) => {
	const [isAdding, setIsAdding] = useState<boolean>(false);
	const [maxReached, setMaxReached] = useState<boolean>(false);
	const { selectedPlaylist, playlists, saveSongInPlaylist, promoteSongInPlaylist, selectedPlaylistSongs } = useAppState();

	const handleSpotifyClick = (event:React.MouseEvent<HTMLAnchorElement>,track:SpotifyTrack) => {
		const trackURL = `https://open.spotify.com/track/${track.id}`;
		window.open(trackURL, '_blank', 'noopener,noreferrer');
		onPlay ? onPlay(event,track) : null;
	}

	const handlePromotionToPlaylist = async () => {
		setIsAdding(true);
		await promoteSongInPlaylist(track);
		setIsAdding(false);
	}

	const handleAddToPlaylist = async (active:boolean=false) => {
		setIsAdding(true);
		await saveSongInPlaylist(track, active); 
		setIsAdding(false);
	};

	useEffect(()=>{
		const activeTracks = selectedPlaylistSongs.filter((song) => song.active === true);
		
		playlists.forEach((playlist)=>{
			if(playlist.id === selectedPlaylist){
				const currentPlaylist:Playlist = playlist;
				const maxPlaylistLength = currentPlaylist.max_length;

				if(maxPlaylistLength > activeTracks.length){
					setMaxReached(false);
				}
				else{
					setMaxReached(true);
				}

			};
		})


	},[selectedPlaylistSongs,selectedPlaylist])

	return (
		<div>
		<div className="song-container text-darker-3 bg-lightest border-lighter-5" key={track.id}>
			<div className="album-cover-container">
			<div className="album-cover" style={{ backgroundImage: `url(${track.album.images[2].url})` }}>
			</div>
			</div>
			{/* <img
			src={track.album.images[2].url}
			alt={track.name}
			/> */}
			<div className="track-info">

			{score > -1 && (
				<span className="score">
				{score.toFixed(2)}
				</span>
			)}

			<span className="song" title={track.name} >
				{track.name}
			</span>
			<span className="artist" title={track.artists[0].name}>
				{track.artists[0].name}
			</span>
			
			<a
				href="#"
				onClick={(e:React.MouseEvent<HTMLAnchorElement>)=>{
				e.preventDefault();
				handleSpotifyClick(e,track);
				}} 
				className='spotify-link hover:bg-lighter-7'
			>
				Play On Spotify <FontAwesomeIcon icon={faSpotify} size="lg" />
			</a>
			</div>
		</div>
		{canPromote && (
			<div className='add-to-playlist-container'>
				<a 
					href="#" 
					onClick={(e)=>{
					e.preventDefault();
					handlePromotionToPlaylist();
					}} 
					className={'bg-lighter-2 text-lightest' + (isAdding ? 'disabled' : '')}>
					{isAdding ? 'Promoting...' : 'Promote to Active Playlist'}
				</a>
			</div>
		)}
		{canAddToPlaylist && !maxReached && (
			<div className='add-to-playlist-container'>
				<a 
					href="#" 
					onClick={(e)=>{
					e.preventDefault();
					handleAddToPlaylist(true);
					}} 
					className={'bg-lighter-2 text-lightest' + (isAdding ? 'disabled' : '')}>
					{isAdding ? 'Adding...' : 'Add to Playlist'}
				</a>
				<a 
					href="#" 
					onClick={(e)=>{
					e.preventDefault();
					handleAddToPlaylist(false);
					}} 
					className={isAdding ? 'disabled' : ''}>
					{isAdding ? 'Enqueueing...' : 'Enqueue to Playlist Waiting List'}
				</a>
			</div>
		)}
		</div>
	);
};

export default Song;
