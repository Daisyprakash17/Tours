const mongoose = require('mongoose');
require('dotenv').config();

// const DB_URL = process.env.MONGO_URI
const DB_URL="mongodb+srv://daisyprakash0077:xwCAqdtX4zqoGkcq@cluster0.wpuocgb.mongodb.net/natuors-app?retryWrites=true&w=majority"

const connectDb = async () => {
  try {
    await mongoose.connect(DB_URL);
    console.log('DB connection established');
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

module.exports = connectDb;
