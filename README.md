# Songelo Frontend

This is the frontend for the Songelo project, built with React. It connects to the backend for Spotify authentication and displays related data.

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
   npm start
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

---

### How to Use These README Files

1. **Server (Backend)**: Follow the instructions in the backend `README.md` to either use Docker or run the backend directly with Node.js. You can start the server with Docker Compose or manually via `npm start` once dependencies are installed.

2. **React App (Frontend)**: The frontend `README.md` file has instructions for using Docker or running the app with `npm start`. Docker Compose can simplify the process of both building and running the app in one step.