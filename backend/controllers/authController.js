const user = require("../models/User")

const bcrypt = require("bcryptjs")

const jwt = require("jsonwebtoken")
const crypto = require("crypto")
const nodemailer = require("nodemailer")

const {generateAccessToken,generateRefreshToken} = require("../utils/generateTokens")


const register = async(req,res)=>{
    const {name,email,password} = req.body;

    const UserExists = await user.findOne({email})
    if(UserExists){
        return res.status(400).json({
            message:"User Already Exists"
        });
    }

    const hashPassword = await bcrypt.hash(password,10)

    const verifyToken = crypto.randomBytes(32).toString("hex")


    await user.create({
        name,
        email,
        password:hashPassword,
        emailVerifyToken:verifyToken
    })

    const transporter = nodemailer.createTransport({
        secure:true,
        host:'smtp.gmail.com',
        port:465,
        auth:{
            user:process.env.EMAIL,
            pass:process.env.EMAIL_PASS
        }
    })

    const link = `${process.env.BACKEND_URL}/api/auth/verify/${verifyToken}`

    await transporter.sendMail({
        to:email,
        subject:"Verify Your Account",
        html: `
<h3>Click to verify</h3>
<a 
  href="${link}" 
  target="_blank"
  style="color:blue; font-size:16px;"
>
  Verify Account
</a>
`

    })

    res.json({
        message:"Check Your Email to Verify"
    })

}

const login = async(req,res) =>{
    const {email,password} = req.body

    const existuser = await user.findOne({email});

    if(!existuser){
        return res.status(400).json({
            message:"Invalid Credentials"
        })
    }

    if(!existuser.emailVerified){
        return res.status(403).json({message:"Verify email first"})
    }

    const match = await bcrypt.compare(password,existuser.password)
    if(!match){
        return res.status(400).json({
            message:"Invalid Credentials"
        })
    }

    const accessToken = generateAccessToken(existuser._id);
    const refreshToken = generateRefreshToken(existuser._id)

    existuser.refreshToken = refreshToken
    await existuser.save()

    res.cookie("accessToken",accessToken,{
        httpOnly:true,
        maxAge:15*60*1000
    })

    res.cookie("refreshToken",refreshToken,{
        httpOnly:true,
        maxAge:7*24*60*60*1000
    })

    res.json({
        message:"Login Success"
    })

}


const refresh = async(req,res) =>{
    console.log("COOKIES RECEIVED:", req.cookies);

    const token = req.cookies.refreshToken
    if(!token){
        return res.sendStatus(401)
    }

    const existuser = await user.findOne({refreshToken:token})
    if(!existuser){
        return res.sendStatus(403)
    }
    jwt.verify(
        token,
        process.env.JWT_REFRESH_SECRET_KEY,
        (err,decoded)=>{
            if(err){
                return res.sendStatus(403)
            }

            const newAccess = generateAccessToken(decoded._id)
            res.cookie("accessToken",newAccess,{
                httpOnly:true,
                maxAge:15*60*1000
            })

            res.json({
                message:"Token Refreshed"
            })
        }
    )
}


const logOut = async(req,res)=>{
    const token = req.cookies.refreshToken

    await user.findOneAndUpdate(
        {refreshToken:token},
        {refreshToken:null}
    )

    res.clearCookie("accessToken")
    res.clearCookie("refreshToken")

    res.json({
        message:"Logged Out"
    })
}


const verifyEmail = async(req,res)=>{
    const {token}=req.params;

    console.log("VERIFY API HIT");
console.log("TOKEN:", token);

    const existuser = await user.findOne({
        emailVerifyToken:token
    })
    if(!existuser){
        return res.status(400).send("Invalid")
    }

    existuser.emailVerified = true
    existuser.emailVerifyToken = null;
    await existuser.save()

    res.redirect(`${process.env.FRONTEND_URL}/login`)


}

const forgotPassword = async(req,res)=>{
    const {email} = req.body
    const existuser = await user.findOne({email})
    if(!existuser){
        return res.json({
            message:"Mail Sent"
        })
    }

    const token = crypto.randomBytes(32).toString("hex")
    existuser.resetToken=token
    existuser.resetExpire=Date().now()+10*60*1000
    await existuser.save()

    const link = `${process.env.BACKEND_URL}/reset/${token}`

    const transporter = nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:process.env.EMAIL,
            pass:process.env.EMAIL_PASS
        }
    })

    await transporter.sendMail({
        to:email,
        subject:"Reset Password",
        html:`<a href="${link}">Reset Password</a>`
    })

    res.json({
        message:"Check Email"
    })
}


const resetPassword = async(req,res)=>{
    const {token} = req.params;
    const {password} = req.body;
    const existuser = await user.findOne({
        resetToken:token,
        resetExpire:{$gt:Date.now()}
    })

    if(!existuser){
        return res.status(400).json({message:"Invalid"});
    }

    existuser.password = await bcrypt.hash(password,10)
    existuser.resetToken= null;
    existuser.resetExpire=null
    await existuser.save()

    res.json({
        message:"Password Updated"
    })
}

module.exports = {register,login,refresh,logOut,verifyEmail,resetPassword,forgotPassword}