const shortenModel = require("../models/shortenModel");
const urlValidate = require("../utils/urlValidator")
const generateShortUrl = require("../utils/generateShortUrl");
let createShortUrl = async (req, res)=>
{
    let url = req.body.url;
    try{
        let result = urlValidate.validUrl(url);
        if(result == true)
        {
            let number = await shortenModel.getNextSequence();
            let shortUrl = await generateShortUrl.generateShortUrl(url, number);
            let returnUrl = await shortenModel.saveUrl(shortUrl.code, url);
            res.status(200).send(shortUrl.shortUrl)
        }
        else{
            res.status(400).send("URL is invalid");
        }
    }
    catch(err){
        res.status(500).send("Internal Server Error");
    }
}

module.exports = { createShortUrl };