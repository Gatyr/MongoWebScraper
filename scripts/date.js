var makeDate = function() {
	var date = new Date();

	var datePretty = "";

	datePretty += (date.getMonth() + 1) + " ";
	datePretty += date.getDate() + " ";
	datePretty += date.getFullYear();

	return datePretty;
}

module.exports = makeDate;