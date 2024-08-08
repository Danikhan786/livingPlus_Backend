const asyncHandler = require("express-async-handler");
const Scheduler = require("../models/Scheduler");
// const cron = require('node-cron');
// const { sendNotification } = require('../utils/fcm');

// Get all Schedulers
const getAllSchedulers = asyncHandler(async (req, res) => {
    try {
        const schedulers = await Scheduler.find();
        res.status(200).json(schedulers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new Scheduler
const createScheduler = asyncHandler(async (req, res) => {
    const { userId, time, day, notificationType } = req.body;

      // Adjust the day field based on its value
      if (day === "everyday") {
        day = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    } else if (day === "mon-fri") {
        day = ["monday", "tuesday", "wednesday", "thursday", "friday"];
    } else if (day === "weekend") {
        day = ["saturday", "sunday"];
    } else {
        day = [day]; // If it's a single day, make it an array for consistency
    }
    try {
        const newScheduler = new Scheduler({
            userId,
            time,
            day,
            notificationType,
        });

        const createdScheduler = await newScheduler.save();

        // Schedule a cron job based on the created scheduler
        // const cronExpression = getCronExpression(time, day);
        // cron.schedule(cronExpression, async () => {
        //     await sendNotification(userId, notificationType);
        // });

        res.status(201).json(createdScheduler);
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
    let { userId, time, day, notificationType } = req.body;

    // Adjust the day field based on its value
    if (day === "everyday") {
        day = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    } else if (day === "mon-fri") {
        day = ["monday", "tuesday", "wednesday", "thursday", "friday"];
    } else if (day === "weekend") {
        day = ["saturday", "sunday"];
    } else if (typeof day === "string") {
        day = [day]; // Ensure it's an array if a single day is passed
    }

    try {
        const updatedScheduler = await Scheduler.findByIdAndUpdate(
            id,
            { userId, time, day, notificationType }, // Update with adjusted day array
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

// Function to create cron expression based on time and day
// const getCronExpression = (time, day) => {
//     const [hour, minute] = time.split(':');
//     let dayOfWeek;

//     switch (day.toLowerCase()) {
//         case 'sunday':
//             dayOfWeek = '0';
//             break;
//         case 'monday':
//             dayOfWeek = '1';
//             break;
//         case 'tuesday':
//             dayOfWeek = '2';
//             break;
//         case 'wednesday':
//             dayOfWeek = '3';
//             break;
//         case 'thursday':
//             dayOfWeek = '4';
//             break;
//         case 'friday':
//             dayOfWeek = '5';
//             break;
//         case 'saturday':
//             dayOfWeek = '6';
//             break;
//         case 'everyday':
//             dayOfWeek = '*';
//             break;
//         default:
//             dayOfWeek = '*';
//     }

//     return `${minute} ${hour} * * ${dayOfWeek}`;
// };

// Check for expired schedules and remove them
// const checkExpiredSchedules = async () => {
//     try {
//         const now = new Date();
//         const expiredSchedules = await Scheduler.find({ time: { $lt: now } });

//         for (const schedule of expiredSchedules) {
//             await Scheduler.findByIdAndDelete(schedule._id);
//         }
//     } catch (error) {
//         console.error("Error checking expired schedules:", error.message);
//     }
// };

// Schedule the cron job to run every 30 seconds
// cron.schedule('*/30 * * * * *', async () => {
//     console.log('Running a task every 30 seconds');
//     await checkExpiredSchedules();
// });


// Schedule the cron job to check for expired schedules every day at midnight
// cron.schedule('0 0 * * *', checkExpiredSchedules);

module.exports = { getAllSchedulers, createScheduler, getSchedulerById, updateScheduler, deleteScheduler };

// checkExpiredSchedules