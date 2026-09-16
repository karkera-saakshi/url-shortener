let express = require("express");
let router = express.Router();
const shortenController = require("../controllers/shortenController");
router.post("/createShortUrl", shortenController.createShortUrl)
module.exports = router;