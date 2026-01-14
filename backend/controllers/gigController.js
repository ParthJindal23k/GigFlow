const Gig = require("../models/Gig");

const createGig = async (req,res)=>{
  const gig = await Gig.create({
    ...req.body,
    ownerId: req.user.id
  });
  res.json(gig);
}

const getGigs = async (req,res)=>{
  const { search } = req.query;

  let filter = { status:"open" };

  if(search){
    filter.title = { $regex: search, $options:"i" };
  }

  const gigs = await Gig.find(filter);
  res.json(gigs);
}

const myGigs = async(req,res) =>{
    const gigs = await Gig.find({
        ownerId:req.user.id
    })
    res.json(gigs)
}


module.exports ={createGig,getGigs,myGigs}