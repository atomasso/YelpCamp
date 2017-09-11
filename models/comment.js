var mongoose = require('mongoose');

var commentSchema = mongoose.Schema({
  text: String,
  author: {
    // reference to a User model id
  	id: {
  		type: mongoose.Schema.Types.ObjectId,
  		// refers to the model that we're going to refer to with this ObjectId
  		ref: "User"

  	},
  	username: String
  }
});

module.exports = mongoose.model("Comment", commentSchema);