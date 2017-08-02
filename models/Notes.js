var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var noteschema = new Schema({
	_headlineId: {
		type: Schema.Types.ObjectId,
		ref: "Headline"
	},
	date: {
		type: Date,
		default: Date.now
	},
	text: String
});

var Note = mongoose.model("Note", noteschema);

module.exports = Note;