const mongoose = require("mongoose");

const schedulerSchema = mongoose.Schema({
  userId: { type: String, required: true }, // The ID of the user who created the schedule
  time: { type: String, required: true }, // The time of the day for the schedule in HH:mm format
  day: { type: [String], required: true }, // An array of days (e.g., ["monday", "wednesday"])
  notificationType: { type: String, required: true }, // The type of notification to be sent

}, {
  timestamps: true, // Automatically adds createdAt and updatedAt timestamps
});

module.exports = mongoose.model("Scheduler", schedulerSchema);
