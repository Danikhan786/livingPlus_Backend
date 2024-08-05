require('dotenv').config();
const path = require('path');
const express = require('express');
// const dotenv = require('dotenv').config();
const connectDB = require('./config/dbConnection');
const socketio = require("socket.io");
const port = process.env.PORT || 3000;

connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files from the 'uploads' directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/user", require("./routes/userRoutes")); // User routes
app.use("/exercise", require("./routes/exerciseRoutes")); // User routes
app.use("/mainworkout", require("./routes/mainWorkOutsRoutes")); // User routes
app.use("/notification", require("./routes/notificationRoutes")); // User routes
app.use("/workout", require("./routes/workoutsRoutes")); // Pin routes


const server = app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
// const io = socketio(server)
// global.io = io;
// io.on('connection', (socket) => {
//     console.log('New connection')
// })
// // Socket events for pin create, pick, and delete
// io.on("connection", (socket) => {
//   console.log("New client connected");

//   socket.on("pinCreated", () => {
//     console.log("Pin created");
//     // Emit event to all connected clients
//     io.emit("pinCreated");
//   });

//   socket.on("pinPicked", () => {
//     console.log("Pin picked");
//     // Emit event to all connected clients
//     io.emit("pinPicked");
//   });

//   socket.on("pinDeleted", () => {
//     console.log("Pin deleted");
//     // Emit event to all connected clients
//     io.emit("pinDeleted");
//   });

//   socket.on("disconnect", () => {
//     console.log("Client disconnected");
//   });
// });

