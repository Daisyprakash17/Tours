
const fs = require('fs');
const connectDb = require('../../connectDb');
const Tour = require('../models/tourModel');

// READ JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf8'));

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await connectDb("mongodb+srv://daisyprakash0077:xwCAqdtX4zqoGkcq@cluster0.wpuocgb.mongodb.net/natuors-app?retryWrites=true&w=majority");
    await Tour.create(tours);
    console.log('Data loaded successfully');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await connectDb("mongodb+srv://daisyprakash0077:xwCAqdtX4zqoGkcq@cluster0.wpuocgb.mongodb.net/natuors-app?retryWrites=true&w=majority");
    await Tour.deleteMany();
    console.log('Data deleted successfully');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

//console.log(process.argv);
if (process.argv.includes('--import')) importData();
if (process.argv.includes('--delete')) deleteData();
