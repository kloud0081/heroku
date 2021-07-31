var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose=require("mongoose")
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var exphbs = require('express-handlebars')
 var  session=require("express-session")
 var flash=require("connect-flash")
const passport=require("passport")
const stripe = require('stripe')('SECRET_KEY'); // Add your Secret Key Here

var app = express();

app.get("/p",(req,res)=>{
  res.sendFile(__dirname+"/public/k.html")
})

mongoose.connect("mongodb://localhost/od",{useNewUrlParser:true,useCreateIndex:true},(error)=>{
  if (error)
  console.log(error)
  else console.log("connected to db")
})
//import passport to define
require("./config/passport")
// // view engine setup

   //var hbo=exphbs.create({defaultLayout:"main",layoutsDir:path.join(__dirname,"views/layouts"),partialsDir:path.join(__dirname,"views/partials")},{helpers:{addo :function(val){return val+1}}})
//   // app.set('view engine', 'hbs');
//   app.engine("hbs",hbs.engine)
var hbs = require('hbs');

hbs.registerHelper('addindex', function (val) { return val+1; });
hbs.registerHelper('checkqunatity', function (val) { 
  if (val <=1)
   return true;else return false  });

   app.set('view engine', 'hbs');
// app.set('views', path.join(__dirname, 'views'),{helper:{addo :function(val){return val+1}}});
app.set('views', path.join(__dirname, 'views'));

 //app.engine(".hbs",exphbs({defaultLayout:"layout",layoutsDir:path.join(__dirname,"views/layout"),partialsDir:path.join(__dirname,"views/partials")}))
  //  app.set('view engine', 'hbs');
  // app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
 app.use(session({secret:"shopping!",saveUninitialized:false,resave:true}))
 app.use(flash())
 app.use(passport.initialize())
 app.use(passport.session())
 app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
