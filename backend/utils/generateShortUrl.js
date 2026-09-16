const characters = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
let generateShortUrl = (url, num) =>
{
    let code = "";
    while (num > 0) {
        let remainder = num % 62;
        code = characters[remainder] + code;
        num = Math.floor(num / 62);
    }
    let shortUrlObj =
    {
        code : code,
        shortUrl: `${process.env.BASE_URL}/${code}`,
    }
    return shortUrlObj || "0";
}

module.exports = { generateShortUrl };