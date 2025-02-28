import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from '../../stores/AuthStateContext';

const Callback = () => {
	const { confirmSpotifyLoginCode } = useAuthState();
	const navigate = useNavigate();
	const hasFetched = useRef(false); // Track if the effect has run

	useEffect(() => {
		if (hasFetched.current) return; // Prevent duplicate execution

		const fetchData = async () =>{
			const params = new URLSearchParams(window.location.search);
			const code = params.get('code');
			if (code) {
				hasFetched.current = true; // Set the flag to true after execution
				await confirmSpotifyLoginCode(code);
				navigate('/');
			}
		}

		fetchData();
		
	}, [navigate]);

	return <div className='m-4 text-2xl max-w-[480px] mx-auto text-center'>Logging In...</div>;
};

export default Callback;
