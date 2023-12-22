const User = require("../models/userSchema");
const userSocialLink = require('../models/userSocialMedia');
const jwt = require('jsonwebtoken');
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
    if(!userDetails || userDetails.password != req.body.password){
      return res.status(422).json({message:"Invalid Credentials"})
    }
    return res.status(200).json({
      message:"Sign-in successfully , here is you token",
      data:{
        token:jwt.sign(userDetails.toJSON(), "secret",{expiresIn:"12h"})
      }
    })
  } catch (error) {
   console.log("Error in JWT ",error); 
   return res.status(500).json({message:"Internal Server Error."})
  }
}

// Logout feature
module.exports.profile = async(req,res) => {
  const socialLink = await userSocialLink.find();
  if(socialLink){
    return res.json({message:"Link already exists"})
  }
  else{
    const createLink = await userSocialLink.create(req.body);
  }
}
