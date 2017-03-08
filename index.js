var isLoggedIn = require('./middleware/isLoggedIn');
var http= require('http')
var express = require('express')
var mongoose = require('mongoose')
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('connect-flash');
var Model = require('./models/model')
var passport = require('./config/ppConfig');
var multer = require('multer');
var upload = multer({ dest: './uploads/' });
var express = require('express');
var router = express.Router();
var User = require('./models/user');
var passport = require('./config/ppConfig');
var mongoose = require('mongoose')
var http= require('http')
var isLoggedIn = require('./middleware/isLoggedIn');
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
var Model = require('./models/model')
var MobileDetect = require('mobile-detect')
var Language = require('./models/language')
var cloudinary = require('cloudinary');

require('dotenv').config({ silent: true })

var cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: 'sharona',
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});




app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({limit: '50mb'}))
// app.use(express.bodyParser({uploadDir:'/uploads'}));
if (process.env.NODE_ENV === "test") {
  mongoose.connect('mongodb://localhost/test_final')
} else {
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/test_final')
}
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/views'));
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function(req, res, next) {
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next();
});


app.get('/', function(req, res) {
  // var options={
  //   hostname: 'api.voicerss.org',
  //   port: 80,
  //   path: '/?key=f4b8cbcf08304aeeb2dc6ff5f527e4f5&hl=en-us&src=Hello,world!',
  //   method: 'GET'
  // }
  // console.log('options');
  // http.request(options, function(res){
  //   console.log('entered');
  //   res.setEncoding('utf8')
  //   res.on('data', function(){
  //     console.log('data is');
  //     console.log(data);
  //   })
  // })
  res.render('auth/login');
});
app.get('/query/', isLoggedIn, function(req,res){
  // Language.create({langName: 'English', code: 'en'}, function(err, lang){
  //   console.log(lang);
  // })
  // if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
  //   res.render('query/mobile')
  // }
  // else{
  //   res.render('query/index')
  // }
  // var md = new MobileDetect(req.headers['user-agent']);
  // console.log(md.mobile())
  // if(md.mobile()!==null){
    res.render('query/mobile')
  // }
  // else{
  //   console.log('here');
  //   res.render('query/index');
  // }
})
app.post('/query/', upload.single('myFile'), isLoggedIn, function(req, res){
  // console.log('req is', req)
  // console.log('lang is', Object.keys(req));
  // console.log('lang is', req.body);
  // console.log('lang is', req.file);
  // // var file=''
  //
  // cloudinary.uploader.upload(req.file.path, function(result) {
  //   console.log('cloudinary result', result)
    var projectId = "final-project-trial"
    var gcloud = require('google-cloud')({
      projectId: projectId,

      // The path  to your key file:
      keyFilename: './final-project-trial-64f345daee86.json',

      // Or the contents of the key file:
      credentials: require('./final-project-trial-64f345daee86.json')

      // For any APIs that accept an API key:
    });
    var translate = gcloud.translate;
    var vision = gcloud.vision;

    var translateClient= translate({
      projectId: "final-project-trial",
      keyFilename: './final-project-trial-64f345daee86.json'
    });

    var visionClient = vision({
      projectId: "final-project-trial",
      keyFilename: './final-project-trial-64f345daee86.json',
      languageHints: ['ta']
    });
    var options=
    {
      "imageContext":{
        "languageHints": ['ta']
      }
    }
    var temp = './uploads/'+req.file.filename
    console.log(temp);
    // console.log('result url is ', result.url)
    visionClient.detectText(temp).then((results) => {
      const detections = results[0]
      console.log(detections);
      if(results!==null){
      translateClient.translate(detections, 'en', function(err, translation) {
        if (!err) {
          // translation = 'Hola'
          console.log('translated is ', translation);
          Model.create({
            imageUrl: temp,
            textDetect: detections,
            textTranslate: translation,
            user_id: req.user._id}, function(err, model){
                if(err) console.log(err);
                else {
                  // res.send(model)
                  console.log('model is ', model);
                  res.render('query/result', {model: model})
                }
              })
        }
        else {
          console.log(err);
        }

      });
    }
    })
      // console.log('detected text is ', text);
      // textResult= text
      //   Model.create({textResult: text}, function(err, model){
      //     if(err) console.log(err);
      //     else console.log(model);
      //   })
      // })
      // var textResult=[]
      // Model.findById('58bd059a2827e82f408fca81', function(err, models){
      //   if(err) console.log(err);
      //   else{
      // textResult=models
      // console.log(textResult.textResult[0]);


  //     console.log('done');
  //   })
  // })
  // res.redirect('/query/result')
})

app.get('/query/result', function(req, res){
  console.log('entered');
  res.render('query/result')
})
// app.use('/query', require('./controllers/query'));
app.use('/auth', require('./controllers/auth'));

// app.post('/start', upload.single('myFile'), function(req, res) {


// });
// translateClient.getLanguages(function(err, languages) {
//   if (!err) {
//     console.log(languages);
//   }
// });
//
// app.post('/start', function (req, res) {
//   var data = req.body
//   console.log(req);
//
//
//   // cloudinary.uploader.upload(req.params.body.file, function(result) {
//   //   console.log(result)
//   // });
//   // Model.create({textResult: req.body}, function(err, model){
//   //     if(err) console.log(err);
//   //     else console.log(model);
//   //   })
//   })





// cloudinary.uploader.upload("./tamil.jpg", function(result) {
//   console.log(result)
// });
var server = app.listen(process.env.PORT || 3000);

module.exports = server;
