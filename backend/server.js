require("dotenv").config();
const express = require("express");
const cors = require("cors");
const urlRoutes = require("./routes/urlRoutes")
let app = express();
app.use(cors());
app.use(express.json());
app.use("/",urlRoutes);
app.listen(9000, () =>{console.log("Server is running on port 9000")})