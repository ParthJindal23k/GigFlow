const mongoose = require("mongoose");

const connectDatabase = async () => {
  try {
    // ADD THIS LINE TEMPORARILY
    console.log("Current MONGO_URL:", process.env.MONGO_URL); 

    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDatabase;