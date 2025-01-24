# Songelo Frontend

Songelo is a web application that allows users to create and manage playlists using Spotify that will modify themselves as you select preferred songs vs others. The frontend is built with React and Vite. This is not a completed project


## Prerequisites

Before running the frontend, ensure that the following are installed:

- Docker
- Node.js (if you want to run the React app directly without Docker)

## Running with Docker

1. **Build and Start the Frontend**  
   Use Docker Compose to automatically build and run the frontend container.

   ```bash
   docker-compose up
   ```

   This command will:
   - Build the Docker image for the React app.
   - Start the frontend on port 5173 (you can change the port in the `docker-compose.yml` file if needed).

2. **Stop the Frontend**  
   To stop the frontend, run:

   ```bash
   docker-compose down
   ```

## Running Without Docker (Optional)

If you'd prefer to run the frontend directly, follow these steps:

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the React app:

   ```bash
   npm run dev
   ```

   The frontend will be running on `http://localhost:5173`.

## How to Use

1. Navigate to the frontend in your browser (`http://localhost:5173`).
2. If the user isn't authenticated, they will be redirected to Spotify for OAuth authentication.
3. Once authenticated, the user will be redirected back to the frontend with the necessary access token.

## Dependencies

- **react-router-dom**: For routing between different pages.
- **axios**: For making HTTP requests to the backend.
```
