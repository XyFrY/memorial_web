const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables from the .env file in the backend directory.
const envPath = path.resolve(__dirname, '../../.env');
const envConfig = dotenv.config({ path: envPath, override: false });

// Log any error loading the .env file, but ignore "file not found" errors since it's optional.
if (envConfig.error && envConfig.error.code !== 'ENOENT') {
    console.error(
        `Failed to load environment variables from ${envPath}:`,
        envConfig.error
    );
}

const DEFAULT_URI = 'mongodb://127.0.0.1:27017/memorial';
let missingMongoUriLogged = false;

// Get the MongoDB connection URI from environment variables, falling back to a local database if not set.
function getMongoUri() {
    const uri = process.env.MONGODB_URI;

    if (uri?.trim()) {
        return uri;
    }

    // Warn the user once if they haven't set a custom MongoDB URI.
    if (!missingMongoUriLogged) {
        console.error(
            `MONGODB_URI is not defined. Using default: "${DEFAULT_URI}". ` +
                `Set the variable in your environment or update ${envPath}.`
        );
        missingMongoUriLogged = true;
    }

    return DEFAULT_URI;
}

// Connect to MongoDB and return the active connection for use elsewhere.
async function connectMongo() {
    await mongoose.connect(getMongoUri());
    return mongoose.connection;
}

module.exports = {
    connectMongo,
    mongoose,
    getMongoUri
};
