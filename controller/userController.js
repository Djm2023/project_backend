const User = require("../models/userSchema");
const UserLink = require("../models/userSocialMedia");
const userSocialLink = require("../models/userSocialMedia");
const jwt = require("jsonwebtoken");
// Create User Logic

module.exports.create = async (req, res) => {
  if (req.body.password !== req.body.confirmPassword) {
    return res.json({ message: "Check your password" });
  }
  console.log(req.body);

  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    const createUser = await User.create(req.body);

    if (createUser) {
      console.log(createUser);
      return res.json({ message: "User is created" });
    } else {
      return res.json({ message: "User creation failed !!" });
    }
  } else {
    return res.json({ message: "User Already exists" });
  }
};

// Login Logic
module.exports.Login = async (req, res) => {
  const userDetails = await User.findOne({ email: req.body.email });
  try {
    if (!userDetails || userDetails.password != req.body.password) {
      return res.status(422).json({ message: "Invalid Credentials" });
    }
    return res.status(200).json({
      message: "Sign-in successfully , here is you token",
      data: {
        token: jwt.sign(userDetails.toJSON(), "secret", { expiresIn: "12h" }),
      },
    });
  } catch (error) {
    console.log("Error in JWT ", error);
    return res.status(500).json({ message: "Internal Server Error." });
  }
};

module.exports.profile = async (req, res) => {
  const userInfo = await User.findById(req.params.id);
  console.log(userInfo);
  const userLink = await UserLink.create({
    facebook: req.body.facebook,
    instagram: req.body.instagram,
    twitter: req.body.twitter,
    user: req.params.id,
  });

  const userLinkData = await userLink.save();
  userInfo.Links.push(userLinkData._id);
  return res.json({ message: userLinkData });
};

module.exports.getLink = async (req, res) => {
  const gettLink = await User.find().populate("Links");
  return res.json({ message: gettLink });
};

module.exports.profileInfo = async (req, res) => {
  const userLinks = await UserLink.find().populate("user").exec();
  if (userLinks) {
    return res.json({ message: userLinks });
  } else {
    return res.json({ message: "User profile not found" });
  }
};

module.exports.updateUser = async (req, res) => {
  const updateUser = await User.findByIdAndUpdate(req.params.id, req.body);

  const updatedUser = await User.findById(req.params.id);
  return res.json({ message: updatedUser });
};

module.exports.updateLinks = async (req, res) => {
  // const userIdToUpdate = req.params.id;
  // const newFacebookLink = req.body.facebook;
  // const newInstagramLink = req.body.instagram;
  // const updateLinks = await User.findByIdAndUpdate(
  //     req.params.id ,
  //   {
  //     $set: {
  //       "Links.facebook": newFacebookLink,
  //       "Links.instagram": newInstagramLink,
  //     },
  //   },
  //   {new:true}
  // );

  // const userLink = await User.findById(req.params.id);
  // return res.json({ message: userLink });

  // const newFacebookLink = req.body.facebook;
  // const newInstagramLink = req.body.instagram;

  // try {
  //   const user = await User.findById(req.params.id);

  //   if (!user) {
  //     return res.status(404).json({ message: 'User not found' });
  //   }

  //   // Check if Links is an array, if so, convert it to an object
  //   if (Array.isArray(user.Links)) {
  //     user.Links = {};
  //   }

  //   // Update the links
  //   user.Links.facebook = newFacebookLink;
  //   user.Links.instagram = newInstagramLink;

  //   // Save the updated user document
  //   const updatedUser = await user.save();

  //   return res.json({ message: updatedUser });
  // } catch (error) {
  //   console.error(error);
  //   return res.status(500).json({ message: 'Internal Server Error' });
  // }

  // const newFacebookLink = req.body.facebook;

  // try {
  //   const user = await User.findById(req.params.id);

  //   if (!user) {
  //     return res.status(404).json({ message: 'User not found' });
  //   }

  //   // Check if Links is an array, if so, convert it to an object
  //   if (Array.isArray(user.Links)) {
  //     user.Links = {};
  //   }

  //   // Check if there is an existing Facebook link in the Links array
  //   const facebookLinkIndex = user.Links.findIndex(link => link.type === 'facebook');

  //   if (facebookLinkIndex !== -1) {
  //     // If found, update the existing Facebook link
  //     user.Links[facebookLinkIndex].link = newFacebookLink;
  //   } else {
  //     // If not found, push a new object into the Links array
  //     user.Links.push({ type: 'facebook', link: newFacebookLink });
  //   }

  //   // Save the updated user document
  //   const updatedUser = await user.save();

  //   return res.json({ message: updatedUser });
  // } catch (error) {
  //   console.error(error);
  //   return res.status(500).json({ message: 'Internal Server Error' });
  // }

  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update or add links for Facebook, Twitter, and Instagram
    updateOrAddLink(user, "facebook", req.body.facebook);
    updateOrAddLink(user, "twitter", req.body.twitter);
    updateOrAddLink(user, "instagram", req.body.instagram);

    // Save the updated user document
    const updatedUser = await user.save();

    return res.json({ message: updatedUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

function updateOrAddLink(user, type, linkInfo) {
  if (linkInfo && linkInfo.link && linkInfo.type === type) {
    const linkIndex = user.Links.findIndex((link) => link.type === type);

    if (linkIndex !== -1) {
      // If found, update the existing link
      user.Links[linkIndex].link = linkInfo.link;
    } else {
      // If not found, push a new object into the Links array
      user.Links.push({ type, link: linkInfo.link });
    }
  }
}
