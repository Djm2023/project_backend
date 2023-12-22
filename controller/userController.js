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
  const user = await User.find();
  const userLink = await userSocialLink.create({
    facebook: req.body.facebook,
    instagram: req.body.instagram,
    twitter: req.body.twitter,
  });

  const userLinkData = await userLink.save();

  user.Links.push(userLinkData);
  return res.send(userLinkData);
};

module.exports.userProfile = async (req,res) => {
  const user = await User.find();
  if(user){
    return res.json({userProfile:user});
  }
}

module.exports.updateLink = async (req, res) => {
  const userLink = await userSocialLink.find();
  const user = await User.find().populate('userLin');

  // if (userLink) {
    // console.log(userLink);
  //   const user = await User.findByIdAndUpdate(
  //     { id: req.params.id },
  //     { $push: { Links: userLink } }
  //   );
  //   if (user) {
  //     return res.json({ message: user });
  //   } else {
  //     return res.json({ message: "user not created" });
  //   }
  // }
};
