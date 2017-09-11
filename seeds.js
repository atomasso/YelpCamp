var mongoose = require('mongoose');
var Campground = require('./models/campground');
var Comment = require('./models/comment');

var data = [
  {
    name: "Cloud's Rest",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7i4Lc5w9hrusgTVqKwqacvG8GoSrS5SexoXl00pVR72zglVV6JA",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quisquam ducimus reiciendis quaerat architecto. Molestias enim sequi, et alias ipsam voluptate! Culpa assumenda inventore consequuntur, sint obcaecati amet recusandae minus nesciunt."  
  },
  {
    name: "Desert",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKqpkI--zP0XU9u0rC5BjgXWMiX6Nq2HmieGKhpkZExGiK49SrBg",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quasi hic quam qui obcaecati earum ut nam voluptate, dolores veritatis reprehenderit vel voluptatibus enim magni animi nostrum tempora non quidem laudantium."  
  },
   {
    name: "Canyon Floor",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRE9TvHkJIQPR0D2cghvhjfZIBWW9QQtww1FFHPHJyDII6R4RTK",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque nihil odio excepturi et, iste quisquam voluptate perferendis commodi consequatur dolorum, vel, natus modi sunt expedita perspiciatis quia molestias aut unde."    
  }
];



function seedDB() {
  	// whiping database - {} --> remove everything
  Campground.remove({}, function(err) {
  	if (err) {	
  		console.log(err);
  	} else {
  	  console.log("removed campgrounds");	
  	    // add a few campgrounds
      data.forEach(function(seed) {
        Campground.create(seed, function(err, campground) {
          if (err) {
          	console.log(err);
          } else {
            console.log("added a campground");
            // create a comment
            Comment.create(
            	{
            		text: "This place is greate but I wish there was internet",
                author: "Homer"
            	}, function(err, comment) {
            		if(err) {
            			console.log(err);
            		} else { 
                  campground.comments.push(comment);
                  campground.save();
                  console.log("Created new comment");
            		}                
            	});
          }
        });	
      });
  	}
  }); 

  // add a few comments
}

module.exports = seedDB;

