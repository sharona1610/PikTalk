var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('../config/ppConfig');
var mongoose = require('mongoose')
var http= require('http')
var isLoggedIn = require('../middleware/isLoggedIn');
var multer = require('multer');
var upload = multer({ dest: './uploads/' });
var Model = require('../models/model')
var MobileDetect = require('mobile-detect')


router.get('/', isLoggedIn, function(req,res){
  // if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
  //   res.render('query/mobile')
  // }
  // else{
  //   res.render('query/index')
  // }
  var md = new MobileDetect(req.headers['user-agent']);
  console.log(md.mobile())
  if(md.mobile()!==null){
    res.render('query/mobile')
  }
  else{
    console.log('here');
    res.render('query/index');
  }
})
router.post('/', isLoggedIn, upload.single('myFile'), function(req, res){
  console.log('req is', req.file)
  console.log('lang is', req.body);
  var arr=[]
  arr.push(req.file.path)
  Model.create({textResult: arr}, function(err, model){
        if(err) console.log(err);
        else {
          // res.send(model)
          console.log('model is ', model);
        }
      })
      console.log('done');

  // cloudinary.uploader.upload(req.file.path, function(result) {
  //   console.log('cloudinary result', result)
  //   var projectId = "final-project-trial"
  //   var gcloud = require('google-cloud')({
  //     projectId: projectId,
  //
  //     // The path to your key file:
  //     keyFilename: './final-project-trial-64f345daee86.json',
  //
  //     // Or the contents of the key file:
  //     credentials: require('./final-project-trial-64f345daee86.json')
  //
  //     // For any APIs that accept an API key:
  //   });
  //   var translate = gcloud.translate;
  //   var vision = gcloud.vision;
  //
  //   var translateClient= translate({
  //     projectId: "final-project-trial",
  //     keyFilename: './final-project-trial-64f345daee86.json'
  //   });
  //
  //   var visionClient = vision({
  //     projectId: "final-project-trial",
  //     keyFilename: './final-project-trial-64f345daee86.json',
  //     languageHints: ['en']
  //   });
  //   var options=
  //   {
  //     "imageContext":{
  //       "languageHints": ['en']
  //     }
  //   }
  //   visionClient.detectText(result.url, options, function(err, text) {
  //     console.log('detected text is ', text);
  //     textResult= text
  //     //   Model.create({textResult: text}, function(err, model){
  //     //     if(err) console.log(err);
  //     //     else console.log(model);
  //     //   })
  //     // })
  //     // var textResult=[]
  //     // Model.findById('58bd059a2827e82f408fca81', function(err, models){
  //     //   if(err) console.log(err);
  //     //   else{
  //     // textResult=models
  //     // console.log(textResult.textResult[0]);
  //     translateClient.translate(textResult[0], 'fr', function(err, translation) {
  //       if (!err) {
  //         // translation = 'Hola'
  //         console.log('translated is ', translation);
  //       }
  //       else {
  //         console.log(err);
  //       }
  //     });
  //   })
  // })
  res.redirect('/query/result')
})

router.get('/result', function(req, res){
  console.log('entered');
  res.render('query/result')
})
module.exports=router
