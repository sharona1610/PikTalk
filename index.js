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


app.get('/', function(req, res) {
  res.redirect('auth/login');
});
app.get('/query/', isLoggedIn, function(req,res){
  Language.find({}, function(err, lang){
    // var md=req.device.type
    // if(md==='mobile' || md==='tablet'){
      res.render('query/mobile', {language: lang})
    // }
    // else{
    //   console.log('here');
    //   res.render('query/index', {language: lang});
    // }
  })
})
app.post('/query/', upload.single('myFile'), isLoggedIn, function(req, res){
  console.log(req.body);
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
    var options=
    {
      "imageContext":{
        "languageHints": [req.body.lang]
      }
    }
    var temp = './uploads/'+req.file.filename
    console.log(temp);
    visionClient.detectText(temp).then((results) => {
      const detections = results[0]
      console.log(detections);
      if(results!==null){
      translateClient.translate(detections, req.body.langTrans, function(err, translation) {
        if (!err) {
          console.log('translated is ', translation);
          Model.create({
            imageUrl: temp,
            textDetect: detections,
            textTranslate: translation,
            user_id: req.user._id}, function(err, model){
                if(err) {
                  console.log(err);
                  return
                }
                  console.log('model is ', model);
                  res.send(model._id)

              })
        }
        else {
          console.log(err);
        }

      });
    }
    })
})

app.get('/query/result/', function(req, res){
  console.log('entered');
  var str = req.query.id.replace(/["]+/g, '');
  console.log(str);
  Model.findById(str, function(err, model){
    console.log('model in get result is ', model);
      res.render('query/result', {model: model})
  })
})

app.get('/query/index', isLoggedIn, function(req,res){
  Model.find({uer_id: req.user._id}, function(err, model){
    if(err) console.log(err);
    if(model.length>0){
      res.render('query/result', {model: model})
    }
})
})

app.use('/auth', require('./controllers/auth'));

var server = app.listen(process.env.PORT || 3000);

module.exports = server;
