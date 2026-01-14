const express = require("express")
const cors = require("cors")

const cookieParser = require("cookie-parser")
const authRoute = require("./routes/authRoute")

const gigRoute = require("./routes/gigRoute");
const bidRoute = require("./routes/bidRoute");


const app = express()
app.use(express.json())
app.use(cookieParser())

app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true
}))



app.use("/api/gigs", gigRoute);
app.use("/api/bids", bidRoute);
app.use('/api/auth',authRoute)


module.exports = app