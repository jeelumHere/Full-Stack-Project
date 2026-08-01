import bcrypt from "bcrypt"
import userModel from "../models/user.model.js"
import { sendEmail } from "../services/email.service.js"
import { getOtpHtml, generateOtp } from "../utils/otp.utils.js"
import otpModel from "../models/otp.model.js"


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

export async function getOtp(req,res) {
    try {
        const {email} = req.body
        const user = await userModel.findOne({email:email})
        await otpModel.deleteMany({user:user._id})
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
            message : "otp sent successfully"
        })
    }
    catch(err){
        return res.status(500).json({
            error : 'Server Error',
            message : err.message
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

        return res.status(201).json({
            message: "Email Verified",
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