const express = require("express")

const {register,login,refresh,logOut,verifyEmail,resetPassword,forgotPassword} = require("../controllers/authController")

const router = express.Router()

router.post("/register",register)
router.post("/login",login)
router.post("/refresh",refresh)
router.post("/logout",logOut)
router.get("/verify/:token",verifyEmail);
router.post("/forgot",forgotPassword);
router.post("/reset/:token",resetPassword);


module.exports = router