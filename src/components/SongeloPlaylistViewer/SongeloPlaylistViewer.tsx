import { useState, useEffect } from 'react';
import { useAppState } from '../../stores/AppStateContext';
import { useAuthState } from '../../stores/AuthStateContext';
import { useNavigate } from 'react-router-dom';
import './SongeloPlaylistViewer.css';
import ListSongeloPlaylistSongs from '../ListSongeloPlaylistSongs/ListSongeloPlaylistSongs';



const SongeloPlaylistViewer = () => {
	const { selectedPlaylist } = useAppState();
	const { isLoggedIn } = useAuthState();
	const navigate = useNavigate();
	const [toggleOn,setToggleOn] = useState<boolean>(false);

	// Fetch playlist recommended tracks once when component mounts or playlist changes
	useEffect(() =>{
		if(!isLoggedIn){
			navigate('/')
		}
	},[isLoggedIn]);


	return (
		<div className="SongeloPlaylistViewer-container" >
			<label className="switch">
				<input onChange={()=>{
					setToggleOn(!toggleOn);
				}} type="checkbox" />
				<span className="slider round bg-hue-right-2 peer-checked:bg-hue-left-2 peer-focused:shadow-hue-left-2"></span>
			</label>
			<div className="tracks-container">
				{selectedPlaylist && (
					<>
						{toggleOn ? (
							<ListSongeloPlaylistSongs playlistId={selectedPlaylist} enqueued={true}/>
						) : (
							<ListSongeloPlaylistSongs playlistId={selectedPlaylist} />
						)}
					</>
				)}
			</div>
		</div>
	)
}

export default SongeloPlaylistViewer;