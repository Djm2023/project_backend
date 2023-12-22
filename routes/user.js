const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const passport = require('passport');

router.post('/api/register',userController.create);

router.post('/api/login' , userController.Login);

router.post('/profile' , passport.authenticate('jwt',{session:false}) , userController.profile);
router.get('/profile' ,  passport.authenticate('jwt',{session:false}),userController.userProfile)
router.patch('/profile/:id' , passport.authenticate('jwt',{session:false}),userController.updateLink)

// router.post('/api/logout' ,passport.authenticate('jwt'), userController.Logout);

module.exports = router;