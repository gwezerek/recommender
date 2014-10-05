/*jshint -W099 */
/*jslint browser: true, sub: true */

// SETUP VARIABLES
// =============================================
var VIZCONFIG = {
	recWrap: $(".final-answer-wrap"),
	questions: $(".viz-question"),
	finalAnswers: $(".viz-final-answer").find(".viz-takeaway-letter"),
	$forms: $(".viz-form")
}

var pymChild = new pym.Child();


// SETUP
// =============================================

// Set icon bground position dynamically
$(".viz-logo").each(function(i, e) {
	$(this).css("background-position", -i * 105 + "px 0");
});



// HELPERS
// =============================================

// Shows and hides the "TRY AGAIN" feedback popup
function formPopup($form) {
	window.setTimeout(function() {
		$form.find(".viz-popup").addClass("viz-popup-visible");
	}, 500);
	window.setTimeout(function() {
		$form.find(".viz-popup").removeClass("viz-popup-visible");
		$form.find(".viz-submit").attr("class", "viz-submit");
		$form.find(".fa").attr("class", "fa fa-arrow-right");
	}, 1500);
}

// Once a user guesses correctly, we disable the input
function removeHandlerQ(form, input) {
	form.addClass("viz-form-answered");
	input.prop("disabled", true);
}

// If the user has identified both logos, reveal the final answer input
function checkOtherQ(container) {
	if (container.find(".viz-form-answered").length === 2) {
		container.find(".viz-final-form").slideDown(200);
		pymChild.sendHeightToParent();
	}
}

// If the user gets the final answer correct, we fill in
// the final answer placeholder and recommendation answer letter
function letterToRec(container, answer) {

	var takeaway = container.find(".viz-comparison-answer").data("takeaway");
	var questionIndex = parseInt(container.find(".viz-question-number").text());
	var letters = container.find(".viz-letter");
	var strippedAnswer = answer.replace(/\s+/g, '');
	var desiredLetter = answer.slice(takeaway, takeaway+1);

	populateAnswer(letters, strippedAnswer);
	VIZCONFIG.finalAnswers.eq(questionIndex-1).text(desiredLetter);
}

function populateAnswer(letters, answer) {
	for (var i = 0; i < answer.length; i++) {
		letters.eq(i).text(answer.charAt(i));
	}
}

// Function to show all answers


// HANDLERS
// =============================================

// Normal form submission
$(".viz-form").on("submit", function(e) {

	e.preventDefault();

	var $form = $(this);
	var input = $form.find(".viz-input");
	var container = $form.closest(".viz-question");
	var answer = input.data("answer").toUpperCase();
	var areEqual = input.val().toUpperCase() === answer;
	var isFinal = $form.hasClass("viz-final-form");

	$form.find(".viz-submit").attr("class", areEqual ? "viz-submit viz-correct" : "viz-submit viz-incorrect");
	$form.find(".fa").attr("class", areEqual ? "fa fa-check" : "fa fa-times");

	if (!areEqual) {
		formPopup($form);
	} else {
		removeHandlerQ($form, input);
	}

	// Could go in the else above but broken out for readability
	if (!isFinal && areEqual) {
		checkOtherQ(container);
	} else if (isFinal && areEqual) {
		letterToRec(container, answer);
		$form.fadeOut(200);
		pymChild.sendHeightToParent();
	}

});

// If the user clicks the give up button
$(".viz-giveup-button").on("click", function() {

	// Populate comparison answers
	VIZCONFIG.$forms.each(function() {
		var $form = $(this);
		var input = $form.find(".viz-input");

		$form.find(".viz-submit").attr("class", "viz-submit viz-correct");
		$form.find(".fa").attr("class", "fa fa-check");
		input.val(input.data("answer"));
		removeHandlerQ($form, input);
	});

	// Populate clue answers
	VIZCONFIG.questions.each(function() {
		var letters = $(this).find(".viz-letter");
		var answer = $(this).find(".viz-input").eq(2).data("answer").replace(/\s+/g, '');
		populateAnswer(letters, answer);
	});

	// Populate final answer
	populateAnswer(VIZCONFIG.finalAnswers, "OmmWriter");

});


// Just to make sure height is right on load
pymChild.sendHeightToParent();



