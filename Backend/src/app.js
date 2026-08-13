import express from "express"
import multer from "multer"
import morgan from "morgan"
import authRouter from "./routes/auth.routes.js"
import imgRouter from "./routes/img.routes.js"
import grpRouter from "./routes/grp.routes.js"
import fileRouter from "./routes/file.routes.js"
import officeRouter from "./routes/office.routes.js"
import cookieParser from "cookie-parser"

const upload = multer({storage: multer.memoryStorage()})
const app = express()

app.use(express.json())
app.use(morgan("dev"))
app.use(cookieParser())

app.use("/api/auth",upload.none(),authRouter)
app.use("/api/img",upload.array("image"),imgRouter)
app.use("/api/grp",grpRouter)
app.use("/api/file",fileRouter)
app.use("/api/office",officeRouter)
export default app;