const mongoose = require("mongoose");

const connect = async () => {
  try {
    mongoose.set("strictQuery", true);
    const conn = await mongoose.connect(process.env.ATLAS_URI);

    console.log("Database Connected".blue.bold);
    return conn;
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connect;
