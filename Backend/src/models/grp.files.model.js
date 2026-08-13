import mongoose from "mongoose"

const grpFileSchema = new mongoose.Schema({
    files: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true, index: true }, // match your actual model name exactly
            url: { type: String, required: true },
            publicId: { type: String, required: true },
            name: { type: String, required: true },
            fileSize: { type: Number },
            folder: { type: String }
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

const grpFilesModel = mongoose.model("Group Files", grpFileSchema)

export default grpFilesModel