const redirectModel = require("../models/redirectModel")

let redirectToOriginalUrl = async (req, res) =>
{
    shortUrl = req.params.shortUrl;
    let url = await redirectModel.redirectToOriginalUrl(shortUrl);
    if(url == null)
    {
        res.status(400).send("URL is invalid");
    }
    else{
        res.redirect(url);
    }
}

module.exports = { redirectToOriginalUrl };