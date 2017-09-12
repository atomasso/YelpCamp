var express               = require('express'),
    app                   = express(),
    mongoose              = require('mongoose'),
    flash                 = require('connect-flash'),
    passport              = require('passport'),
    bodyParser            = require('body-parser'),
    User                  = require('./models/user'),
    LocalStrategy         = require('passport-local'),
    methodOverride        = require('method-override'), // this line is needed in order to use post route as a put route
    passportLocalMongoose = require('passport-local-mongoose'),
    Campground            = require('./models/campground'),
    Comment               = require('./models/comment'),
    User                  = require('./models/user'),
    seedDB                = require('./seeds');
    
// requiring routes
var commentRoutes    = require('./routes/comments'),
    campgroundRoutes = require('./routes/campgrounds'),
    indexRoutes      = require('./routes/index');

var port = process.env.PORT || 8080;

// CONNECT to mongoose
// replace the deprecated mongoose.Promise library
// this will need installing in a terminal with "npm install bluebird --save"
var bluebird = require('bluebird');
mongoose.Promise = bluebird; // mongoose recommends bluebird as a promise library for MongoDB
 
//mongodb://localhost/yelp_camp_v12

// connect to the database
mongoose.connect(`mongodb://ante:susica@ds133054.mlab.com:33054/yelp_camp`, {
    promiseLibrary: require('bluebird'), // mongoose docs recommend this go here too
    useMongoClient: true // add useMongoClient:true to fix the "open() =>v4.11.0" deprecation warning
})
// I added this to catch errors, it's not required but it helps
.then(function () { // show successful connection
    console.log('MongoDB has been connected!');
})
.catch(function (error) { // show error if database is not available
    console.error('Error while trying to connect with MongoDB!');
    console.error(error);
});


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
// we tell it what to look for - "_method"
app.use(methodOverride("_method")); // this line is needed in order to use post route as a put route
//seedDB(); // seed the database
app.use(flash());

// PASSPORT CONFIGURATION

// require and run express-session
app.use(require("express-session")({
    // secret is used to encode/decode sessions
    secret: "Rusty is the best",
  resave: false,
  saveUninitialized: false
}));
// these 2 lines tell express to use passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
// encode the data and put it back to the session - use method that already comes with User (passport local mongoose)
passport.serializeUser(User.serializeUser());
// take data from the session and decode it
passport.deserializeUser(User.deserializeUser());

// making our own middlware - whatever function we provide to it will be called on every route -->
// passing currentUser through
app.use(function(req,res,next){
    // pass req.user to every single template - if we do this, we don't have to pass currentUser to every single route
    // req.user will be empty if no one signed in, or it will contain username and pswd
    // whatever we put inside res.locals is what's available in our template
    res.locals.currentUser = req.user;
    // we need to move on to the actual next code, because this is the middlware that
    // will run for every single route, if we don't have next(), it will just stop, nothing will happen next
    // we need to have next() in order to move on to that next middlware which will actually be
    // route handler in most cases

    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})

//tells our app to use those 3 route files that we required
// we put "/" to be inline with campgroundRoutes, but it would be the same if we omited it
app.use("/", indexRoutes);
// it takes campgroundRoutes (all the routes we defined in a file) and appends "/campgrounds" in front of them 
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(port, function() {
	console.log("Server started...");
});