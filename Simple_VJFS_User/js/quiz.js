
function getUserQuizes(handler) {
    // Get URL from where to fetch quiz's json
    var url = getHostRoot() + '/api/userSettings/quizes';

    // Get quiz's as json object and on success use handler function
    $.ajax({
        url: url,
        dataType: 'json'
    }).success(function(quizes) {
        handler(quizes);
    }).error(function(error) {
        handler(null);
    });
}


function setUserQuizes(quizes, handler) {
	
	// Get URL from where to fetch courses json
	var url = getHostRoot() + '/api/userSettings/quizes';
		
	// Update courses on server
	$.ajax({
		type: 'POST',
		url: url,
		data: quizes,
		contentType: 'text/plain'
	}).success(function(data) {
		handler(data);
	}).error(function() {
		handler(null);
	});
}


function saveUserQuiz(quiz_id) {
    // Create URL to POST new quiz to
    var url = getHostRoot() + '/api/userSettings/quizes';

    getUserQuizes(function(quizes) {

        // Check if this is the first quiz
        if(quizes == null) {
            quizes = '{ "quizID" : ' + quiz_id + ' }';
            quizes = '{ "quizes" : [' + quizes + '] }';
            quizes = JSON.parse(quizes);
        } else {
            quizes['quizes'].push( {"quizID" : quiz_id} );

        }

        // Update quizes on server and go to menu over quizes
        setUserQuizes(JSON.stringify(quizes), function() {
            window.location.href = getAppRoot();
        });
    });
}

function getUserQuestions(handler) {
    // Get URL from where to fetch quiz's json
    var url = getHostRoot() + '/api/userSettings/questions';

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

function setUserQuestions(questions, handler) {
    // Get URL from where to fetch courses json
    var url = getHostRoot() + '/api/userSettings/questions';

    // Update courses on server
    $.ajax({
        type: "POST",
        url: url,
        data: questions,
        contentType: 'text/plain'
    }).success(function(data) {
        handler(data);
    }).error(function() {
        handler(null);
    });
}

function saveUserAnswers(answers){
	console.log("Answer: " + JSON.stringify(answers));

    // Create URL to POST new quiz to
    var url = getHostRoot() + '/api/userSettings/questions';

    getUserQuestions(function(questions) {

        // Check if this is the first quiz
        if(questions == null) {
            questions = { "questions" : answers };
        } else {
            //questions['questions'] = questions['questions'].concat( answers );

          	// Update questions if they've been answered before
          	for(var i = 0; i < answers.length; i++) {
          		var isUpdated = false;

          		for(var j = 0; j < questions['questions'].length; j++) {
          			if(answers[i]['questionID'] == questions['questions'][j]['questionID']) {
          				questions['questions'][j] = answers[i];
          				isUpdated = true;
          				break;
          			} 
          		}

          		if(!isUpdated) {
          			questions['questions'].push( answers[i] );
          		}
          	}

        }

        console.log("Questions: " + JSON.stringify(questions));

        // Update quizes on server and go to menu over quizes
        
        setUserQuestions(JSON.stringify(questions), function() {
 			window.location.href = getAppRoot();
        });
	
    });
}

