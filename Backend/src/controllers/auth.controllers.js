import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import config from "../config/config.js"
import { sendEmail } from "../services/email.service.js"
import { getOtpHtml, generateOtp } from "../utils/otp.utils.js"
import userModel from "../models/user.model.js"
import sessionModel from "../models/session.model.js"
import otpModel from "../models/otp.model.js"
import crypto from "crypto"

export async function register(req, res) {

    try {
        const { username, email, password, confirmPassword, role = "user" } = req.body

        if (!(password === confirmPassword)) {
            return res.status(409).json({
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

        const otp = generateOtp()
        const html = getOtpHtml(otp)
        await sendEmail(email, "OTP Verification", "Verify Your Account", html)


        const otpHash = await bcrypt.hash(otp, 10)
        const otpDoc = await otpModel.create({
            email,
            user: user.id,
            otp: otpHash,
            expiresAt: new Date(Date.now() + 3 * 60 * 1000)
        })

        otpDoc.attempts += 1
        otpDoc.save()

        if (otpDoc.attempts > 3) {
            return res.status(429).json({
                message: "You have attempted maximum times try again later."
            })
        }

        return res.status(201).json({
            message: 'User registered successfully',
            User: user
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
        console.log({ "username": usernameOrEmail });
        console.log({ "email": usernameOrEmail });
        console.log({ "usernameOrEmail": usernameOrEmail });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        const isValidPassword = await bcrypt.compare(password, user.password)

        console.log({ "validPassword": isValidPassword });

        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        const { password: _, ...userWithoutPassword } = user.toObject()

        return res.status(200).json({
            message: 'User logged in successfully',
            User: userWithoutPassword
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
        const { email } = req.body
        const user = await userModel.findOne({ email: email })
        await otpModel.deleteMany({ user: user._id })
        const otp = generateOtp()
        const html = getOtpHtml(otp)
        await sendEmail(email, "OTP Verification", "Verify Your Account", html)


        const otpHash = await bcrypt.hash(otp, 10)
        const otpDoc = await otpModel.create({
            email,
            user: user.id,
            otp: otpHash,
            expiresAt: new Date(Date.now() + 3 * 60 * 1000)
        })

        otpDoc.attempts += 1
        otpDoc.save()

        if (otpDoc.attempts > 3) {
            return res.status(429).json({
                message: "You have attempted maximum times try again later."
            })
        }

        return res.status(201).json({
            message: "otp sent successfully"
        })
    }
    catch (err) {
        return res.status(500).json({
            error: 'Server Error',
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

        const refreshToken = jwt.sign({ id: user._id, role: user.role }, config.jwtSecret, { expiresIn: "7d" })
        const accessToken = jwt.sign({ id: user._id, role: user.role }, config.jwtSecret, { expiresIn: "15m" })

        const refreshTokenHash = await bcrypt.hash(refreshToken, 10)


        const session = await sessionModel.findOneAndUpdate(
            {
                user: user._id,
                userAgent: req.headers['user-agent'] // Match condition 
            },
            {
                refreshToken: refreshTokenHash,
                ip: req.ip,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days 
            },
            {
                new: true,   // Return the updated document
                upsert: true // Create a new one if it does not exist
            }
        );


        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/api/auth/refresh'
        });



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