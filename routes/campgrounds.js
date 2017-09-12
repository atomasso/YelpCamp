var express = require('express');
var router  = express.Router();
var Campground = require('../models/campground');
var middleware = require('../middleware');


//INDEX - show all campgrounds
router.get("/", (req, res) => { 

  // Get all campgrounds from DB
  Campground.find({}, function(err, allCampgrounds) {
    if (err) {
      console.log(err);
    } else {
      // passing through user's info (if user is not defined, i.e. logged in, it's empty)
      res.render("campgrounds/index", {campgrounds: allCampgrounds});
    }
  });

});

// CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, (req, res) => {  
  // get data from form
  var name = req.body.name;
  var price = req.body.price;
  var image = req.body.image;  
  var desc = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  }
  var newCampground = {name: name, price: price, image: image, description: desc, author: author}
  // Create a new campground and save to DB
  Campground.create(newCampground, function(err, newlyCreated) {
    if (err) {
      console.log(err);
    } else {
      //console.log(newlyCreated);
      // redicect back to campgrounds page      
      res.redirect("/campgrounds");
    }

  });
});


// NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

// this route must not appear before the upper one, since it would take its precedence
// SHOW - shows more info about one campground
router.get("/:id", function(req, res) {
  // find the campground with provided ID 
  // capturing ID
  // populate() - takes comments' references and inserts comments' objects into array
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
    if (err) {
      console.log(err);
      req.flash("error", "Sorry, that campground does not exist!");
      return res.redirect("/campgrounds");
    } else {
      // render show template with that campground
      res.render("campgrounds/show", {campground: foundCampground});
    }
  });
});


// EDIT CAMPGROUND ROUTE
// middlware is called before we get to the route handler
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) { 
  Campground.findById(req.params.id, function(err, campground) {
    res.render("campgrounds/edit", {campground});   
  });
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
  // find and update the correct campground
  // findByIdAndUpdate() is similar as running findById() and Update()  
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground) {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  })

  // redirect somewhere (show page)
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
   Campground.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      // then, redirect to the index
      res.redirect("/campgrounds");
    }
  })
});

module.exports = router;