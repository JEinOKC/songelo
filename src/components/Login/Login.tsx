const Login = () => {
    const handleLogin = () => {
        window.location.href = 'http://localhost:5000/login'; // Backend endpoint
    };

    return (
        <div>
            <h1>Spotify OAuth Demo</h1>
            <button onClick={handleLogin}>Log in with Spotify</button>
        </div>
    );
};

export default Login;
