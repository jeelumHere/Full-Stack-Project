import mongoose from 'mongoose'

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },
    members: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },
            role: {
                type: String,
                enum: ["admin", "member"],
                default: "member"
            },
            joinedAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    totalMembers: {
        type: Number,
        default: 0,
        required: true
    },
    description: {
        type: String,
        default: ""
    }
}, { timestamps: true }); // adds createdAt, updatedAt automatically

export default mongoose.model("Groups", groupSchema);