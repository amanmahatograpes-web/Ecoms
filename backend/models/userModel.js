import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, trim: true, unique: true, sparse: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    mobile: { type: String, required: true },
  },
  { timestamps: true }
);

// ❌ Remove redundant indexes — already handled by "unique: true"
// userSchema.index({ email: 1 });
// userSchema.index({ username: 1 });

export default mongoose.model("User", userSchema);
