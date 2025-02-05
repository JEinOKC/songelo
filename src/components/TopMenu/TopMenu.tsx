import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import './TopMenu.css';
import { useAuthState } from '../../stores/AuthStateContext';
import { useAppState } from '../../stores/AppStateContext';

const TopMenu: React.FC = () => {
	const [isOpen, setIsOpen] = useState(false);
	const { isLoggedIn, setIsLoggedIn } = useAuthState();
	const { selectedPlaylist } = useAppState();
	const { viewStyle } = useParams<{ viewStyle: string }>();
	// const { playlistID } = useParams<{ playlistID: string }>();
 
	const toggleMenu = () => setIsOpen(!isOpen);

	useEffect(() => {
	// 	console.log({'viewStyle':viewStyle});
	// 	if () {
	// 		setShowPlaylistSongs(true);
	// 	}
	// 	else{
	// 		setShowPlaylistSongs(false);
	// 	}
	// console.log({'viewStyle':viewStyle});
	}, [viewStyle]);

	return (
		<>
			{isLoggedIn  &&
				<div className="top-menu bg-darkest text-lightest">
					<div className="nav-top">
						<h1 className="page-title text-lighter-6">Songelo</h1>
						<button className="menu-toggle text-lightest" onClick={toggleMenu}>
							<FontAwesomeIcon icon={faBars} size='lg' title={isOpen ? 'Close Menu' : 'Open Menu'}/>
						</button>
					</div>
					<nav className={`menu-items ${isOpen ? 'open' : ''}`}>
						<Link to="/" onClick={()=>setIsOpen(false)}>Home</Link>
						{
							isLoggedIn && selectedPlaylist && viewStyle !== 'standings' &&  (
							<Link to={`/playlist/${selectedPlaylist}/standings`} onClick={()=>{
								setIsOpen(false);
							}}>Playlist</Link>)
						}
						{
							isLoggedIn && selectedPlaylist && viewStyle !== 'recommended-tracks' &&  (
							<Link to={`/playlist/${selectedPlaylist}/recommended-tracks`} onClick={()=>{
								setIsOpen(false);
							}}>Recommended Tracks</Link>)
						}
						{
							isLoggedIn && selectedPlaylist && viewStyle !== 'top-tracks' &&  (
							<Link to={`/playlist/${selectedPlaylist}/top-tracks`} onClick={()=>{
								setIsOpen(false);
							}}>Top Tracks</Link>)
						}
						{
							isLoggedIn && selectedPlaylist && typeof viewStyle !== 'undefined' &&  (
							<Link to={`/playlist/${selectedPlaylist}`} onClick={()=>{
								setIsOpen(false);
							}}>Play Songs</Link>)
						}
						{
							isLoggedIn && (
							<Link to="/" onClick={()=>{
								setIsOpen(false);
								setIsLoggedIn(false);
							}}>Logout</Link>)
						}
					</nav>
				</div>
			}
			{!isLoggedIn  &&
				<h1 className="logged-out-page-title">Songelo</h1>				
			}
		</>
	);
};

export default TopMenu;
