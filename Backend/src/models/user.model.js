import mongoose from "mongoose"
import bcrypt from "bcrypt"

const { Schema, model } = mongoose

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: [true, "Username is required"],
            unique: true,
            trim: true,
            minlength: 8,
            maxlength: 20,
            index: true
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            trim: true,
            lowercase: true,
            index: true
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: 8,
            select: false // never returned by default in queries
        },
        isEmailVerified: {
            type: Boolean,
            default: false
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        }
    },
    { timestamps: true }
)

export default model("Users",userSchema)