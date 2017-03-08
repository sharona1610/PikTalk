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

require('dotenv').config({ silent: true })

var cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: 'sharona',
  api_key: '167699946475855',
  api_secret: 'XY0Lh7dcv4-SriKu8Rauh52Q1eE'
});




app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({limit: '50mb'}))
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
  res.render('auth/login');
});

app.use('/query', require('./controllers/query'));
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
