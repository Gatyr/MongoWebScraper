var scrape = require("../scripts/scrape.js");

var headlinesController = require("../controllers/headlines.js");
var notesController = require("../controllers/notes.js");

module.exports = function(router) {
	router.get("/", function(req, res) {
		res.render("index");
	});

	router.get("/saved", function(req, res) {
		res.render("saved");
	});

	router.get("/api/fetch", function(req, res) {
		headlinesController.fetch(function(err, docs) {
			if (!docs || docs.insertedCount === 0) {
				return res.json({message: "No new articles"});
			} else {
				res.json({message: "Added " + docs.insertedCount + " new articles."});
			}
		});
	});

	router.get("/api/headlines", function(req, res) {
		var query = {};
		if (req.query.saved) {
			query = req.query;
		}

		headlinesController.get(query, function(data) {
			res.json(data);
		});
	});

	router.delete("/api/headlines/:id", function(req, res) {
		var query = {};
		query._id = req.params.id;
		//console.log(req);

		headlinesController.delete(query, function(err, data) {
			if (err) {console.log(err);}
			else {res.json(data);}
		});
	});

	router.patch("/api/headlines", function(req, res) {
		headlinesController.update(req.body, function(err, data) {
			res.json(data);
		});
	});

	router.get("/api/notes/:headline_id?", function(req, res) {
		var query = {};
		if (req.params.headline_id) {
			query._id = req.params.headline_id;
		}
		//console.log(query);
		notesController.get(query, function(err, data) {
			res.json(data);
		});
	});

	router.delete("/api/notes/:id", function(req, res) {
		var query = {};
		query._id = req.params.id;
		console.log("req.params for server API delete method === " + req.params);
		notesController.delete(query, function(err, data) {
			res.json(data);
		});
	});

	router.post("/api/notes", function(req, res) {
		notesController.save(req.body, function(data) {
			res.json(data);
		});
	});
}

//notes regarding res.json(data) in the callback vs. having 