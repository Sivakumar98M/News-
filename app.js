var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

const MongoStore = require('connect-mongo');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const { log } = require('console');

var app = express();

const maxAge = 30 * 24 * 60 * 60 * 1000;
app.use(session({
  
  secret: 'DNP2016hir1988asa1986',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    maxAge: maxAge
  },
  store: MongoStore.create({ mongoUrl: "mongodb+srv://Dhanesh:Prahi%402016@cluster0.nsbya.mongodb.net/news-db?retryWrites=true&w=majority" }),
}));


app.use(function (req, res, next) {
  if (req.url.startsWith('/javascripts') || req.url.startsWith('/stylesheets') || req.url.startsWith('/images') || req.url.startsWith('/attachment') ) {
    next();
  }
 
  else if (req.url.startsWith('/api')) {
    next();
  }
  else if (req.url.startsWith('/register')) {
    next();
  }
   else if (req.url.startsWith('/newspages')) {
    next();
  }
  else if (req.url.startsWith('/newspage')) {
    next();
  }
  
  else if (req.url.startsWith('/login') ) {
    next();
  }
  else if (req.url.startsWith('/users/register')) {
    next();
  }
  else if (req.url === '/' && !req.session.user) { // For landing page
    next();
  }
  else {
    if (req.session.user!=undefined) {
      if ((req.session.user.role !=="admin" && req.session.user.role !=="user") ) {  //|| !("user" in req.session)
        req.session.redirectTo = req.url;
        res.redirect('/login');
      }
      else {
        res.locals.name = req.session.user.name;
        res.locals.role = req.session.user.role;
        res.locals.email = req.session.user.email;
        res.locals._id = req.session.user._id;
        next();
      }
    }else{
      next();
    }
    // req.session.user = { _id: '615fd6ca91a788db8b0a8c71', firstname: "Dhanesh", middlename: "Kumar", lastname: "Jagadeesan" };
    // next();
  }
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use("/attache",express.static(path.join(__dirname, 'attache')));


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/users', require('./routes/api/users'));
app.use('/api/news', require('./routes/api/news'));
app.use('/api/comment', require('./routes/api/comment'));




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
