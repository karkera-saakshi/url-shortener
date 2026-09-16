const { MongoClient } = require("mongodb");
let url = process.env.MONGODB_URI;

let getNextSequence = async () => {
    let client = new MongoClient(url);
    await client.connect();
    let db = client.db("urlShortener");
    let coll = db.collection("counters");

    let result = await coll.findOneAndUpdate(
        { _id: "urlCounter" },
        { $inc: { seq: 1 } },
        { upsert: true, returnDocument: "after" }
    );

    await client.close();
    return result.seq;
};



let saveUrl = async (shortUrl, orignalUrl) =>{
    let client = new MongoClient(url);
    await client.connect();
    let db = client.db("urlShortener")
    let coll = db.collection("urls");

   let obj = {
    shortUrl: shortUrl,
    orignalUrl: orignalUrl
    }
    await coll.insertOne(obj)
    await client.close();
}

module.exports = { getNextSequence, saveUrl };