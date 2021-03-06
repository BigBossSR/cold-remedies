remedies = {}
templates = {}
sortVal = "score"

var numberSub = function(i) {
	if (i === 3) {
	return "effective"
	}

	if (i === 2) {
		return "possibly effective"
	}

	if (i === 1) {
		return "unlikely to be effective"
	}

	if (i === 0) {
		return "ineffective"
	}
}

var getRemedies = function(callback) {
	$.ajax({
		url: "/remedy",
		method: "GET",
		success: function(data) {

			callback(data)
		}
	})
}

var listRemedies = function(data) {
	var sortedList = []
	_.each(data.remedies, function (remedy) {
		var formattedRemedy = {
			name: remedy.name,
			description: remedy.description,
			reactions: remedy.reactions,
			score: (remedy.prevention)+(remedy.treatment),
			treatment: numberSub(remedy.treatment),
			prevention: numberSub(remedy.prevention),
			preventionScore: remedy.prevention,
			treatmentScore: remedy.treatment,
		}
		sortedList.push(formattedRemedy)
	})

	//sortedList = _.sortBy(sortedList, "score")
	//sortedList.reverse()
	sortedList = listBy(sortedList, sortVal)

	_.each(sortedList, function(item){
		var $htmlString = templates.remedies(item)
		$(".copy-location").append($htmlString)
	})
}


var listBy = function(array, str) {
	array = _.sortBy(array, str)
	return array.reverse()	
}






$(document).on("ready", function(){

//make a call for rememdies
	templates.remedies = Handlebars.compile($("#remediesTemplate").html())
	
	getRemedies(listRemedies)

	$("#prevention").on("click", function(){
		$(".copy-location").html("")
		sortVal = "preventionScore"
		getRemedies(listRemedies)
	})

	$("#treatment").on("click", function(){
		$(".copy-location").html("")
		sortVal = "treatmentScore"
		getRemedies(listRemedies)
	})

	$("#score").on("click", function(){
		$(".copy-location").html("")
		sortVal = "score"
		getRemedies(listRemedies)
	})


})