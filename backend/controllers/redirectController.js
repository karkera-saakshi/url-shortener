const redirectModel = require("../models/redirectModel")

let redirectToOriginalUrl = async (req, res) =>
{
    shortUrl = req.params.shortUrl;
    try{
        let url = await redirectModel.redirectToOriginalUrl(shortUrl);
        if(url == null)
        {
            res.status(404).send("URL is invalid");
        }
        else{
            res.redirect(url);
        }
    }
    catch(err){
        res.status(500).send("Internal Server Error");
    }   
}

module.exports = { redirectToOriginalUrl };