import {Router} from 'express'
import * as authControllers from "../controllers/auth.controllers.js"
import * as authMiddleware from "../middleware/auth.middleware.js"

const authRouter = Router()

authRouter.post("/register",authMiddleware.validateUserInput,authControllers.register)
authRouter.post("/login",authControllers.login)
authRouter.post("/verifyEmail",authControllers.verifyEmail)
authRouter.post("/getOtp",authControllers.getOtp)
authRouter.get("/getMe",authMiddleware.validateUserAccessToken,authControllers.getMe)
authRouter.post("/refreshToken",authMiddleware.validateUserRefreshToken,authControllers.refreshToken)
authRouter.post("/logout",authMiddleware.validateUserAccessToken,authControllers.logout)
authRouter.post("/logoutAll",authMiddleware.validateUserAccessToken,authControllers.logoutAll)
authRouter.post("/setNewPassword",authMiddleware.validateUserAccessToken,authControllers.setNewPassword)


export default authRouter