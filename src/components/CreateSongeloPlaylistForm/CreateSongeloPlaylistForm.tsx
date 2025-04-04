import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../../stores/AppStateContext';
import './CreateSongeloPlaylistForm.css';

const CreateSongeloPlaylistForm = ({ onCreate }: { onCreate: () => void }) => {
	const defaultMaxSize = 50;
	const navigate = useNavigate();
	const [name, setName] = useState<string>('');
	const [isPublic, setIsPublic] = useState<boolean>(false);
	const [maxSize, setMaxSize] = useState<number>(defaultMaxSize);
	const { createNewPlaylist, setSelectedPlaylist } = useAppState();

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		if (maxSize > 200) {
			alert('Maximum size cannot exceed 200 songs.');
			return;
		}
		else if(maxSize < 1){
			alert('Minimum size cannot be below 1 song');
			return;
		}

		const newPlaylistID = await createNewPlaylist(name, isPublic, maxSize);

		if(newPlaylistID !== ''){
			onCreate();
			setName('');
			setIsPublic(false);
			setMaxSize(defaultMaxSize);
			navigate(`/playlist/${newPlaylistID}`);
			setSelectedPlaylist(newPlaylistID);
		} 
		else {
			alert('Failed to create playlist.');
		}
	};

	return (
		<form onSubmit={handleSubmit} className="playlist-form text-lightest border-lighter-5">
		<h1>Create a New Playlist</h1>
	
		<div className="form-group">
			<label htmlFor="name">Playlist Name:</label>
			<input
			type="text"
			id="name"
			value={name}
			onChange={(e) => setName(e.target.value)}
			required
			/>
		</div>
	
		{/* 
		not ready to deal with this option just yet
		<div className="form-group checkbox-group">
			<label htmlFor="isPublic">Public:</label>
			<input
			type="checkbox"
			id="isPublic"
			checked={isPublic}
			onChange={(e) => setIsPublic(e.target.checked)}
			/>
		</div> */}
	
		<div className="form-group">
			<label htmlFor="maxSize">Maximum Size:</label>
			<input
				type="number"
				id="maxSize"
				value={maxSize}
				onChange={(e) => {
					const myNum = parseInt(e.target.value);
					if(!isNaN(myNum)){
						setMaxSize(myNum);
					}
					
				}}
				max={200}
				min={1}
				required
			/>
		</div>
	
		<button type="submit" className="submit-button bg-success focus:border-success">Create Playlist</button>
		</form>
	);
  
};

export default CreateSongeloPlaylistForm;
