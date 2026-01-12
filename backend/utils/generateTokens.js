const jwt = require("jsonwebtoken")

const generateAccessToken = (id)=>{
    return jwt.sign(
        {id},
        process.env.JWT_SECRET_KEY,
        {expiresIn:"15m"}
    )
}

const generateRefreshToken = (id)=>{
    return jwt.sign(
        {id},
        process.env.JWT_REFRESH_SECRET_KEY,
        {expiresIn:"7d"}
    )
}

module.exports={generateAccessToken,generateRefreshToken}