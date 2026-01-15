const user = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const { generateToken } = require("../utils/generateTokens");

const register = async(req,res)=>{
  const {name,email,password} = req.body;

  const UserExists = await user.findOne({email});
  if(UserExists){
    return res.status(400).json({
      message:"User Already Exists"
    });
  }

  const hashPassword = await bcrypt.hash(password,10);
  const verifyToken = crypto.randomBytes(32).toString("hex");

  await user.create({
    name,
    email,
    password:hashPassword,
    emailVerifyToken:verifyToken
  });

  const transporter = nodemailer.createTransport({
    secure:false,
    host:'smtp.gmail.com',
    port:587,
    auth:{
      user:process.env.EMAIL,
      pass:process.env.EMAIL_PASS
    },
    tls: {
    rejectUnauthorized: false 
  },
  connectionTimeout: 10000, 
  greetingTimeout: 10000,
  });

  transporter.verify(function (error, success) {
  if (error) {
    console.error('❌ Email configuration error:', error);
  } else {
    console.log('✅ Email server is ready to send messages');
  }
});

  const link = `${process.env.BACKEND_URL}/api/auth/verify/${verifyToken}`;

  await transporter.sendMail({
    to:email,
    subject:"Verify Your Account",
    html:`
      <h3>Click to verify</h3>
      <a href="${link}">Verify Account</a>
    `
  });

  res.json({
    message:"Check Your Email to Verify"
  });
};


const login = async(req,res)=>{
  const {email,password} = req.body;

  const existuser = await user.findOne({email});
  if(!existuser){
    return res.status(400).json({message:"Invalid Credentials"});
  }

  if(!existuser.emailVerified){
    return res.status(403).json({message:"Verify email first"});
  }

  const match = await bcrypt.compare(password,existuser.password);
  if(!match){
    return res.status(400).json({message:"Invalid Credentials"});
  }

  const token = generateToken(existuser._id);

  res.cookie("authToken", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false
  });

  res.json({ message:"Login Success" });
};

const logOut = async(req,res)=>{
  res.clearCookie("authToken");
  res.json({ message:"Logged Out" });
};

const verifyEmail = async(req,res)=>{
  const {token}=req.params;

  const existuser = await user.findOne({
    emailVerifyToken:token
  });

  if(!existuser){
    return res.status(400).send("Invalid");
  }

  existuser.emailVerified = true;
  existuser.emailVerifyToken = null;
  await existuser.save();

  res.redirect(`${process.env.FRONTEND_URL}/login`);
};

const forgotPassword = async(req,res)=>{
  const {email} = req.body;

  const existuser = await user.findOne({email});
  if(!existuser){
    return res.json({ message:"Mail Sent" });
  }

  const token = crypto.randomBytes(32).toString("hex");
  existuser.resetToken = token;
  existuser.resetExpire = Date.now()+10*60*1000;
  await existuser.save();

  const link = `${process.env.FRONTEND_URL}/reset-password/${token}`;

  const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
      user:process.env.EMAIL,
      pass:process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    to:email,
    subject:"Reset Password",
    html:`<a href="${link}">Reset Password</a>`
  });

  res.json({
    message:"Check Email"
  });
};


const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const existuser = await user.findOne({
      resetToken: token,
      resetExpire: { $gt: Date.now() }
    });

    if (!existuser) {
      return res.status(400).json({
        message: "Token expired or invalid"
      });
    }

    existuser.password = await bcrypt.hash(password, 10);
    existuser.resetToken = null;
    existuser.resetExpire = null;
    await existuser.save();

    res.json({
      message: "Password Updated Successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error"
    });
  }
};


const me = async (req, res) => {
  const userData = await user.findById(req.user.id)
    .select("-password -refreshToken");

  res.json(userData);
};


module.exports = {
  register,
  login,
  logOut,
  verifyEmail,
  forgotPassword,
  resetPassword,
  me
};
