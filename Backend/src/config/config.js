import dotenv from "dotenv"
dotenv.config()

if(!process.env.MONGO_URI){
    throw new Error("MONGO_URI is not present in environmental variables")
}
if(!process.env.JWT_SECRET){
    throw new Error("JWT_SECRET is not present in environmental variables")
}
if(!process.env.GOOGLE_CLIENT_ID){
    throw new Error("GOOGLE_CLIENT_ID is not present in environmental variables")
}
if(!process.env.GOOGLE_CLIENT_SECRET){
    throw new Error("GOOGLE_CLIENT_SECRET is not present in environmental variables")
}
if(!process.env.GOOGLE_REFRESH_TOKEN){
    throw new Error("GOOGLE_REFRESH_TOKEN is not present in environmental variables")
}
if(!process.env.GOOGLE_USER){
    throw new Error("GOOGLE_USER is not present in environmental variables")
}


const config = {
    mongoUri : process.env.MONGO_URI,
    jwtSecret : process.env.JWT_SECRET,
    googleClientId : process.env.GOOGLE_CLIENT_ID,
    googleClientSecret : process.env.GOOGLE_CLIENT_SECRET,
    googleRefreshToken : process.env.GOOGLE_REFRESH_TOKEN,
    googleUser : process.env.GOOGLE_USER
}

export default config