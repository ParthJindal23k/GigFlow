const user = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendEmail } = require('../config/email');


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

  
  const link = `${process.env.BACKEND_URL}/api/auth/verify/${verifyToken}`;


await sendEmail({
      to: email, // Use email from req.body, not user.email (user doesn't exist yet)
      subject: 'Verify Your Email - GigFlow',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 15px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
            .button:hover { background: #764ba2; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to GigFlow!</h1>
            </div>
            <div class="content">
              <h2>Hi ${name},</h2>
              <p>Thanks for signing up! We're excited to have you on board.</p>
              <p>Please verify your email address by clicking the button below:</p>
              
              <div style="text-align: center;">
                <a href="${link}" class="button">Verify Email Address</a>
              </div>
              
              <p>Or copy and paste this link into your browser:</p>
              <p style="background: #fff; padding: 10px; border-radius: 5px; word-break: break-all;">
                ${link}
              </p>
              
              <p style="margin-top: 30px; color: #666;">
                <strong>Note:</strong> This link will expire in 24 hours.
              </p>
              
              <p style="margin-top: 20px;">
                If you didn't create an account, you can safely ignore this email.
              </p>
            </div>
            <div class="footer">
              <p>&copy; 2026 GigFlow. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Hi ${name},
        
        Welcome to GigFlow! Thanks for signing up.
        
        Please verify your email address by clicking this link:
        ${link}
        
        This link will expire in 24 hours.
        
        If you didn't create an account, you can safely ignore this email.
        
        Best regards,
        GigFlow Team
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
