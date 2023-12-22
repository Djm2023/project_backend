const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const passport = require('passport');

router.post('/api/register',userController.create);

router.post('/api/login' , userController.Login);

router.get('/profile' , passport.authenticate('jwt') , userController.profile);

// router.post('/api/logout' ,passport.authenticate('jwt'), userController.Logout);

module.exports = router;