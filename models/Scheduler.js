const mongoose = require("mongoose");

const schedulerSchema = mongoose.Schema({
  userId: { type: String, required: true },
  time: { type: String, required: true }, // Changed to String to store time like "09:00 AM"
  day: { type: String, required: true, enum: ["everyday","monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] },
  notificationType: { type: String, required: true },
//   fcmToken: { type: String, required: true } // Add this field

}, {
  timestamps: true,
});

module.exports = mongoose.model("Scheduler", schedulerSchema);
