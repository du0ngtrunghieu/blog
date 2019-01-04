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
var notiModel = require('./app/models/notiModel').thongbao
var cateModel = require('./app/models/categorieModel').theloai;
var accModel = require('./app/models/accModel').accouts
var postModel = require('./app/models/postModel').post
// error handler
app.use(async function(err, req, res, next) {
  var iduser
  if (req.session.passport) {
    iduser = req.session.passport.user
    datatacgia = await accModel.findOne({
      _id: iduser
    })
  }
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  let thongbao = await notiModel.countDocuments({
    receiver: iduser,
    check: false
  }).sort({
    ngaytao: -1
  })
  let tinnoibat = await postModel.find().sort({
    soluotxem: -1,
    count_comment: -1
  })
  let dataMenu = await cateModel.find().populate('subTheLoai').then((result) => {
    return result
  })
  let dataAcc = await accModel.findOne({_id : iduser})
  // render the error page
  res.status(err.status || 500);
  res.render("404Page",{
    title: 'Lỗi Không Tìm Thấy Trang',
    accData: dataAcc,
    thongbao: thongbao,
    dataMenu: dataMenu,
    tinnoibat:tinnoibat
  });
});






module.exports = app;
