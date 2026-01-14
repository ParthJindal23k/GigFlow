const express = require("express");
const { createGig, getGigs } = require("../controllers/gigController");
const auth = require("../middleware/auth");
const { myGigs } = require("../controllers/gigController");

const router = express.Router();

router.post("/", auth, createGig);
router.get("/", getGigs);
router.get('/my',auth,myGigs)

module.exports = router;
