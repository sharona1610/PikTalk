var isLoggedIn = require('./middleware/isLoggedIn');
var http= require('http')
var express = require('express')
var mongoose = require('mongoose')
var app = express();
var device = require('express-device');
app.use(device.capture());
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('connect-flash');
var Text = require('./models/text')
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
    cb(null, './views/images/')
  },
  // filename: function (req, file, cb) {
  //   cb(null, Date.now() + '.jpg') //Appending .jpg
  // }
})
var upload = multer({ storage: storage });
var Language = require('./models/language')
var cloudinary = require('cloudinary');

require('dotenv').config({ silent: true })
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
cloudinary.config({
    cloud_name: 'sharona',
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

app.get('/', function(req, res) {
  res.redirect('auth/login');
});
app.get('/query/', isLoggedIn, function(req,res){
  Language.find({}, function(err, lang){
    var md=req.device.type
    if(md==='mobile' || md==='tablet'){
      res.render('query/mobile', {language: lang})
    }
    else{
      console.log('here');
      res.render('query/index', {language: lang});
    }
  })
})

app.post('/query/', upload.single('myFile'), isLoggedIn, function(req, res){
  console.log(req.body);
  console.log(req.file);
    var projectId = "final-project-trial"
    var gcloud = require('google-cloud')({
      projectId: projectId,
      keyFilename: './final-project-trial-64f345daee86.json',
      credentials: require('./final-project-trial-64f345daee86.json')
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
      languageHints: [req.body.lang]
    });
    var temp = './views/images/'+req.file.filename
    console.log(temp);

    cloudinary.uploader.upload(temp, function(result) {
  console.log(result)

    var options=
    {
      "imageContext":{
        "languageHints": [req.body.lang]
      }
    }
    // var temp = './views/images/'+req.file.filename
    // console.log(temp);
    visionClient.detectText(result.url).then((results) => {
      const detections = results[0]
      console.log(detections);
      if(results!==null){
      translateClient.translate(detections, req.body.langTrans, function(err, translation) {
        if (!err) {
          console.log('translated is ', translation);
          Language.find({code: req.body.lang}, function(err, lang){
            if(!err){
              console.log(lang)
              Text.create({
              imageUrl: result.url,
              ttsCode: lang.ttsCode,
              textDetect: detections[0],
              textTranslate: translation[0],
              user_id: req.user._id}, function(err, text){
                  if(err) {
                    console.log(err);
                    return
                  }
                    console.log('text is ', text);
                    res.send(text._id)

                })
              }
          })

        }
        else {
          console.log(err);
        }

      });
    }
    })
})
});

app.get('/query/result/', function(req, res){
  console.log('entered');
  var str = req.query.id.replace(/["]+/g, '');
  console.log(str);
  Text.findById(str, function(err, text){
    console.log('text in get result is ', text);
      res.render('query/result', {text: text})
  })
})

app.get('/query/history', isLoggedIn, function(req,res){
  Text.find({user_id: req.user._id}, function(err, text){
    if(err) console.log(err);
    if(text.length>0){
      res.render('query/history', {text: text})
    }
})
})

app.use('/auth', require('./controllers/auth'));

var server = app.listen(process.env.PORT || 3000);

module.exports = server;
