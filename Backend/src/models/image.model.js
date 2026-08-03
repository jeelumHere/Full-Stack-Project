import mongoose from "mongoose"

const imageSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users", // match your actual model name exactly
        required: true,
        index: true
    },
    images: [
        {
            url: { type: String, required: true },
            fileId: { type: String, required: true },
            name: { type: String, required: true }
        }
    ],
    folder: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
})

const imageModel = mongoose.model("Images", imageSchema)

export default imageModel
