import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from '../../stores/AuthStateContext';
import { SpotifyPlaylist } from '../../types/interfaces';
import SpotifyComms from '../../utils/SpotifyComms';


const PlaylistExport: React.FC = () => {
	const { isLoggedIn, /*spotifyID*/ } = useAuthState();
	const [spotifyPlaylists,setSpotifyPlaylists] = useState<SpotifyPlaylist[]>([]);
	const [useExistingPlaylist,setUseExistingPlaylist] = useState<boolean|null>(null);
	const { performPlaylistSearch } = SpotifyComms();



	const navigate = useNavigate();

	

	useEffect(() => {
		_performPlaylistSearch();

		if(!isLoggedIn){
			navigate('/');
		}
		
	}, []);

	const _performPlaylistSearch = async () => {
		try{
			const playlists:SpotifyPlaylist[] = await performPlaylistSearch();
			console.log({'playlists':playlists});
			setSpotifyPlaylists(playlists);
		}
		catch(error){
			console.error("Error fetching playlists:", error);
		}
	}

	return (
		<div>
			<h1>Playlist Export</h1>
			<p>This is the Playlist Export component.</p>

			<div>
				<label htmlFor="useExistingPlaylist">Use Existing Playlist</label>
				<input
					type="checkbox"
					id="useExistingPlaylist"
					onChange={(e) => setUseExistingPlaylist(e.target.checked)}
				/>
			</div>
			{useExistingPlaylist ? (
				<div className="flex flex-col ">
					<div>you want to use an existing playlist</div>
					<select className='m-4 border-b-2 text-lightest w-full'>
						<option value="">Select a playlist</option>
						{spotifyPlaylists.map((playlist) => (
							<option key={playlist.id} value={playlist.id}>
								{playlist.name}
							</option>
						))}
					</select>
				</div>
				
				
			)
			: !useExistingPlaylist ? (
				<div className="flex flex-col ">
					<div>You do not want to use an existing playlist</div>
					<input type="text" placeholder="Enter playlist name" className="m-4 border-b-2 text-lightest w-full" />
				</div>
			)
			: (
				<></>
			)}
		</div>
	);
}

export default PlaylistExport;