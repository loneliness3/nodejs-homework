const reqTime = (req, res, next)=>{
    req.requestTime = new Date().toISOString();
    console.log(req.requestTime)
    next();
}

module.exports = reqTime;