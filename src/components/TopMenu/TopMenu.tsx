import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import './TopMenu.css';
import { useAuthState } from '../../stores/AuthStateContext';
import { useAppState } from '../../stores/AppStateContext';
import Logo from '../Logo/Logo';

const TopMenu: React.FC = () => {
	const [isOpen, setIsOpen] = useState(false);
	const { isLoggedIn, setIsLoggedIn } = useAuthState();
	const { selectedPlaylist, selectedPlaylistSongs } = useAppState();
	const { viewStyle } = useParams<{ viewStyle: string }>();
	// const { playlistID } = useParams<{ playlistID: string }>();
 
	const toggleMenu = () => setIsOpen(!isOpen);

	useEffect(() => {
	}, [viewStyle]);

	return (
		<>
			{isLoggedIn  &&
				<div className="top-menu bg-darkest text-lightest">
					<div className="nav-top">
					<h1 className="page-title text-3xl text-lighter-6 cursor-pointer" onClick={()=>{
						window.location.href = '/';
					}}>
						<Logo className='stroke-darkest text-lightest h-10 w-10 inline' />&nbsp;<span>Songelo</span>
					</h1>
						
						{/* <h1 className="page-title text-3xl text-lighter-6">Songelo</h1> */}
						<button className="menu-toggle text-lightest" onClick={toggleMenu}>
							<FontAwesomeIcon icon={faBars} size='lg' title={isOpen ? 'Close Menu' : 'Open Menu'}/>
						</button>
					</div>
					<nav className={`menu-items ${isOpen ? 'open' : ''}`}>
						<Link to="/" onClick={()=>setIsOpen(false)}  className="text-lightest hover:bg-darker-4">Home</Link>
						{
							isLoggedIn && selectedPlaylist && viewStyle !== undefined &&  (
							<Link to={`/playlist/${selectedPlaylist}`} onClick={()=>{
								setIsOpen(false);
							}} className="text-lightest hover:bg-darker-4">Playlist Home</Link>)
						}
						{
							isLoggedIn && selectedPlaylist && viewStyle !== 'vote' &&  (
							<Link to={`/playlist/${selectedPlaylist}/vote`} onClick={()=>{
								setIsOpen(false);
							}} className="text-lightest hover:bg-darker-4">Vote on Songs</Link>)
						}
						{
							isLoggedIn && selectedPlaylist && viewStyle !== 'standings' &&  (
							<Link to={`/playlist/${selectedPlaylist}/standings`} onClick={()=>{
								setIsOpen(false);
							}} className="text-lightest hover:bg-darker-4">Song Standings</Link>)
						}

						{
							isLoggedIn && selectedPlaylist && selectedPlaylistSongs.length > 0 && viewStyle !== 'export' &&  (
							<Link to={`/playlist/${selectedPlaylist}/export`} onClick={()=>{
								setIsOpen(false);
							}} className="text-lightest hover:bg-darker-4">Export To Spotify</Link>)
						}

						<hr className='w-full border-8 text-transparent' />
						{
							isLoggedIn && selectedPlaylist && viewStyle !== 'top-tracks' &&  (
							<Link to={`/playlist/${selectedPlaylist}/top-tracks`} onClick={()=>{
								setIsOpen(false);
							}} className="text-lightest hover:bg-darker-4">My Top Spotify Tracks</Link>)
						}
						{
							isLoggedIn && selectedPlaylist && viewStyle !== 'recommended-tracks' &&  (
							<Link to={`/playlist/${selectedPlaylist}/recommended-tracks`} onClick={()=>{
								setIsOpen(false);
							}} className="text-lightest hover:bg-darker-4">My Recommended Tracks</Link>)
						}
						{
							isLoggedIn && selectedPlaylist && viewStyle !== 'import' &&  (
							<Link to={`/playlist/${selectedPlaylist}/import`} onClick={()=>{
								setIsOpen(false);
							}} className="text-lightest hover:bg-darker-4">Import From Spotify Playlist</Link>)
						}
						
						
						{
							isLoggedIn && (
							<Link to="/" onClick={()=>{
								setIsOpen(false);
								setIsLoggedIn(false);
							}} className="text-lightest hover:bg-darker-4">Logout</Link>)
						}
					</nav>
				</div>
			}
			{!isLoggedIn  &&
			<div className="text-center">
				<Logo className='stroke-lightest text-darkest h-20 w-20 mx-auto' />
				<h1 className="logged-out-page-title max-w-[480px] my-0 mx-auto text-center text-6xl text-darkest">Songelo</h1>				
			</div>
			
			}
		</>
	);
};

export default TopMenu;
