import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import config from "../config/config.js"
import { sendEmail } from "../services/email.service.js"
import { getOtpHtml, generateOtp, createSession, getTheOtp } from "../utils/otp.utils.js"
import userModel from "../models/user.model.js"
import sessionModel from "../models/session.model.js"
import otpModel from "../models/otp.model.js"
import crypto from "crypto"

export async function register(req, res) {

    try {
        const { username, email, password, confirmPassword, role = "user" } = req.body

        if (!(password === confirmPassword)) {
            return res.status(400).json({
                message: "Password and confirm password are different"
            })
        }

        const isValidUser = await userModel.findOne({
            $or: [{ username: username }, { email: email }]
        })
        if (isValidUser) {
            return res.status(409).json({
                message: "User already registered in database"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await userModel.create({
            username,
            email,
            password: hashedPassword,
            role
        })

        const safeUser = user.toObject()
        delete safeUser.password

        await getTheOtp(req, res, email)

        return res.status(201).json({
            message: 'User registered successfully',
            User: safeUser
        })
    }
    catch (err) {
        return res.status(500).json({
            error: "Server Error",
            messsage: err.message
        })
    }

}

export async function login(req, res) {
    try {
        const { usernameOrEmail, password } = req.body

        const user = await userModel.findOne({
            $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
        }).select("+password")


        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        const isValidPassword = await bcrypt.compare(password, user.password)

        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        const { password: _, ...userWithoutPassword } = user.toObject()

        // await getTheOtp(req, res, user.email)

        const refreshToken = jwt.sign({ id: user._id, role: user.role }, config.jwtRefreshSecret, { expiresIn: "7d" })
        const accessToken = jwt.sign({ id: user._id, role: user.role }, config.jwtAccessSecret, { expiresIn: "15m" })

        const refreshTokenHash = await bcrypt.hash(refreshToken, 10)

        await createSession(req, res, user, refreshToken, refreshTokenHash)

        return res.status(200).json({
            message: 'User logged in successfully',
            User: userWithoutPassword,
            accessToken
        })
    }
    catch (err) {
        return res.status(500).json({
            error: "Server Error",
            message: err.message
        })
    }
}

export async function verifyEmail(req, res) {
    try {
        const { email, otp } = req.body

        const otpDoc = await otpModel.findOne({ email: email })
        if (!otpDoc) {
            return res.status(401).json({
                message: "Otp Expired Try again"
            })
        }

        const isValidOtp = await bcrypt.compare(otp, otpDoc.otp)
        if (!isValidOtp) {
            return res.status(401).json({
                message: "Invalid Otp"
            })
        }

        const user = await userModel.findByIdAndUpdate(otpDoc.user, {
            isEmailVerified: true
        })
        if (!user) {
            return res.status(401).json({
                message: "User not found with provided email"
            })
        }

        await otpModel.deleteMany({ email: email, user: user._id })

        const refreshToken = jwt.sign({ id: user._id, role: user.role }, config.jwtRefreshSecret, { expiresIn: "7d" })
        const accessToken = jwt.sign({ id: user._id, role: user.role }, config.jwtAccessSecret, { expiresIn: "15m" })

        const refreshTokenHash = await bcrypt.hash(refreshToken, 10)

        await createSession(req, res, user, refreshToken, refreshTokenHash)

        return res.status(201).json({
            message: "Email Verified",
            User: user,
            accessToken
        })
    }
    catch (err) {
        return res.status(500).json({
            error: "Server Error",
            message: err.message
        })
    }
}

export async function getOtp(req, res) {
    try {
        const { usernameOrEmail } = req.body
        const user = await userModel.findOne({
            $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
        })
        await otpModel.deleteMany({ user: user._id })

        await getTheOtp(req, res, user.email)

        return res.status(201).json({
            message: "Otp sent successfully",
            User : user
        })
    }
    catch (err) {
        return res.status(500).json({
            error: 'Server Error',
            message: err.message
        })
    }
}

export async function getMe(req, res) {
    try {
        const user = req.user

        return res.status(200).json({
            message: "User fetched successfully",
            User: user
        })
    }
    catch (err) {
        return res.status(500).json({
            error: "Server Error",
            message: err.message
        })
    }
}

export async function refreshToken(req, res) {
    try {
        const user = req.user

        const refreshToken = jwt.sign({ id: user._id, role: user.role }, config.jwtRefreshSecret, { expiresIn: "7d" })
        const accessToken = jwt.sign({ id: user._id, role: user.role }, config.jwtAccessSecret, { expiresIn: "59m" })

        const refreshTokenHash = await bcrypt.hash(refreshToken, 10)

        await createSession(req, res, user, refreshToken, refreshTokenHash)

        return res.status(200).json({
            message: "Token refreshed",
            accessToken
        })
    }
    catch (err) {
        return res.status(500).json({
            error: "Server error",
            message: err.message
        })
    }
}

export async function logout(req, res) {
    try {
        const user = req.user
        await user.save()

        const deviceId = req.cookies.deviceId

        const session = await sessionModel.findOneAndDelete({ user: user._id, deviceId: deviceId })

        res.clearCookie("deviceId")
        res.clearCookie("refreshToken")

        return res.status(200).json({
            message: "user logged Out successfully"
        })
    }
    catch (err) {
        return res.status(500).json({
            error: "Server Error",
            message: err.message
        })
    }
}


export async function logoutAll(req, res) {
    try {
        const user = req.user
        user.isEmailVerified = false
        await user.save()

        const session = await sessionModel.deleteMany({ user: user._id })

        res.clearCookie("deviceId")
        res.clearCookie("refreshToken")

        return res.status(200).json({
            message: "Logged Out from all devices"
        })
    }
    catch (err) {
        return res.status(500).json({
            error: "Server Error",
            message: err.message
        })
    }
}

export async function setNewPassword(req, res) {
    try {
        const user = req.user
        const { newPassword, confirmPassword } = req.body

        if (!(newPassword === confirmPassword)) {
            return res.status(400).json({
                message: "Password and Confirm Password do not match"
            })
        }

        const newPasswordHash = await bcrypt.hash(newPassword, 10)

        user.password = newPasswordHash
        await user.save()

        return res.status(200).json({
            message: "Password updated successfully"
        })
    }
    catch (err) {
        return res.status(500).json({
            error: "Server Error",
            message: err.message
        })
    }
}