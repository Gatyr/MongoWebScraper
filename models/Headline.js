var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var headlineschema = new Schema({
	headline: {
		type: String,
		required: true,
		unique: true
	},
	summary: {
		type: String,
		required: true
	},
	link: {
		type: String,
		required: true
	},
	photo: {
		type: String,
		required: false
	},
	saved: {
		type: Boolean,
		default: false
	}
});

var Headline = mongoose.model("Headline", headlineschema);

module.exports = Headline; 