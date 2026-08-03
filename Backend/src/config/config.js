import dotenv from "dotenv"
dotenv.config()

if(!process.env.MONGO_URI){
    throw new Error("MONGO_URI is not present in environmental variables")
}
if(!process.env.JWT_REFRESH_SECRET){
    throw new Error("JWT_REFRESH_SECRET is not present in environmental variables")
}
if(!process.env.JWT_ACCESS_SECRET){
    throw new Error("JWT_ACCESS_SECRET is not present in environmental variables")
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
if(!process.env.PRIVATE_KEY){
    throw new Error("PRIVATE_KEY is not present in environmental variables")
}
if(!process.env.PUBLIC_KEY){
    throw new Error("PUBLIC_KEY is not present in environmental variables")
}


const config = {
    mongoUri : process.env.MONGO_URI,
    jwtRefreshSecret : process.env.JWT_REFRESH_SECRET,
    jwtAccessSecret : process.env.JWT_ACCESS_SECRET,
    googleClientId : process.env.GOOGLE_CLIENT_ID,
    googleClientSecret : process.env.GOOGLE_CLIENT_SECRET,
    googleRefreshToken : process.env.GOOGLE_REFRESH_TOKEN,
    googleUser : process.env.GOOGLE_USER,
    privateKey : process.env.PRIVATE_KEY,
    publicKey : process.env.PUBLIC_KEY
}

export default config