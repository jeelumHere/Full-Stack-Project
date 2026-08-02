import config from "../config/config.js"
import bcrypt from "bcrypt"
import crypto from "crypto"
import sessionModel from "../models/session.model.js"
import { create } from "domain"


async function createSession(req,res,user,refreshToken,refreshTokenHash) {
        let deviceId = req.cookies.deviceId;
        if (!deviceId) {
            deviceId = crypto.randomBytes(16).toString('hex');
            res.cookie('deviceId', deviceId, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 400 * 24 * 60 * 60 * 1000, // long-lived, e.g. ~13 months
                path: '/api/auth' // broader path since it's not refresh-specific
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
            path: '/api/auth/refresh'
        });
}

export default createSession