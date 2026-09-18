const { createClient } = require('redis');
let url = process.env.REDIS_URL;
let redisConnect = async () =>
{
    const client = createClient({ url });
    await client.connect();
    return client;
}
module.exports = redisConnect();