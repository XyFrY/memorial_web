const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const envPath = path.resolve(__dirname, '../../.env');
const envConfig = dotenv.config({ path: envPath, override: false });

if (envConfig.error && envConfig.error.code !== 'ENOENT') {
    console.error(
        `Failed to load environment variables from ${envPath}:`,
        envConfig.error
    );
}

const DEFAULT_URI = 'mongodb://127.0.0.1:27017/memorial';
let missingMongoUriLogged = false;

function getMongoUri() {
    const uri = process.env.MONGODB_URI;

    if (uri?.trim()) {
        return uri;
    }

    if (!missingMongoUriLogged) {
        console.error(
            `MONGODB_URI is not defined. Using default: "${DEFAULT_URI}". ` +
                `Set the variable in your environment or update ${envPath}.`
        );
        missingMongoUriLogged = true;
    }

    return DEFAULT_URI;
}

async function connectMongo() {
    await mongoose.connect(getMongoUri());
    return mongoose.connection;
}

module.exports = {
    connectMongo,
    mongoose,
    getMongoUri
};
