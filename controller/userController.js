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
    user:req.params.id
  });

  const userLinkData = await userLink.save();
  userInfo.Links.push(userLinkData._id);
  return res.json({ message: userLinkData });
};

module.exports.getLink = async (req,res) => {
  const gettLink = await User.find().populate("Links");
  return res.json({message:gettLink});
}

module.exports.profileInfo = async(req,res) => {
  const userLinks = await UserLink.find().populate('user').exec();
  if(userLinks){
    return res.json({message:userLinks})
  }else{
    return res.json({message:"User profile not found"})
  }
}

module.exports.updateUser = async (req, res) => {
  const userIdToUpdate = req.params.id; 
  const newFacebookLink = req.body.facebook; 
  const newInstagramLink = req.body.instagram;

  const updateUser = await User.findByIdAndUpdate(req.params.id, req.body);

  const updateLinks = await User.updateOne({id:userIdToUpdate},{
    $set: {
      "Links.facebook": newFacebookLink,
      "Links.instagram": newInstagramLink,
    },
  })
  if(updateLinks){
    res.json({message:updateLinks});
  }else{
    res.json({message:"Link not created"});
  }
  if (!updateUser) {
    return res.json({ message: "Not updated" });
  }
  const updatedUser = await User.findById(req.params.id)
  return res.json({ message: updatedUser });
};
