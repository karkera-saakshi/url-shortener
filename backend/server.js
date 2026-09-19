require("dotenv").config();
const express = require("express");
const cors = require("cors");
const shortenRoutes = require("./routes/shortenRoutes")
const redirectRoutes = require("./routes/redirectRoutes")
const redisClient = require("./utils/redisClient");
let app = express();
app.use(cors());
app.use(express.json());
app.use("/api", shortenRoutes);  
app.use("/", redirectRoutes);

async function startServer() {
    const redClient = await redisClient;

    process.on("SIGTERM", () => {
        redClient.quit(); // usually sent by Docker, hosting platforms, process managers, etc.
    });

    process.on("SIGINT", () => {
        redClient.quit(); // usually when you press Ctrl + C in the terminal.
        console.log("Ended");
    });

}

startServer();

app.listen(9000, () =>{console.log("Server is running on port 9000")})