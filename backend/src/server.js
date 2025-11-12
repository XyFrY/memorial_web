const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const { connectMongo } = require("./db/mongo");
const { authRouter } = require("./routes/auth");
const { memorialRouter } = require("./routes/memorials");

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

app.get("/api", (_req, res) => res.send("Success"));
app.use("/api/auth", authRouter);
app.use("/api/memorials", memorialRouter);

async function start() {
    try {
        await connectMongo();
        console.log("Connected to MongoDB");

        app.listen(port, () => {
            console.log(`Server listening on http://localhost:${port}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}

start();
