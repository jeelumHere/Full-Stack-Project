import {Router} from 'express'
import * as authControllers from "../controllers/auth.controllers.js"
import * as authMiddleware from "../middleware/auth.middleware.js"

const authRouter = Router()

authRouter.post("/register",authMiddleware.validateUserInput,authControllers.register)
authRouter.post("/login",authControllers.login)
authRouter.post("/verifyEmail",authControllers.verifyEmail)
authRouter.post("/getOtp",authControllers.getOtp)


export default authRouter