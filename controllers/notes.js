var makeDate = require("../scripts/date.js");

var Note = require("../models/Notes.js");

module.exports = {
	get: function(data, cb) {
		Note.find({_headlineId: data._id}, cb);
		//console.log(data);
	},
	delete: function(data, cb) {
		Note.remove({_id: data._id}, cb)
		console.log("delete method for notes Data: " + data);
	},
	save: function(data, cb) {
		var newNote = {
			_headlineId: data._id,
			date: makeDate(),
			text: data.text
		};
		Note.create(newNote, function(err, doc) {
			if (err) {console.log(err);}
			else {
				console.log(doc);
				cb(doc);
			}
		});
	}, 
}