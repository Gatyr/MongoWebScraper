$(document).ready(function() {
	var artCon = $(".article-container");
	$(document).on("click", ".btn.save", saveArticle);
	$(document).on("click", ".scrape-new", scrapeArticles);

	readyPage();

	function readyPage() {
		artCon.empty();
		$.get("/api/headlines").then(function(data) {
			if (data && data.length) {
				displayArticles(data);
			} else {renderEmpty();}
		});
	}

	function displayArticles(articles) {
		var artDiv = [];
		for (var i = 0; i < articles.length; i++) {
      		artDiv.push(constructDiv(articles[i]));
   		}
    	artCon.append(artDiv);
	}

	function constructDiv(article) {
		 var panel =
	      $(["<div class='panel panel-default'>",
	        "<div class='panel-heading'>",
	        "<h3>",
	        article.headline,
	        "<a class='btn btn-success save'>",
	        "Save Article",
	        "</a>",
	        "</h3>",
	        "</div>",
	        "<div class='panel-body'>",
	        article.summary,
	        "</div>",
	        "</div>"
	      ].join(""));
	      // We attach the article's id to the jQuery element
	      // We will use this when trying to figure out which article the user wants to save
	    panel.data("_id", article._id);
    // We return the constructed panel jQuery element
    return panel;
	}

	function renderEmpty() {
		var emptyAlert =
      $(["<div class='panel panel-default'>",
        "<div class='panel-body text-center'>",
        "<h4><a class='scrape-new'>Try Scraping New Articles</a></h4>",
        "<h4><a href='/saved'>Go to Saved Articles</a></h4>",
        "</div>",
        "</div>"
      ].join(""));
    // Appending this data to the page
    artCon.append(emptyAlert);
	}

	function saveArticle() {
		var articleToSave = $(this).parents(".panel").data();
		articleToSave.saved = true;
		$.ajax({method: "PATCH", url: "/api/headlines", data: articleToSave})
		.then(function(data){
			console.log("article saved");
			if (data.ok){
				readyPage();
			}
		});
	}

	function scrapeArticles() {
		$.get("./api/fetch").then(function(data) {
			readyPage();
		}); 
	}
});