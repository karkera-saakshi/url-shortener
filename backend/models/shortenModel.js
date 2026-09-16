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



let saveUrl = async () =>{

}

module.exports = { getNextSequence };