import mongoose from "mongoose"

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  user:{
    type : mongoose.Schema.Types.ObjectId,
    ref : "Users",
    required : [true,"User is required"]
  },
  otp: {
    type: String,
    required: true,
  },
  purpose: {
    type: String,
    enum: ['signup', 'login', 'reset-password', 'email-verification'],
    default: 'signup',
  },
  attempts: {
    type: Number,
    default: 0,
  },
  expiresAt : {
    type :Date,
    required: true
  }
}, { timestamps: true });

// Auto-delete expired OTP docs (MongoDB TTL index)
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('Otps', otpSchema);