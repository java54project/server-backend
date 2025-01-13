import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Define User Schema
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters long"],
  },
 
  profilePicture: {
    type: String, // URL to the profile picture in S3
    default: null,
  },
  role: {
    type: String,
    enum: ["admin", "user", "player"],
    default: "user",
  },
 
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.password.startsWith("$2")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare passwords (for login)
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", UserSchema);