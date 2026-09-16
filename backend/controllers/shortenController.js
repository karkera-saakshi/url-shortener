const shortenModel = require("../models/shortenModel");
const urlValidate = require("../utils/urlValidator")
const generateShortUrl = require("../utils/generateShortUrl");
let createShortUrl = async (req, res)=>
{
    let url = req.body.url;
    let result = urlValidate.validUrl(url);
    if(result == true)
    {
        let number = await shortenModel.getNextSequence();
        let shortUrl = generateShortUrl.generateShortUrl(url, number);
        shortenModel.saveUrl(shortUrl, url);
    }
    else{
        res.send("URL is invalid");
    }
}

module.exports = { createShortUrl };