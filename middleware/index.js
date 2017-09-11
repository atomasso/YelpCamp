var Campground = require('../models/campground');
var Comment = require('../models/comment');

// all the middleware goes here
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
	 // is user logged in
  if (req.isAuthenticated()) {    
    Campground.findById(req.params.id, function(err, campground) {
      if (err || !campground) {
        console.log(err);
        req.flash("error", "Campground not found");
        res.redirect("/campgrounds");
      } else {        
        // does the user own the campground?
        // we use equals() as campground.author.id is an object, and req.user._id is a string
        if (campground.author.id.equals(req.user._id)) {
          next();
        } else {   
          req.flash("error", "You don't have permission to do that");
          res.redirect("/campgrounds" + req.params.id);      
        }
      }
    });
  } else {
    req.flash("error", "You need to be logged in to do that");
    // redirect to previous page
    res.redirect("back");
  }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
	 // is user logged in
  if (req.isAuthenticated()) {    
    Comment.findById(req.params.comment_id, function(err, comment) {
      if (err || !comment) {
        console.log(err);
        req.flash("error", "Comment not found");
        res.redirect("/campgrounds");
      } else {        
        // does the user own the comment?
        // we use equals() as campground.author.id is an object, and req.user._id is a string
        if (comment.author.id.equals(req.user._id)) {
          next();
        } else {   
          req.flash("error", "You don't have permission to do that");
          res.redirect("/campgrounds" + req.params.id);     
        }
      }
    });
  } else {
    req.flash("error", "You need to be logged in to do that")
    // redirect to previous page
    res.redirect("back");
  }
}

middlewareObj.isLoggedIn = function(req, res, next) {
	  if (req.isAuthenticated()) {
    return next();
  } 
  // flash content shows on the next page - login in this case, but you need to put it before redirect
  // this line won't display anything, it will just give us access to the message after redirect to next page
  // - we can pass error or sucess message
  req.flash("error", "You need to be logged in to do that!")
  res.redirect("/login");
}

module.exports = middlewareObj;