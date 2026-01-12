const express = require("express")
const cors = require("cors")

const cookieParser = require("cookie-parser")
const authRoute = require("./routes/authRoute")

const app = express()

app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true
}))

app.use(express.json())
app.use(cookieParser())

app.use('/api/auth',authRoute)


module.exports = app