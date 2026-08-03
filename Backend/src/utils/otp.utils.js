import { sendEmail } from "../services/email.service.js"
import config from "../config/config.js"
import bcrypt from "bcrypt"
import crypto from "crypto"
import otpModel from "../models/otp.model.js"
import userModel from "../models/user.model.js"
import sessionModel from "../models/session.model.js"


function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function getOtpHtml(otp) {
    return `
  <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 8px;">
    <h2 style="color: #333; text-align: center;">Verify Your Email</h2>
    <p style="color: #555; font-size: 15px; text-align: center;">
      Use the OTP below to complete your verification. This code is valid for <b>3 minutes</b>.
    </p>
    <div style="text-align: center; margin: 24px 0;">
      <span style="display: inline-block; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #2563eb; background: #f0f4ff; padding: 12px 24px; border-radius: 6px;">
        ${otp}
      </span>
    </div>
    <p style="color: #888; font-size: 13px; text-align: center;">
      If you didn't request this code, you can safely ignore this email.
    </p>
    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
    <p style="color: #aaa; font-size: 12px; text-align: center;">
      This is an automated message, please do not reply.
    </p>
  </div>
  `;
}

async function createSession(req,res,user,refreshToken,refreshTokenHash) {
        let deviceId = req.cookies.deviceId;
        if (!deviceId) {
            deviceId = crypto.randomBytes(16).toString('hex');
            res.cookie('deviceId', deviceId, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 400 * 24 * 60 * 60 * 1000, // long-lived, e.g. ~13 months
            });
        }

        const session = await sessionModel.findOneAndUpdate(
            { user: user._id, deviceId },
            {
                refreshToken: refreshTokenHash,
                userAgent: req.headers['user-agent'], // now just metadata, not the key
                ip: req.ip,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            },
            { new: true, upsert: true }
        );

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
}

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
        await otpDoc.save()
}
export { getOtpHtml, generateOtp, createSession, getTheOtp}
