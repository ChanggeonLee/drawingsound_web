var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var session = require('express-session');
var flash = require('connect-flash');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var homeRouter = require('./routes/home');
var sheetRouter = require('./routes/sheet');
var faqRouter = require('./routes/faq');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// session을 사용
app.use(session({
  name: 'mjoverflow',
  resave: true,
  saveUninitialized: true,
  secret: 'long-longlonglong123asdasdaszxcasdq1123123sdasdlkjlkjaflkvna;ls123'
}));
// flash
app.use(flash()); // flash message를 사용할 수 있도록

// pug의 local에 현재 사용자 정보와 flash 메시지를 전달하자.
app.use(function(req, res, next) {  
  res.locals.currentUser = req.user; //passport는 req.user로 user정보 전달
  res.locals.flashMessages = req.flash();
  next();
});

// router
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/home', homeRouter);
app.use('/sheet', sheetRouter);
app.use('/faq', faqRouter);

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
