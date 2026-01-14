const express = require("express");
const {
  createBid,
  getBidsForGig,
  hireBid,
  getMyBids,
  rejectBid
} = require("../controllers/bidController");

const auth = require("../middleware/auth");
const router = express.Router();

router.post("/", auth, createBid);

router.get("/my-bids", auth, getMyBids);

router.get("/:gigId", auth, getBidsForGig);
router.patch("/:bidId/hire", auth, hireBid);
router.patch("/:bidId/reject", auth, rejectBid);


module.exports = router;
