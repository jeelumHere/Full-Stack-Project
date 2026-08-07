import {Router} from "express"
import * as grpControllers from "../controllers/grp.controllers.js"
import * as authMiddleware from "../middleware/auth.middleware.js"

const grpRouter = Router()

grpRouter.post("/createGroup",authMiddleware.validateUserAccessToken,grpControllers.createGroup)
grpRouter.post("/:groupId/addMember",authMiddleware.validateUserAccessToken,grpControllers.addMember)
grpRouter.post("/invitation",authMiddleware.validateUserAccessToken,grpControllers.invitation)

export default grpRouter