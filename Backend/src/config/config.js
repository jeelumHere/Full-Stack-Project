import dotenv from "dotenv"
dotenv.config()

if(!process.env.MONGO_URI){
    throw new Error("MONGO_URI is not present in environmental variables")
}


const config = {
    mongoUri : process.env.MONGO_URI
}

export default config