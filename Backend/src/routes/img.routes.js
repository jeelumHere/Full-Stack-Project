import * as imageControllers from "../controllers/img.controllers.js"
import * as imageMidlleware from "../middleware/auth.middleware.js"

import {Router} from "express"

const imgRouter = Router()
imgRouter.post("/uploadImages",imageMidlleware.validateUserAccessToken,imageControllers.uploadImages)
imgRouter.delete("/deleteFolder",imageMidlleware.validateUserAccessToken,imageControllers.deleteFolder)
imgRouter.delete("/deleteSubFolder",imageMidlleware.validateUserAccessToken,imageControllers.deleteSubFolder)
imgRouter.delete("/",imageMidlleware.validateUserAccessToken,imageControllers.deleteImages)
imgRouter.get("/:parentFolder/:folder",imageMidlleware.validateUserAccessToken,imageControllers.getImages)
imgRouter.post("/public",imageMidlleware.validateUserAccessToken,imageControllers.uploadPublicImages)
imgRouter.delete("/public",imageMidlleware.validateUserAccessToken,imageControllers.deletePublicImages)
imgRouter.get("/public/:parentFolder/:folder",imageMidlleware.validateUserAccessToken,imageControllers.getPublicImages)

export default imgRouter