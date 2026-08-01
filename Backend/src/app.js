import express from "express"
import multer from "multer"
import morgan from "morgan"
import authRouter from "./routes/auth.routes.js"
import cookieParser from "cookie-parser"

const upload = multer({storage: multer.memoryStorage()})
const app = express()

app.use(express.json())
app.use(morgan("dev"))
app.use(cookieParser())

app.use("/api/auth",upload.none(),authRouter)

export default app;