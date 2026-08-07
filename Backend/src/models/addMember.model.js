import mongoose from 'mongoose'

const invitationSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Groups",
        required: true,
    },
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours
    },
}, { timestamps: true })

invitationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export default mongoose.model("Invitation", invitationSchema)
