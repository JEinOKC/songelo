import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from '../../stores/AuthStateContext';
import { useAppState } from '../../stores/AppStateContext';
import { SongeloPlaylistExport } from '../../types/interfaces';
import SpotifyComms from '../../utils/SpotifyComms';


const PlaylistExport: React.FC = () => {
	const { isLoggedIn, /*spotifyID*/ } = useAuthState();
	const { selectedPlaylist, selectedPlaylistSongs, fetchPlaylistExportData, getCurrentPlaylistName } = useAppState();
	const { createSpotifyPlaylist } = SpotifyComms();
	const [isProcessing, setIsProcessing] = useState<boolean>(false);
	const [isSuccess, setIsSuccess] = useState<boolean>(false);
	const [previousExport, setPreviousExport] = useState<SongeloPlaylistExport|null>(null);
	// const [spotifyPlaylists,setSpotifyPlaylists] = useState<SpotifyPlaylist[]>([]);
	// const [useExistingPlaylist,setUseExistingPlaylist] = useState<boolean|null>(null);
	const useExistingPlaylist = false;
	const [playlistName, setPlaylistName] = useState<string>('');

	const formatDate = (date:string) => {
		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
	};


	// const { performPlaylistSearch } = SpotifyComms();
	const managePlaylistName = async () => {
		// check for playlist name
		if (selectedPlaylist !== '') {
			const tmpName = await getCurrentPlaylistName();
			setPlaylistName('Songelo - ' + tmpName);
		}
		else {
			setPlaylistName('');
		}
	};

	const handleNameChange= (event: React.ChangeEvent<HTMLInputElement>|undefined)=> {
		if(typeof event === 'undefined'){
			return;
		}

		setPlaylistName(event.target.value);
	}




	const navigate = useNavigate();

	useEffect(() => {
		managePlaylistName();

	}, [selectedPlaylist]);

	useEffect(() => {
		// _performPlaylistSearch();
		

		if(!isLoggedIn){
			navigate('/');
		}

		managePlaylistName();

		fetchPlaylistExportData().then((result) => {
			
			if(result){
				setPreviousExport(result);
			}
		});

		
		
		
	}, []);

	// const _performPlaylistSearch = async () => {
	// 	try{
	// 		const playlists:SpotifyPlaylist[] = await performPlaylistSearch();
	// 		console.log({'playlists':playlists});
	// 		setSpotifyPlaylists(playlists);
	// 	}
	// 	catch(error){
	// 		console.error("Error fetching playlists:", error);
	// 	}
	// }

	return (
		<div>
			{isProcessing && (
				<div className="fixed inset-0 flex items-center justify-center bg-primary bg-opacity-500">
					<div className="bg-white p-4 rounded shadow">
						<p className='text-primary'>Processing Export...</p>
					</div>
				</div>
			)}
			
			<h1>Playlist Export</h1>
			{/* <p>This is the Playlist Export component.</p> */}

			<div>
				{/* <label htmlFor="useExistingPlaylist">Use Existing Playlist</label>
				<input
					type="checkbox"
					id="useExistingPlaylist"
					onChange={(e) => setUseExistingPlaylist(e.target.checked)}
				/> */}
			</div>
			{useExistingPlaylist ? (
				<div className="flex flex-col ">
					<div>you want to use an existing playlist</div>
					{/* <select className='m-4 border-b-2 text-lightest w-full'>
						<option value="">Select a playlist</option>
						{spotifyPlaylists.map((playlist) => (
							<option key={playlist.id} value={playlist.id}>
								{playlist.name}
							</option>
						))}
					</select> */}
				</div>
				
				
			)
			: !useExistingPlaylist ? (
				<div className="flex flex-col ">
					{ previousExport && previousExport.spotify_playlist_id && (
						<div className="alert-message text-sm">
							You previously exported this playlist to Spotify on {formatDate(previousExport?.date_last_exported)}. <br />
							Please check your Spotify account for the playlist.
						</div>						
					)}
					<label htmlFor="playlistName" className='text-left font-bold mt-4'>Spotify Playlist Name:</label>
					<input type="text" placeholder="Enter playlist name" className="my-4 border-b-2 text-lightest w-full" defaultValue={playlistName} onChange={handleNameChange} />
					<button disabled={isSuccess} className=" cursor-pointer w-full bg-lightest text-darker-1 p-2 rounded-md hover:bg-darker-1 hover:text-lightest disabled:opacity-40 disabled:cursor-default disabled:text-darker-1 disabled:bg-lightest" onClick={() => {

						if(isSuccess){
							//playlist already created. don't do it again
							return;
						}

						setIsProcessing(true);

						if(playlistName.trim() === ''){
							alert("Please enter a playlist name");
							setIsProcessing(false);
							return;
						}
						
						if(selectedPlaylistSongs.length === 0){
							alert("No songs selected for export");	
							setIsProcessing(false);
						}

						// create a new playlist
						createSpotifyPlaylist(playlistName, selectedPlaylistSongs).then((result) => {
							console.log({'createSpotifyPlaylist result':result});
							setIsSuccess(true);
						}).catch((error) => {
							console.error("Error creating playlist:", error);
							setIsSuccess(false);
						}).finally(() => {
							setIsProcessing(false);
						});
					}}>
						Export To Spotify
					</button>
					{ isSuccess && (
						<div className="text-green-500 mt-4">
							Playlist exported successfully!
						</div>
					)}
				</div>
			)
			: (
				<></>
			)}
		</div>
	);
}

export default PlaylistExport;