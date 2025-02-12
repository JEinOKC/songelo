const Login = () => {
    const handleLogin = () => {
        window.location.href = (import.meta.env.VITE_DOMAIN_URL || 'http://127.0.0.1:3500') + '/login'; // Backend endpoint
    };

    return (
        <div>
            <h1>Spotify OAuth Demo</h1>
            <button onClick={handleLogin}>Log in with Spotify</button>
        </div>
    );
};

export default Login;
