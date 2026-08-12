import { Router } from 'express'
import multerMiddleware from "../middleware/file.middleware.js"
import * as authMiddleware from "../middleware/auth.middleware.js"
import * as fileControllers from "../controllers/file.contollers.js"
import multer from "multer"
const upload = multer({ storage: multer.memoryStorage() })

const fileRouter = Router()

fileRouter.post("/", authMiddleware.validateUserAccessToken, multerMiddleware.single("file"), fileControllers.uploadFile)
fileRouter.delete("/", authMiddleware.validateUserAccessToken, upload.none(), fileControllers.deleteFiles)
fileRouter.get("/", authMiddleware.validateUserAccessToken, fileControllers.getFiles)
fileRouter.post("/public", authMiddleware.validateUserAccessToken, fileControllers.uploadPublicFiles)
fileRouter.delete("/public", authMiddleware.validateUserAccessToken, fileControllers.deletePublicFiles)

export default fileRouter