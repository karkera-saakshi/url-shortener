let validUrl = (url) =>
{
    let urlObj = new URL(url);
    try{
        if(urlObj.protocol === "http:" || urlObj.protocol === "https:")
        {
            return true;
        }
        else{
            return false;
        }
    }
    catch(err){
        return false;
    }
    
}

module.exports = { validUrl };