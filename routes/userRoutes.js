const express = require("express");
const userController = require("../controllers/userController");


const router = express.Router();

// Route for user signup
router.post("/signup", userController.signUpUser);

// Route for user login
router.post("/login", userController.loginUser);

// Route for editing user profile
router.put("/profile/:userId", userController.editUserProfile);

// Route for updating user password
router.put("/password/:userId", userController.updatePassword);

module.exports = router;
