const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/authRoute");
const gigRoute = require("./routes/gigRoute");
const bidRoute = require("./routes/bidRoute");

const app = express();

const FRONTEND_URL = process.env.FRONTEND_URL || "https://gig-flow-dun.vercel.app";

const corsOptions = {
  origin: FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200 
};


app.use(cors(corsOptions));


app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/gigs", gigRoute);
app.use("/api/bids", bidRoute);
app.use("/api/auth", authRoute);

module.exports = app;