const jwt = require("jsonwebtoken")

module.exports = async(req,res,next) =>{
    const token = req.cookie.accessToken
    if(!token){
        return res.sendStatus(401)
    }
    jwt.verify(
        token,process.env.JWT_SECRET_KEY,
        (err,decoded)=>{
            if(err){
                return res.sendStatus(403)
            }
            req.user = decoded.id
            next()
        }
    )
}