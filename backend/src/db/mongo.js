const mongoose = require("mongoose");

const DEFAULT_URI = "mongodb://127.0.0.1:27017/memorial";

function getMongoUri() {
    return process.env.MONGODB_URI || DEFAULT_URI;
}

async function connectMongo() {
    const uri = getMongoUri();
    await mongoose.connect(uri);
    return mongoose.connection;
}

module.exports = {
    connectMongo,
    mongoose,
};
