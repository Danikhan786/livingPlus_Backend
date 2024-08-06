const asyncHandler = require("express-async-handler");
const Notification = require("../models/Notification");

// Get all notifications
const getAllNotifications = asyncHandler(async (req, res) => {
  try {
    const notifications = await Notification.find();
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new notification
const createNotification = asyncHandler(async (req, res) => {
  const { title, body} = req.body;

  try {
    const newNotification = new Notification({
      title,
      body
    });

    const createdNotification = await newNotification.save();
    res.status(201).json(createdNotification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a notification by ID
const getNotificationById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a notification
const updateNotification = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const updatedNotification = await Notification.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedNotification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json(updatedNotification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a notification
const deleteNotification = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const deletedNotification = await Notification.findByIdAndDelete(id);

    if (!deletedNotification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = { getAllNotifications, createNotification, getNotificationById, updateNotification, deleteNotification };
