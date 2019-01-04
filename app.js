var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var passport = require('passport');
var cors = require('cors')


var indexRouter = require('./app/controllers/index');

var adminRouter = require('./app/controllers/admin.Controller')

// test tiếp nào 


var app = express();




app.use(session({
  secret: 'asfasfa3asfa',
  resave: true,
  saveUninitialized: false,
  cookie : {
    maxAge: 1000* 60 * 60 *24 * 365 * 300
},

}))
app.use(passport.initialize());
app.use(passport.session());
// view engine setup
app.set('views', path.join(__dirname, './app/views'));
app.set('view engine', 'ejs');



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));
app.use(cors())
app.use('/admin/edit/uploads', express.static('uploads'));
app.use('/', indexRouter);

app.use('/admin',adminRouter);

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
