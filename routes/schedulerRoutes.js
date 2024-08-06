const express = require("express");
const schedulerController = require("../controllers/schedulerController");

const router = express.Router();

router.get("/", schedulerController.getAllSchedulers);
router.post("/", schedulerController.createScheduler);
router.get("/:id", schedulerController.getSchedulerById);
router.put("/:id", schedulerController.updateScheduler);
router.delete("/:id", schedulerController.deleteScheduler);

module.exports = router;
