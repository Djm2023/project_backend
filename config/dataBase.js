const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URL);

const db = mongoose.connection;

db.on(
  "error",
  console.error.bind(
    console,
    "Error in connecting with the database :: MongoDB"
  )
);

db.once("open", function () {
  console.log("Successfully connected to the database :::: MongoDB");
});

module.exports = db;
