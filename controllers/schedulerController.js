const asyncHandler = require("express-async-handler");
const Scheduler = require("../models/Scheduler");
const Notification = require("../models/Notification");
const User = require("../models/User");
const { sendNotification } = require('../utils/fcm');
const cron = require('node-cron');

// Create a new Scheduler
const createScheduler = asyncHandler(async (req, res) => {
    const { userId, time, timeFormat, day: initialDay, notificationType } = req.body;
    let day = initialDay;

    try {
        // Adjust the day field based on its value
        if (day === "everyday") {
            day = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
        } else if (day === "mon-fri") {
            day = ["monday", "tuesday", "wednesday", "thursday", "friday"];
        } else if (day === "weekend") {
            day = ["saturday", "sunday"];
        } else if (typeof day === "string") {
            day = [day];
        }

        const newScheduler = new Scheduler({
            userId,
            time,
            timeFormat,
            day,
            notificationType,
        });

        const createdScheduler = await newScheduler.save();

        // Schedule notifications based on selected days and time
        day.forEach(selectedDay => {
            const cronTime = getCronSchedule(selectedDay, time, timeFormat);

            cron.schedule(cronTime, async () => {
                try {
                    const user = await User.findById(userId);
                    if (!user) {
                        console.error(`User not found for ID: ${userId}`);
                        return;
                    }

                    if (user.fcmToken) {
                        sendNotification(user.fcmToken, 'Scheduled Reminder', `Reminder: "${notificationType}" is due now.`);
                    } else {
                        console.error(`FCM token missing for user ID: ${userId}`);
                    }

                    const notification = new Notification({
                        schedulerId: createdScheduler._id,
                        userId: user._id,
                        title: 'Scheduled Reminder',
                        body: `Reminder: "${notificationType}" is due now.`,
                    });

                    await notification.save();
                } catch (err) {
                    console.error('Error sending notification:', err);
                }
            });
        });

        res.status(201).json(createdScheduler);
    } catch (error) {
        console.error("Error creating scheduler:", error.message);
        res.status(500).json({ message: "Server error: " + error.message });
    }
});


// Get all Schedulers
const getAllSchedulers = asyncHandler(async (req, res) => {
    try {
        const schedulers = await Scheduler.find();
        res.status(200).json(schedulers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a Scheduler by ID
const getSchedulerById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        const scheduler = await Scheduler.findById(id);

        if (!scheduler) {
            return res.status(404).json({ message: "Scheduler not found" });
        }

        res.status(200).json(scheduler);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a Scheduler
const updateScheduler = asyncHandler(async (req, res) => {
    const { id } = req.params;
    let { userId, time, day, timeFormat,notificationType } = req.body;

    try {
        if (day === "everyday") {
            day = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
        } else if (day === "mon-fri") {
            day = ["monday", "tuesday", "wednesday", "thursday", "friday"];
        } else if (day === "weekend") {
            day = ["saturday", "sunday"];
        } else if (typeof day === "string") {
            day = [day];
        }

        const updatedScheduler = await Scheduler.findByIdAndUpdate(
            id,
            { userId, time, day, timeFormat,notificationType },
            { new: true }
        );

        if (!updatedScheduler) {
            return res.status(404).json({ message: "Scheduler not found" });
        }

        res.status(200).json(updatedScheduler);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete a Scheduler
const deleteScheduler = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        const deletedScheduler = await Scheduler.findByIdAndDelete(id);

        if (!deletedScheduler) {
            return res.status(404).json({ message: "Scheduler not found" });
        }

        res.status(200).json({ message: "Scheduler deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Helper function to generate cron schedule string
const getCronSchedule = (day, time, timeFormat) => {
    const [hour, minute] = time.split(':').map(Number);

    // Adjust hour based on AM/PM
    let adjustedHour = hour;
    if (timeFormat === 'PM' && hour !== 12) {
        adjustedHour += 12;
    } else if (timeFormat === 'AM' && hour === 12) {
        adjustedHour = 0; // Midnight case
    }

    const dayOfWeek = getCronDayOfWeek(day);
    return `${minute} ${adjustedHour} * * ${dayOfWeek}`;
};

// Helper function to map days to cron day numbers
const getCronDayOfWeek = (day) => {
    const daysMap = {
        'sunday': 0,
        'monday': 1,
        'tuesday': 2,
        'wednesday': 3,
        'thursday': 4,
        'friday': 5,
        'saturday': 6,
    };
    return daysMap[day.toLowerCase()];
};

module.exports = {
    getAllSchedulers,
    createScheduler,
    getSchedulerById,
    updateScheduler,
    deleteScheduler,
};
