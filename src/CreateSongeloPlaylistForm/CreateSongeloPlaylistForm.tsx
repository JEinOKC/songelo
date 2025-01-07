import { useState } from 'react';
import { useAuthState } from '../state/AuthStateContext';

const CreateSongeloPlaylistForm = ({ onCreate }: { onCreate: () => void }) => {
  const [name, setName] = useState<string>('');
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [maxSize, setMaxSize] = useState<number>(0);
  const { appToken } = useAuthState();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (maxSize > 200) {
      alert('Maximum size cannot exceed 200 songs.');
      return;
    }

    if (!appToken) return;

    const response = await fetch(`${import.meta.env.VITE_DOMAIN_URL}/api/playlists`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${appToken}`,
      },
      body: JSON.stringify({ 
        'name' : name, 
        'is_public' : isPublic, 
        'max_length' : maxSize 
      }),
    });

    if (response.ok) {
      onCreate();
      setName('');
      setIsPublic(false);
      setMaxSize(0);
    } else {
      alert('Failed to create playlist.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <h1>Create a New Playlist</h1>
        <label htmlFor="name">Playlist Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="isPublic">Public:</label>
        <input
          type="checkbox"
          id="isPublic"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
        />
      </div>
      <div>
        <label htmlFor="maxSize">Maximum Size:</label>
        <input
          type="number"
          id="maxSize"
          value={maxSize}
          onChange={(e) => setMaxSize(parseInt(e.target.value, 10))}
          max={200}
          required
        />
      </div>
      <button type="submit">Create Playlist</button>
    </form>
  );
};

export default CreateSongeloPlaylistForm;
