import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import './TopMenu.css';
import { useAuthState } from '../state/AuthStateContext';

const TopMenu: React.FC = () => {
	const [isOpen, setIsOpen] = useState(false);
	const { isLoggedIn, setIsLoggedIn } = useAuthState();

	const toggleMenu = () => setIsOpen(!isOpen);

	return (
		<div className="top-menu">
			<div className="nav-top">
				<h1 className="page-title">Songelo</h1>
				<button className="menu-toggle" onClick={toggleMenu}>
					<FontAwesomeIcon icon={faBars} size='lg' title={isOpen ? 'Close Menu' : 'Open Menu'}/>
				</button>
			</div>
			<nav className={`menu-items ${isOpen ? 'open' : ''}`}>
				<Link to="/" onClick={()=>setIsOpen(false)}>Home</Link>
				{
					isLoggedIn && (
					<Link to="/" onClick={()=>{
						setIsOpen(false);
						setIsLoggedIn(false);
					}}>Logout</Link>)
				}
			</nav>
		</div>
	);
};

export default TopMenu;
