const { default: mongoose } = require("mongoose");
const DataInitializeService = require("../service/DataInitializeService");

  const connectDB=async()=>{
    try {
      console.log("Connecting to DB with URI:", process.env.DB_URI);
        const conn = await mongoose.connect(process.env.DB_URI);
        DataInitializeService.initializedAdminUser()
        console.log(`MongoDB connected: ${conn.connection.host}`)
    } catch (error) {
        console.log(`MongoDB Error: ${error}`)
    }
  }

  module.exports=connectDB;