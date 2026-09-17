let express = require("express");
let router = express.Router();
const redirectController = require("../controllers/redirectController");
router.get("/:shortUrl", redirectController.redirectToOriginalUrl)
module.exports = router;


// /users/:something , /users/123 → req.params.something is "123"