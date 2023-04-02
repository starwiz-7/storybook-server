const mongoose = require('mongoose');
// const redis = require('redis');
const config = require('../config/index');

const connectDB = async () => {
  try {
    let dbURL = config.databaseURL;
    dbURL = dbURL.replace('<password>', config.dbPassword);

    const connection = await mongoose.connect(dbURL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });

    console.log(`MongoDB connected : ${connection.connection.host}`);
  } catch (err) {
    console.log(`Error : ${err.message}`);

    process.exit(1);
  }
};


module.exports = {connectDB}