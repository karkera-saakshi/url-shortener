const { MongoClient } = require("mongodb");
let url = process.env.MONGODB_URI;

let redirectToOriginalUrl = async (shortUrl) =>
{
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
        return urlObj.orignalUrl;
    }
}

module.exports = { redirectToOriginalUrl };