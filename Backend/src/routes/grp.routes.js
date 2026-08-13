import {Router} from "express"
import * as grpControllers from "../controllers/grp.controllers.js"
import * as authMiddleware from "../middleware/auth.middleware.js"
import multerMiddleware from "../middleware/file.middleware.js"
import multer from "multer"
const upload = multer({storage:multer.memoryStorage()})

const grpRouter = Router()

// grpRouter.post("/createGroup",authMiddleware.validateUserAccessToken,grpControllers.createGroup)
// grpRouter.post("/:groupId/addMember",authMiddleware.validateUserAccessToken,grpControllers.addMember)
// grpRouter.post("/invitation",authMiddleware.validateUserAccessToken,grpControllers.invitation)
// grpRouter.post("/acceptInvitation",authMiddleware.validateUserAccessToken,grpControllers.acceptInvitation)
// grpRouter.get("/myGroups",authMiddleware.validateUserAccessToken,grpControllers.myGroups)
// grpRouter.post("/:groupId/uploadImages",authMiddleware.validateUserAccessToken,grpControllers.uploadImages)
// grpRouter.delete("/:groupId/deleteImages",authMiddleware.validateUserAccessToken,grpControllers.deleteImages)



grpRouter.post("/", authMiddleware.validateUserAccessToken, grpControllers.createGroup)
grpRouter.post("/:groupId/members", authMiddleware.validateUserAccessToken, grpControllers.addMember)
grpRouter.post("/invitations", authMiddleware.validateUserAccessToken, grpControllers.invitation)
grpRouter.patch("/invitations/:invitationId", authMiddleware.validateUserAccessToken, grpControllers.acceptInvitation)
grpRouter.get("/", authMiddleware.validateUserAccessToken, grpControllers.myGroups)
grpRouter.post("/:groupId/images", authMiddleware.validateUserAccessToken,upload.array("image"), grpControllers.uploadImages)
grpRouter.delete("/:groupId/images", authMiddleware.validateUserAccessToken,upload.none(), grpControllers.deleteImages)
grpRouter.delete("/:groupId/members/me", authMiddleware.validateUserAccessToken, grpControllers.leaveGroup)
grpRouter.delete("/:groupId/members/:memberId", authMiddleware.validateUserAccessToken, grpControllers.removeMember)
grpRouter.post("/:groupId/files", authMiddleware.validateUserAccessToken, multerMiddleware.single("file"), grpControllers.uploadFiles)
grpRouter.delete("/:groupId/files/:parentFolder/:folder", authMiddleware.validateUserAccessToken,upload.none(), grpControllers.deleteFiles)
grpRouter.get("/:groupId/images/:parentFolder/:folder", authMiddleware.validateUserAccessToken, grpControllers.getGrpImages)
grpRouter.get("/:groupId/files/:parentFolder/:folder", authMiddleware.validateUserAccessToken, grpControllers.getGrpFiles)


export default grpRouter