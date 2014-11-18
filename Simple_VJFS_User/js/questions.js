
function displayQuizInformation(){

	var url = window.location;

	var quiz_id = getURLParameter(url, 'quiz_id');

	getQuiz(quiz_id, function(quiz) {

		if(quiz != null) {

			var l = '<h2>'+ quiz['quizTitle'] +'</h2>'

			$('#quiz_info').append(l);

			displayQuestions(quiz);
		
		}
	});
}

function displayQuestions(quiz){


	 getQuestions(function(questions) {
		if(questions != null) {

 			var quiz_questions = $.grep(questions['questions'], function(e){ return e.quizID == quiz['quizID']; });


 			for(key in quiz_questions) {
 				

 				var tmp = '<div class="panel panel-default" id='+quiz_questions[key].questionID+'>';
 				tmp += '<div class="panel-heading">';
 				tmp += '<h3 class="panel-title">'+ quiz_questions[key].questionTitle+'</h3>';
 				tmp += '<h3 class="panel-title">'+ quiz_questions[key].questionQuestion+'</h3>';
 				tmp += '</div>';
 				tmp += '<div class="panel-body">';
 				tmp += '<div class="row">'
 				tmp += '<div class="col-xs-3"></div>';
				tmp += '<div class="col-xs-6">';
				tmp += '<form role="form" id="alternatives_"'+quiz_questions[key].questionID+'>';


				if( quiz_questions[key].questionType == "text"){

					tmp += '<textarea id="questionAnswer"></textarea>';

				} else{

					var num_alternatives = quiz_questions[key]['questionAlternatives'].length;

					for(var i = 0; i < num_alternatives; i++) {
						
						tmp += '<div class="alternative">'
						tmp += '<div class="checkbox form-inline" >';
						tmp += '<input type="checkbox" id="alternativeYN">';
						tmp += '<p> ' + quiz_questions[key]['questionAlternatives'][i]['alternativeValue'] + '  </p> '
						tmp += '</div>';
						tmp += '</div>';
						
					}				
				}

				tmp += '</form>'
				tmp += '</div>'
				tmp += '</div>'
				tmp += '</div>'
				tmp += '</div>'

				$('#question_list').append(tmp);

 			}

		}

	});
}


function getQuestions(handler) {

	// Get URL from where to fetch quiz's json
	var url = getHostRoot() + '/api/systemSettings/questions';

	// Get question's as json object and on success use handler function
	$.ajax({
		url: url,
		dataType: 'json'
	}).success(function(questions) {
		handler(questions);
	}).error(function(error) {
		handler(null);
	});
}

function getQuestion(question_id, handler) {

	getQuestions(function(questions) {

		// Retrieve question based on question_id
		var question = $.grep(questions['questions'], function(e){ return e.questionID == question_id; });

		// Result is an array, but should only be one element so using [0]
		if(question[0] == null) {
			handler(null);
			return;
		}
		// Get question from questions and call handler function on it
		handler(question[0]);
	});
}


