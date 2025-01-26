import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateSongeloPlaylistForm from '../CreateSongeloPlaylistForm/CreateSongeloPlaylistForm';
import { useAppState } from '../state/AppStateContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faXmark } from '@fortawesome/free-solid-svg-icons';
import './SongeloPlaylistsDropdown.css';

const SongeloPlaylistsDropdown = () => {
	const [playlists, setPlaylists] = useState<any[]>([]);
	const { selectedPlaylist, setSelectedPlaylist, fetchPlaylists } = useAppState();
	const [wantNewPlaylist, setWantNewPlaylist] = useState<boolean>(false);
	const navigate = useNavigate();
	const [currentPlaylistName,setCurrentPlaylistName] = useState<string>('');
	const [dropdownActive,setDropdownActive] = useState<boolean>(false);
	
	useEffect(()=>{
		playlists.forEach((playlist)=>{
			if(playlist.id === selectedPlaylist){
				setCurrentPlaylistName(playlist.name);
			};
		})

		if(selectedPlaylist === ''){
			setDropdownActive(true);
			setCurrentPlaylistName('');
		}
		else{
			setDropdownActive(false);
		}
	},[selectedPlaylist,playlists])
	

	useEffect(() => {
		fetchPlaylists().then((data) => {
			console.log('fetch playlists worked as planned',data);
			setPlaylists(data);
		});
	}, []);

	// useEffect(() =>{

	// }, [appToken])

	const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		navigate(`/playlist/${event.target.value}`);
		setSelectedPlaylist(event.target.value);
	};

	return (
		<div>
			{currentPlaylistName !== '' && !dropdownActive  && (
				<p>{currentPlaylistName} 
					<FontAwesomeIcon className='show-dropdown-toggler' icon={faPen} onClick={()=>{
					setDropdownActive(true);
					}} />
				</p>
			)}
			
			{(currentPlaylistName === '' || dropdownActive) && (
				<>
					<label htmlFor="songelo-playlists">Select a playlist:</label>
					{
						playlists.length > 0 ? (
							<select id="songelo-playlists" value={selectedPlaylist} onChange={handleChange}>
								<option value="" disabled>Select a playlist</option>
								{playlists.map((playlist) => (
									<option key={playlist.id} value={playlist.id}>
										{playlist.name}
									</option>
								))}
							</select>
						)
						: (
							<div>No Playlists Available</div>
						)
					}
					{
						wantNewPlaylist && <CreateSongeloPlaylistForm onCreate={fetchPlaylists} />}
					
					{
						wantNewPlaylist ? 
						(
							<button onClick={() => {setWantNewPlaylist(false)}}>Cancel</button>
						) 
						:
						(<button onClick={() => {setWantNewPlaylist(true)}}>Create New Playlist</button>)
					}
					{currentPlaylistName !== '' && (
						<FontAwesomeIcon className='show-dropdown-toggler' icon={faXmark} onClick={()=>{
							setDropdownActive(false);
							}} />	
					)}
				</>	
			)}
			

		</div>
	);
};

export default SongeloPlaylistsDropdown;
