import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { BRANCHES, DEPARTMENTS, ROLES } from "../config/constants.js";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },

    email: {
      type: String,
      require: true,
      unique: true,
    },

    password: {
      type: String,
      require: true,
    },
    role: {
      type: String,
      enum: ROLES,
      default: "student",
      require: true,
    },
    // Department-level exam creation / role-based access control
    department: {
      type: String,
      enum: DEPARTMENTS,
    },
    // Multi-branch scalability across Amigos SACCO branches
    branch: {
      type: String,
      enum: BRANCHES,
    },
    // Identity verification: candidate ID/photo captured at registration for
    // later comparison against the webcam feed during live proctoring
    idPhotoUrl: {
      type: String,
    },
    preferredLanguage: {
      type: String,
      enum: ["en", "am"],
      default: "en",
    },
  },
  {
    timestamps: true,
  }
);
// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  // this contain User Oject
  return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt
userSchema.pre("save", async function (next) {
  // if this user obj is not modified mode next
  // else if user obj is create or modified like during update then hash password
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

export default User;
