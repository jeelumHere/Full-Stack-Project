import mongoose from "mongoose"

const imageSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users", // match your actual model name exactly
    required: true,
    index: true
  },
  files: [
    {
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
  visibility: {
    type: String,
    required: true,
    trim: true,
    enum: ["Private", "Public"],
    default: "Private"
  }
}, {
  timestamps: true
})

const imageModel = mongoose.model("Files", imageSchema)

export default imageModel
