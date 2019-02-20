var createError = require('http-errors');
var express = require('express');
var cors = require("cors");
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var electionRouter = require('./routes/election');
var voteRouter = require('./routes/vote');

var app = express();




app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use('/api/vote', voteRouter);
app.use('/api/election', electionRouter);
app.use('/api/users', usersRouter);

console.log(path.join(__dirname+'/static/index.html'));
console.log(process.env.ADMIN_KEY);

app.use(express.static(__dirname +'/static')); //serves the other static files
app.get('*', (req,res) =>{
  res.sendFile(path.join(__dirname+'/static/index.html'));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.send('error');
});

module.exports = app;
