import * as imageControllers from "../controllers/img.controllers.js"
import * as imageMidlleware from "../middleware/auth.middleware.js"

import {Router} from "express"

const imgRouter = Router()
imgRouter.post("/uploadImages",imageMidlleware.validateUserAccessToken,imageControllers.uploadImages)
imgRouter.delete("/deleteFolder",imageMidlleware.validateUserAccessToken,imageControllers.deleteFolder)
imgRouter.delete("/deleteSubFolder",imageMidlleware.validateUserAccessToken,imageControllers.deleteSubFolder)
imgRouter.delete("/deleteImages",imageMidlleware.validateUserAccessToken,imageControllers.deleteImages)
imgRouter.get("/getImages",imageMidlleware.validateUserAccessToken,imageControllers.getImages)
imgRouter.post("/uploadPublicImages",imageMidlleware.validateUserAccessToken,imageControllers.uploadPublicImages)
imgRouter.delete("/deletePublicImages",imageMidlleware.validateUserAccessToken,imageControllers.deletePublicImages)
imgRouter.get("/getPublicImages",imageMidlleware.validateUserAccessToken,imageControllers.getPublicImages)

export default imgRouter