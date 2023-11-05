require('dotenv').config();
const app = require('./app');
const connectDb = require('./connectDb');

const PORT = process.env.PORT || 8000;

const start = async () => {
  try {
    await connectDb();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}...`);
    });
  } catch (error) {
    console.log(error);
    console.log('Failed to connect to the database, server is not running.');
  }
};

start();
