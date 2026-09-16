require("dotenv").config();
const express = require("express");
const cors = require("cors");
const shortenRoutes = require("./routes/shortenRoutes")
const redirectRoutes = require("./routes/redirectRoutes")
let app = express();
app.use(cors());
app.use(express.json());
app.use("/api", shortenRoutes);  
// app.use("/", redirectRoutes); 
app.listen(9000, () =>{console.log("Server is running on port 9000")})