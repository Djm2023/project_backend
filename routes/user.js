const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const passport = require('passport');

router.post('/api/register',userController.create);

router.post('/api/login' , userController.Login);

router.post('/profile/:id' , passport.authenticate('jwt',{session:false}) , userController.profile);

router.get('/profile',passport.authenticate('jwt',{session:false}),userController.getLink)
router.post("/profile/info" ,passport.authenticate('jwt',{session:false}),userController.profileInfo)
// for updating user
router.patch('/profile/:id' ,  passport.authenticate('jwt',{session:false}),userController.updateUser)

// router.post('/api/logout' ,passport.authenticate('jwt'), userController.Logout);

module.exports = router;