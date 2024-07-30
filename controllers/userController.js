const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const signUpUser = asyncHandler(async (req, res) => {
  const {
    fName,
    lName,
    email,
    phoneNumber,
    password,
    gender,
    age,
    height,
    weight,
    weightUnit,
    heightUnit
  } = req.body;

   // Basic validation
   if (!fName || !lName || !email || !phoneNumber || !password || !gender || !age || !height || !weight || !weightUnit || !heightUnit) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    // Check if email or phone number already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const existingPhoneNumber = await User.findOne({ phoneNumber });
    if (existingPhoneNumber) {
      return res.status(400).json({ message: "Phone number already exists" });
    }

    // Create new user
    const user = new User({
      fName,
      lName,
      email,
      phoneNumber,
      password,
      gender,
      age,
      height,
      weight,
      weightUnit,
      heightUnit
    });

    await user.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        fName: user.fName,
        lName: user.lName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        gender: user.gender,
        age: user.age,
        height: user.height,
        weight: user.weight,
        weightUnit: user.weightUnit,
        heightUnit: user.heightUnit
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECERT,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fName: user.fName,
        lName: user.lName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        gender: user.gender,
        age: user.age,
        height: user.height,
        weight: user.weight,
        weightUnit: user.weightUnit,
        heightUnit: user.heightUnit
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const editUserProfile = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const updates = req.body;

  try {
    // Update user profile
    const user = await User.findByIdAndUpdate(userId, updates, { new: true });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User profile updated successfully",
      user: {
        fcmToken: user.fcmToken,
        id: user._id,
        fName: user.fName,
        lName: user.lName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        gender: user.gender,
        age: user.age,
        height: user.height,
        weight: user.weight,
        weightUnit: user.weightUnit,
        heightUnit: user.heightUnit,
        totalWorkoutTime: user.totalWorkoutTime,
        totalCaloriesBurn: user.totalCaloriesBurn,
        totalWorkoutDone: user.totalWorkoutDone,
        totalPoints: user.totalPoints,
        activePlan: user.activePlan,
        isEmailVerified: user.isEmailVerified,
        isNumberVerified: user.isNumberVerified,
        planExpiryDate: user.planExpiryDate,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,

      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Get user by ID
const getUserById = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  try {
    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      message: "User retrieved successfully",
      user: {
        fcmToken: user.fcmToken,
        userId: user._id,
        fName: user.fName,
        lName: user.lName,
        email: user.email,
        image: user.image,
        phoneNumber: user.phoneNumber,
        gender: user.gender,
        age: user.age,
        height: user.height,
        weight: user.weight,
        weightUnit: user.weightUnit,
        heightUnit: user.heightUnit,
        totalWorkoutTime: user.totalWorkoutTime,
        totalCaloriesBurn: user.totalCaloriesBurn, 
        totalWorkoutDone: user.totalWorkoutDone,
        totalPoints: user.totalPoints,
        activePlan: user.activePlan,
        isEmailVerified: user.isEmailVerified,
        isNumberVerified: user.isNumberVerified,
        planExpiryDate: user.planExpiryDate,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



const updatePassword = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { currentPassword, newPassword, confirmPassword } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the current password with the hashed password stored in the database
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New password and confirm password do not match" });
    }

    // Update the user's password; the `pre('save')` middleware will hash it
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

let blacklistedTokens = [];
// Logout user
const logoutUser = asyncHandler(async (req, res) => {
  const { token } = req.body;

  try {
    // Add token to blacklist
    blacklistedTokens.push(token);

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Middleware to check if token is blacklisted
const checkBlacklistedToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (blacklistedTokens.includes(token)) {
    return res.status(401).json({ message: "Token is blacklisted" });
  }

  next();
};


module.exports = { signUpUser, loginUser, editUserProfile, updatePassword, getUserById, logoutUser, checkBlacklistedToken};
