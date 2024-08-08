const mongoose = require("mongoose");

const notificationSchema = mongoose.Schema({
  schedulerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Scheduler' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true },
  body: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, {  
  timestamps: true,
});

module.exports = mongoose.model("Notification", notificationSchema);
