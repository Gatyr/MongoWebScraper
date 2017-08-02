var request = require("request");
var cheerio = require("cheerio");

var scrape = function(cb) {
	request("http://www.pbnation.com", function(error, response, html) {
		var result = [];
		var $ = cheerio.load(html);
		$("div.article-box").each(function(i, element) {
					
			var title = $(element).find("a").find("img").attr("alt");
			var summary = $(element).find($(".article-wrap")).find($(".article-body")).find("p").text();
			var link = "http://www.pbnation.com" + $(element).find("a").attr("href");
			var img = $(element).find("a").find("img").attr("src");
				
			if (title && summary && link && img) {
				var titleNeat = title.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
		        var sumNeat = summary.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
				var dataToAdd = {
				headline: titleNeat,
				link: link,
				photo: img,
				summary: sumNeat
				}		
			result.push(dataToAdd);
			}
		});
		cb(result);
	});
}

module.exports = scrape;
