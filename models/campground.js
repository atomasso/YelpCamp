var mongoose = require('mongoose');

var campgroundSchema = new mongoose.Schema({
	name: String,
	price: String,
	image: String,
	description: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
    username: String
	},
	// array of comment IDs, we're not embedding the actual comments inhere, just and ID or a reference to the comments
	comments: [
			{
				type: mongoose.Schema.Types.ObjectId,
				// name of the model
				ref: "Comment"
			}
	]
});

module.exports = mongoose.model("Campground", campgroundSchema);