var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cacheControl = require('express-cache-controller');
var indexRouter = require('./routes/index');
var router_3 = require('./routes/3');
var router_5 = require('./routes/5');
var router_6 = require('./routes/6');
var router_7 = require('./routes/7');
var router_practice = require('./routes/practice');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cacheControl({noCache: true}));

app.use('/', indexRouter);
app.use('/3', router_3);
app.use('/5', router_5);
app.use('/6', router_6);
app.use('/7', router_7);
app.use('/practice', router_practice);


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
