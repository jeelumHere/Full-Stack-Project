import mongoose from "mongoose"

const grpImageSchema = new mongoose.Schema({
    images: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true, index: true }, // match your actual model name exactly
            url: { type: String, required: true },
            fileId: { type: String, required: true },
            name: { type: String, required: true }
        }
    ],
    parentFolder: {
        type: String,
        required: true,
        trim: true
    },
    folder: {
        type: String,
        required: true,
        trim: true
    },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Groups",
        required: true
    }
}, {
    timestamps: true
})

const grpImageModel = mongoose.model("Group Images", grpImageSchema)

export default grpImageModel