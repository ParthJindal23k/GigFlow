require("dotenv").config()

const app = require("./app")
const connectDatabase = require("./config/db")

const PORT = process.env.PORT

connectDatabase()

app.listen(PORT,()=>{
    console.log(`Server is Running on ${PORT}`)
})