const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
  },
  phone: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  companyEmail: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirmPassword: {
    type: String,
    required: true,
  },
  Links: [
    {
      type: {
        type: String,
        enum: ["facebook", "twitter", "instagram","linkedin" ,"googleAds"], // Add other social media types as needed
      },
      link: {
        type: String,
      },
    },
  ],
});

const User = mongoose.model("User", userSchema);
module.exports = User;
