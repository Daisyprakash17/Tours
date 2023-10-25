const mongoose = require('mongoose');
require('dotenv').config();
const app = require('./app');
const tourModel = require('./src/models/tourModel.js');

const DB_URL = process.env.MONGODB.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB_URL)
  .then(() => {
    console.log('DB connection established');
  })
  .catch((err) => {
    console.log({ err });
    process.exit(1);
  });

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
