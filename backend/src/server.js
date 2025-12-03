const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const { connectMongo } = require('./db/mongo');
const { authRouter } = require('./routes/auth');
const { memorialRouter } = require('./routes/memorials');
const { uploadRouter } = require('./routes/upload');

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/api', (_req, res) => res.send('Success'));
app.use('/api/auth', authRouter);
app.use('/api/memorials', memorialRouter);
app.use('/api/upload', uploadRouter);

async function start() {
    try {
        await connectMongo();
        console.log('Connected to MongoDB');

        app.listen(port, () => {
            console.log(`Server listening on http://localhost:${port}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

start();
