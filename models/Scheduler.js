const mongoose = require("mongoose");

const schedulerSchema = mongoose.Schema({
  userId: { type: String, required: true },
  time: { type: String, required: true },
  day: { type: [String], required: true }, // Changed to Array of Strings
  notificationType: { type: String, required: true },

}, {
  timestamps: true,
});

module.exports = mongoose.model("Scheduler", schedulerSchema);
