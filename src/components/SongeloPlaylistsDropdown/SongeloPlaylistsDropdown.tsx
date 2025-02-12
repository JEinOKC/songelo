import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateSongeloPlaylistForm from '../CreateSongeloPlaylistForm/CreateSongeloPlaylistForm';
import { useAppState } from '../../stores/AppStateContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faWrench, faXmark } from '@fortawesome/free-solid-svg-icons';
import './SongeloPlaylistsDropdown.css';

const SongeloPlaylistsDropdown = () => {
	const { selectedPlaylist, setSelectedPlaylist, playlists, setPlaylists, fetchPlaylists } = useAppState();
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
				<div className="current-playlist-info-container mb-2">
					<div className="current-playlist-name p-2 border-b-1 border-lightest">
						{currentPlaylistName}&nbsp;&nbsp;<FontAwesomeIcon className='show-dropdown-toggler' icon={faWrench} onClick={()=>{
					setDropdownActive(true);
					}} />

					</div>
					
				</div>
			)}
			
			{(currentPlaylistName === '' || dropdownActive) && (
				<>
					
					{
						playlists.length > 0 ? (
							<>
								{/* <label htmlFor="songelo-playlists">Select a playlist:</label> */}
								<select className='m-4 border-b-2 text-lightest' id="songelo-playlists" value={selectedPlaylist} onChange={handleChange}>
									<option value="" disabled>Select a playlist</option>
									{playlists.map((playlist) => (
										<option key={playlist.id} value={playlist.id}>
											{playlist.name}
										</option>
									))}
								</select>
							</>
						)
						: (
							<div className="m-4 border-b-2 text-lightest">No Playlists Available</div>
						)
					}
					{wantNewPlaylist && (
						<div className="new-playlist-container  m-2 mt-4">
							<CreateSongeloPlaylistForm onCreate={fetchPlaylists} />
							<div className='cancel-button-container text-center'>
								<button className="cancel-button bg-danger text-lightest rounded-md pt-1.5 pb-2.5 pl-3.5 pr-3.5 text-xl" onClick={() => setWantNewPlaylist(false)}>
									Cancel
								</button>
							</div>
						</div>
					)}

					{!wantNewPlaylist && (
						<div className="text-center">
							<button className="create-playlist-button rounded-md bg-success text-lightest" onClick={() => setWantNewPlaylist(true)}>
								Create New Playlist&nbsp;&nbsp;<FontAwesomeIcon icon={faPlus}/>
							</button>
						</div>
					)}
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
