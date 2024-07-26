const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
  id: { type: String },
  fcmToken: { type: String },
  fName: { type: String },
  lName: { type: String },
  image: { type: String ,default: null},
  phoneNumber: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender: { type: String },
  age: { type: Number },
  height: { type: Number, get: v => parseFloat(v), set: v => parseFloat(v) },
  weight: { type: Number, get: v => parseFloat(v), set: v => parseFloat(v) },
  weightUnit: { type: String },
  heightUnit: { type: String },
  totalWorkoutTime: { type: Number, default: 0 },
  totalCaloriesBurn: { type: Number, default: 0 },
  totalWorkoutDone: { type: Number, default: 0 },
  totalPoints: { type: Number, default: 0 },
  isEmailVerified: { type: Boolean, default: false },
  isNumberVerified: { type: Boolean, default: false },
  activePlan: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  planExpiryDate: { type: Date },
},
{
  timestamps: true,
});

// Middleware to hash password before saving
userSchema.pre("save", async function(next) {
  const user = this;
  if (user.isModified("password")) {
    try {
      const hashedPassword = await bcrypt.hash(user.password, 8);
      user.password = hashedPassword;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Method to compare entered password with hashed password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
