import * as officeController from "../controllers/office.controllers.js"
import { Router } from "express"
import * as authMiddleware from "../middleware/auth.middleware.js"
import upload from "../middleware/office.middleware.js"

const officeRouter = Router()

officeRouter.post("/", authMiddleware.validateUserAccessToken, upload.single("file"), officeController.uploadFile)
officeRouter.get("/", authMiddleware.validateUserAccessToken, officeController.url)



export default officeRouter