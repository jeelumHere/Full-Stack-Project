import { Router } from 'express'
import upload from "../middleware/file.middleware.js"
import * as authMiddleware from "../middleware/auth.middleware.js"
import * as fileControllers from "../controllers/file.contollers.js"

const fileRouter = Router()

fileRouter.post("/", authMiddleware.validateUserAccessToken,upload.single("file"),fileControllers.uploadFile)
fileRouter.delete("/", authMiddleware.validateUserAccessToken,fileControllers.deleteFiles)

export default fileRouter