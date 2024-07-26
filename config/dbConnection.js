const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb+srv://shayanhaider873:coolhaider@cluster0.qoabbsb.mongodb.net/')

    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

module.exports = connectDB