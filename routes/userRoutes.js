const express = require("express");
const userController = require("../controllers/userController");
const upload = require("../middleware/uploadHandler");

const router = express.Router();

// Route for user signup
router.post("/signup", userController.signUpUser);

// Route for user login
router.post("/login", userController.loginUser);
router.post('/logout', userController.logoutUser);

// Route for user get by id
router.get("/profile/:userId", userController.getUserById);
// Route for editing user profile
router.put("/profile/:userId", userController.editUserProfile);

// Route for updating user password
router.put("/password/:userId", userController.updatePassword);

router.post("/:id/profile-image", upload, userController.uploadProfileImage);

// Apply the middleware to protect routes
router.use(userController.checkBlacklistedToken);

module.exports = router;
