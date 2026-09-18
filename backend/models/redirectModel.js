const { MongoClient } = require("mongodb");
let url = process.env.MONGODB_URI;
const redisClient = require("../utils/redisClient");

let redirectToOriginalUrl = async (shortUrl) =>
{
    const value = await redisClient.get(shortUrl); // Cache Hit
    if(value != null)
    {
        return value;
    }
    let client = new MongoClient(url);
    await client.connect();
    let db = client.db("urlShortener")
    let coll = db.collection("urls");
    let urlObj = await coll.findOne({ shortUrl: shortUrl })

    if(!urlObj)
    {
        await client.close();
        return null;
    }
    else{
        await client.close();
        await redisClient.set(shortUrl, urlObj.orignalUrl);
        return urlObj.orignalUrl;
    }
}

module.exports = { redirectToOriginalUrl };