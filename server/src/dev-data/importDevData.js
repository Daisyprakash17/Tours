const fs = require('fs');
const connectDb = require('../../connectDb');
const tourModel = require('../models/tourModel');

// READ JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf8'));

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await connectDb();
    await tourModel.create(tours);
    console.log('Data loaded successfully');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await connectDb();
    await tourModel.deleteMany();
    console.log('Data deleted successfully');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

//console.log(process.argv);
if (process.argv.includes('--import')) importData();
if (process.argv.includes('--delete')) deleteData();
