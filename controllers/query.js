var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('../config/ppConfig');
var mongoose = require('mongoose')
var http= require('http')
var isLoggedIn = require('../middleware/isLoggedIn');
var multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '.jpg') //Appending .jpg
  }
})
var upload = multer({ storage: storage });
var Model = require('../models/model')
var MobileDetect = require('mobile-detect')
var Language = require('../models/language')
var cloudinary = require('cloudinary');



module.exports=router
