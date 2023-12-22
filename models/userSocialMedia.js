const mongoose = require("mongoose");
const User = require('./userSchema');
const userSocialLinkSchema = new mongoose.Schema({
  facebook: {
    type: String,
  },
  instagram: {
    type: String,
  },
  twitter: {
    type: String,
  },
  Links:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
  }
});

const UserLink = mongoose.model("UserLink", userSocialLinkSchema);
module.exports = UserLink;
