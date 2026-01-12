const mongoose = require("mongoose")
const connectDatabase = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("MongoDB connected")
    } catch (error) {
        console.log(error.message)

    }
}

module.exports = connectDatabase