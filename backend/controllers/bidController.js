const Bid = require("../models/Bid");
const Gig = require("../models/Gig");
const mongoose = require("mongoose");
const onlineUser = require("../utils/onlineUser")

const createBid = async (req, res) => {
  const { gigId } = req.body;
  const gig = await Gig.findById(gigId);

  if (gig.ownerId.toString() === req.user.id) {
    return res.status(400).json({
      message: "You cannot apply to your own gig"
    });
  }

  const bid = await Bid.create({
    ...req.body,
    freelancerId: req.user.id
  });

  const ownerSocketId = onlineUser.get(gig.ownerId.toString());
  if (ownerSocketId) {
    global.io.to(ownerSocketId).emit("new_bid", {
      message: `You have a new bid on your gig: ${gig.title}`,
      gigId: gig._id
    });
  }

  res.json(bid);
};
const getBidsForGig = async (req, res) => {
  const bids = await Bid.find({ gigId: req.params.gigId })
    .populate("freelancerId", "name email");

  res.json(bids);
};


const hireBid = async(req,res)=>{
  const session = await mongoose.startSession();
  session.startTransaction();

  try{
    const bid = await Bid.findById(req.params.bidId).session(session);
    if(!bid) throw "Bid not found";

    const gig = await Gig.findById(bid.gigId).session(session);
    if(gig.status === "assigned"){
      throw "Already assigned";
    }

    bid.status = "hired";
    await bid.save({session});

    await Bid.updateMany(
      { gigId: bid.gigId, _id:{ $ne: bid._id }},
      { status:"rejected" },
      { session }
    );

    gig.status="assigned";
    await gig.save({session});

    await session.commitTransaction(); 

    const socketId = onlineUser.get(bid.freelancerId.toString());
    console.log("SOCKET:", socketId);

    if(socketId){
      global.io.to(socketId).emit("hired",{
        message:`You have been hired for ${gig.title}!`,
        gigId:gig._id
      });
    }

    res.json({ message:"Freelancer hired successfully" });

  }catch(err){

    if(session.inTransaction()){
      await session.abortTransaction(); 
    }

    res.status(400).json({ message: err });
  }finally{
    session.endSession();
  }
};

const getMyBids = async (req, res) => {
  try {

    const bids = await Bid.find({
      freelancerId: req.user.id
    })
      .populate("gigId", "title budget status")
      .sort({ createdAt: -1 });

    res.json(bids);

  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch bids"
    });
  }
};



const rejectBid = async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.bidId);
    if (!bid) return res.status(404).json({ message: "Bid not found" });

    const gig = await Gig.findById(bid.gigId);
    if (gig.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (bid.status !== "pending") {
      return res.status(400).json({ message: "Bid already processed" });
    }

    bid.status = "rejected";
    await bid.save();

    
    const socketId = onlineUser.get(bid.freelancerId.toString());
    if (socketId) {
      global.io.to(socketId).emit("bid_rejected", {
        message: `Your bid for ${gig.title} was rejected.`,
        gigId: gig._id
      });
    }

    res.json({ message: "Bid rejected" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};




module.exports = { createBid, getBidsForGig, hireBid, getMyBids,rejectBid }
