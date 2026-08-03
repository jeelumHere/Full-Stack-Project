import * as imageControllers from "../controllers/img.controllers.js"
import * as imageMidlleware from "../middleware/auth.middleware.js"

import {Router} from "express"

const imgRouter = Router()
imgRouter.post("/uploadImages",imageMidlleware.validateUserAccessToken,imageControllers.uploadImages)

export default imgRouter