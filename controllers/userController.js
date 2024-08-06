const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const upload = require("../middleware/uploadHandler");
// const { sendNotification } = require("../utils/fcm");
  
const signUpUser = asyncHandler(async (req, res) => {
  const {
    fName,
    lName,
    fcmToken,
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

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  // Validate password
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message: "Password must be 8-15 characters long, include at least one uppercase letter, one number, and one special character"
    });
  }

  // Validate name length
  if (fName.length > 30 || lName.length > 30) {
    return res.status(400).json({ message: "First name and Last name must be less than 30 characters" });
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
      fcmToken,
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
        fcmToken: user.fcmToken,
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
  const { email, password, fcmToken } = req.body;

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

    // Update user's FCM token
    user.fcmToken = fcmToken;
    await user.save();

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fcmToken: user.fcmToken,
        fName: user.fName,
        lName: user.lName,
        email: user.email,
        profile_image: user.profile_image,
        phoneNumber: user.phoneNumber,
        gender: user.gender,
        age: user.age,
        height: user.height,
        weight: user.weight,
        weightUnit: user.weightUnit,
        heightUnit: user.heightUnit,
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
        fcmToken: user.fcmToken,
        email: user.email,
        profile_image: user.profile_image,
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
        id: user._id,
        fName: user.fName,
        lName: user.lName,
        fcmToken: user.fcmToken,
        email: user.email,
        profile_image: user.profile_image,
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

const uploadProfileImage = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    upload(req, res, function (err) {
      if (err && err.message && err.message.storageErrors && Array.isArray(err.message.storageErrors) && err.message.storageErrors.length > 0) {
        return res.status(400).json({ message: err });
      }

      const profileImage = req.file.path;
      console.log("Normalized path:", profileImage);

      user.profile_image = profileImage;
      user.save();

      res.json({ message: "File uploaded successfully", profile_image: profileImage });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Update FCM token
const updateFcmToken = asyncHandler(async (req, res) => {
  try {
    const { userId, fcmToken } = req.body;

    // Validate inputs
    if (!userId || !fcmToken) {
      return res.status(400).json({ message: "User ID and FCM token are required" });
    }

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the FCM token
    user.fcmToken = fcmToken;
    await user.save();

    // Return success message
    res.status(200).json({ message: "FCM token updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = { signUpUser, loginUser, editUserProfile, updatePassword, getUserById, logoutUser, checkBlacklistedToken, uploadProfileImage, updateFcmToken};
