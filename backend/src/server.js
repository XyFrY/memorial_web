const express = require('express');
const dotenv = require('dotenv');

// Load environment variables from .env file before anything else runs.
dotenv.config();

const { connectMongo } = require('./db/mongo');
const { authRouter } = require('./routes/auth');
const { memorialRouter } = require('./routes/memorials');

const app = express();
// Use port from environment or default to 4000 for local development.
const port = process.env.PORT || 4000;

// Parse incoming JSON request bodies automatically.
app.use(express.json());

// Basic health check endpoint to verify the server is running.
app.get('/api', (_req, res) => res.send('Success'));
// Add authentication routes under /api/auth (signup, login).
app.use('/api/auth', authRouter);
// Add memorial routes under /api/memorials (create, read, update, delete).
app.use('/api/memorials', memorialRouter);

// Connect to the database and start listening for HTTP requests.
async function start() {
    try {
        await connectMongo();
        console.log('Connected to MongoDB');

        app.listen(port, () => {
            console.log(`Server listening on http://localhost:${port}`);
        });
    } catch (error) {
        // If we can't connect to the database, there's no point running the server.
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

start();
