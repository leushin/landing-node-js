const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cookieSession = require('cookie-session');
const helmet = require('helmet');
const cluster = require('cluster');

require('./database');
require('./engine');
const rest = require('./rest');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views', 'pages'));
app.set('view engine', 'pug');

app.use((req, res, next) => {
  if (cluster.isWorker) {
    console.log('ID: ', cluster.worker.id);
  }
  next();
});

app.use(logger('dev'));
app.use(helmet());
app.use(express.json({ limit: '2048kb' }));
app.use(express.urlencoded({ extended: false, limit: 10000 }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const expiryDate = new Date( Date.now() + 60 * 60 * 1000 ); // 1 hour
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],
  cookie: {
    secure: false,
    httpOnly: true,
    expires: expiryDate
  }
})
);

app.use('/', rest);

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
