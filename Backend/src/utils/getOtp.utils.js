import { generateOtp, getOtpHtml } from "./otp.utils.js"
import { sendEmail } from "../services/email.service.js"
import bcrypt from "bcrypt"
import otpModel from "../models/otp.model.js"
import userModel from "../models/user.model.js"

async function getTheOtp(req,res,email) {
        const otp = generateOtp()
        const html = getOtpHtml(otp)
        await sendEmail(email, "OTP Verification", "Verify Your Account", html)

        const user = await userModel.findOne({ email: email })

        const otpHash = await bcrypt.hash(otp, 10)
        const otpDoc = await otpModel.create({
            email,
            user: user.id,
            otp: otpHash,
            expiresAt: new Date(Date.now() + 3 * 60 * 1000)
        })
        otpDoc.save()
}

export default getTheOtp