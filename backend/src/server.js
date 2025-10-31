const express = require("express");
const dotenv = require("dotenv");
const { connectMongo } = require("./db/mongo");

dotenv.config();

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

app.get("/api", (_req, res) => {
    res.status(200).send("Success");
});

async function start() {
    try {
        await connectMongo();
        console.log("Connected to MongoDB");

        app.listen(port, () => {
            console.log(`Server listening on port ${port}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}

start();
