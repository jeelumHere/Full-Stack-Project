import mongoose from "mongoose"
import config from "./config.js"

async function connectDB(){
    await mongoose.connect(config.mongoUri)
    console.log('Database is connected to server');
}

export default connectDB