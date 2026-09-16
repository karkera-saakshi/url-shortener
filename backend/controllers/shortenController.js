const shortenModel = require("../models/shortenModel");
const urlValidate = require("../utils/urlValidator")
let createShortUrl = (req, res)=>
{
    let url = req.body.url;
    let result = urlValidate.validUrl(url);
    if(result == true)
    {
        shortenModel.createShortUrl(url)
    }
    else{
        res.send("URL is invalid");
    }
}

module.exports = { createShortUrl };