import * as officeController from "../controllers/office.controllers.js"
import { Router } from "express"
import * as authMiddleware from "../middleware/auth.middleware.js"
import upload from "../middleware/office.middleware.js"
import multer from 'multer'
const upload01 = multer({storage : multer.memoryStorage()})

const officeRouter = Router()

officeRouter.post("/", authMiddleware.validateUserAccessToken, upload.single("file"), officeController.uploadFile)
officeRouter.post("/url", authMiddleware.validateUserAccessToken,upload01.none(), officeController.url)



export default officeRouter