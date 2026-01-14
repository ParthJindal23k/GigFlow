const express = require("express");
const {
  register,
  login,
  logOut,
  verifyEmail,
  forgotPassword,
  resetPassword,
  me
} = require("../controllers/authController");
const auth = require("../middleware/auth");


const router = express.Router();

router.post("/register",register);
router.post("/login",login);
router.post("/logout",logOut);
router.get("/verify/:token",verifyEmail);
router.post("/forgot",forgotPassword);
router.post("/reset/:token",resetPassword);
router.get("/me", auth, me);


module.exports = router;
