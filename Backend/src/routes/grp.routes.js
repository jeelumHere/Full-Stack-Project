import {Router} from "express"
import * as grpControllers from "../controllers/grp.controllers.js"
import * as authMiddleware from "../middleware/auth.middleware.js"

const grpRouter = Router()

grpRouter.post("/createGroup",authMiddleware.validateUserAccessToken,grpControllers.createGroup)
grpRouter.post("/:groupId/addMember",authMiddleware.validateUserAccessToken,grpControllers.addMember)
grpRouter.post("/invitation",authMiddleware.validateUserAccessToken,grpControllers.invitation)
grpRouter.post("/acceptInvitation",authMiddleware.validateUserAccessToken,grpControllers.acceptInvitation)
grpRouter.get("/myGroups",authMiddleware.validateUserAccessToken,grpControllers.myGroups)
grpRouter.post("/:groupId/uploadImages",authMiddleware.validateUserAccessToken,grpControllers.uploadImages)
grpRouter.delete("/:groupId/deleteImages",authMiddleware.validateUserAccessToken,grpControllers.deleteImages)

export default grpRouter