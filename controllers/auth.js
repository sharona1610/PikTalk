var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('../config/ppConfig');

//SIGNUP

router.get('/signup', function(req, res) {
  res.render('auth/signup');
});

router.post('/signup', function(req, res) {
  console.log('inside POST signup');
  User.create({
    email: req.body.email,
    name: req.body.name,
    password: req.body.password
  }, function(err, createdUser) {
    if(err){
      console.log('ERROR', err);
      req.flash('error', 'Could not create user account');
      res.redirect('auth/signup');
    } else {
      console.log('SUCCESS', createdUser);
      passport.authenticate('local', {
        successRedirect: '/query/',
        successFlash: 'Account created and logged in',
        failureFlash: 'Invalid username and/or password',
        successFlash: 'You have logged in'
      })(req, res);
    }
  });
});

//LOGIN

router.get('/login', function(req, res) {
  res.render('auth/login');
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/query/',
  failureRedirect: 'auth/login',
  failureFlash: 'Invalid username and/or password',
  successFlash: 'You have logged in'
}));

//LOGOUT

router.get('/logout', function(req, res) {
  req.logout();
  req.flash('success', 'You have logged out');
  res.redirect('/');
});

module.exports = router;
