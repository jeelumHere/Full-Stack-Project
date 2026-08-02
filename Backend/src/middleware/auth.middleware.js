import { body, validationResult } from "express-validator"
import jwt from "jsonwebtoken"
import config from "../config/config.js"
import userModel from "../models/user.model.js"
import sessionModel from "../models/session.model.js"

function validateResult(req, res, next) {
    const result = validationResult(req)
    if (result.isEmpty()) {
        return next()
    }
    return res.status(400).json({ errors: result.array() })
}

export const validateUserInput = [
    body("username")
        .isString()
        .withMessage("Username must be a string")
        .isLength({ min: 8, max: 20 })
        .withMessage("Username must have 8 to 20 characters"),

    body("email")
        .isEmail()
        .withMessage("Invalid Email"),

    body("password")
        .isLength({ min: 8, max: 20 })
        .withMessage("Password must have 8 to 20 characters"),

    validateResult
]

export async function validateUserAccessToken(req, res, next) {
    try {
        const accessToken = req.headers.authorization.split(" ")[1]

        const refreshToken = req.cookies.refreshToken;

        if (!accessToken) {
            return res.status(404).json({
                message: "access token not found"
            })
        }

        if (!refreshToken) {
            return res.status(401).json({
                message: "Refresh token not found in cookies"
            });
        }

        const decoded = jwt.verify(accessToken, config.jwtAccessSecret)

        const user = await userModel.findById(decoded.id)

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        if(!user.isEmailVerified){
            return res.status(404).json({
                message : "Email not verified"
            })
        }

        const deviceId = req.cookies.deviceId
        if (!deviceId) {
            return res.status(404).json({
                message: "deviceId not found"
            })
        }

        const session = await sessionModel.findOne({deviceId:deviceId, user: user._id })
        if (!session) {
            return res.status(404).json({
                message: "session not found"
            })
        }

        req.user = user
        req.accessToken = accessToken
        next()
    }
    catch (err) {
        return res.status(500).json({
            error: "Server Error",
            message: err.message
        })
    }
}