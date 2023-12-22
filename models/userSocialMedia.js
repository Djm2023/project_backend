const mongoose = require("mongoose");
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
});

const UserLink = mongoose.model("UserLink", userSocialLinkSchema);
module.exports = UserLink;
