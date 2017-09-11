var express = require('express');
// {mergeParams: true} - when we pass this object, params from the campground and comments will be merged together
// i.e., inside the comment routes, we're able to access this :id that we defined
var router  = express.Router({mergeParams: true});
var Campground = require('../models/campground');
var Comment = require('../models/comment');
var middleware = require('../middleware');


// Comments New - show form to create new comment
router.get("/new", middleware.isLoggedIn, function(req, res) {
  // find campground by id
  Campground.findById(req.params.id, function(err, campground) {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", {campground});
    }
  });
});

// Comments Create - add new comment to a campground to DB
// isLogin argument prevents from adding the comment if not logged in
router.post("/", middleware.isLoggedIn, function(req, res) {
  // lookup campground using ID
  Campground.findById(req.params.id, function(err, campground) {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      // create new comment
      Comment.create(req.body.comment, function(err, comment) {
        if (err) {
          req.flash("error", "Something went wrong");
          console.log(err);
        } else {                    
          // get current user's username and his id          
          // console.log("New comment's username will be: " + req.user.username);
          
          // add username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          // save comment
          comment.save();
          // push new comment to campground
          campground.comments.push(comment);
          campground.save();
          req.flash("success", "Successfully added comment");
          // redirect campground show page
          res.redirect("/campgrounds/" + campground._id);
        }
      });
    }    
  });
});

// Comments Edit
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
  // 
  Comment.findById(req.params.comment_id, function(err, comment) {
    if (err) {
      res.redirect("back");
    } else { 
      res.render("comments/edit", {campground_id: req.params.id, comment});
    }
  });
});

//Comments Update
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
  // 3 args: 1 - which id to update, 2 - data to update width, 3 - callback to run afterword
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, comment) {
    if (err) {
      res.redirect("back");
    } else {
      res.redirect("/campgrounds/" + req.params.id);  
    }
  });  
  
});

// Comments Delete
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
  Comment.findByIdAndRemove(req.params.comment_id, function(err) {
    if (err) {
      res.redirect("back");
    } else {
      req.flash("success", "Comment deleted");
      res.redirect("/campgrounds/" + req.params.id);
    }
  });    
});

module.exports = router;

//Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto dolore beatae nesciunt officiis corrupti sequi deleniti numquam nisi placeat, suscipit eaque modi exercitationem cumque accusantium eum reiciendis dicta? Voluptatum, a.

//http://www.nationalparks.nsw.gov.au/~/media/DF58734103EF43669F1005AF8B668209.ashx