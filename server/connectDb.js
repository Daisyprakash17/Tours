const mongoose = require('mongoose');
require('dotenv').config();

const DB_URL = process.env.MONGODB.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

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
