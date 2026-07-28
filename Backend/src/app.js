import express from "express"
import multer from "multer"
import morgan from "morgan"
import authRouter from "./routes/auth.routes.js"

const upload = multer({storage: multer.memoryStorage()})
const app = express()

app.use(express.json())
app.use(morgan("dev"))

app.use("/api/auth",upload.none(),authRouter)

export default app;