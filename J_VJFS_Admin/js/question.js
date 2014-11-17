/**
 * Created by GladeJoa on 17.11.14.
 */

/**
 * Function will display quesitons's for a given quiz.
 */
function displayQuestions(quiz) {

    // Display Question header and add new question button
    $('#quiz').append(' <label class="list-group-item active">Question</label>');
    $('#quiz').append('<ul class="list-group-item list-group" id="quizQuestion"></ul>');
    $('#quiz').append('<a href="question_text.html?quiz_id=' + quiz.quizID + '" class="list-group-item btn btn-default">New Text Question</a>');
    $('#quiz').append('<a href="question_multiplechoice.html?quiz_id=' + quiz.quizID + '" class="list-group-item btn btn-default">New Mulitple Choice Question</a>');

    getQuestions(function(questions) {
        if(questions != null) {
            var quiz_questions = $.grep(questions['questions'], function(e){ return e.quizID == quiz['quizID']; });

            // Display question's if quiz has any
            for(key in quiz_questions) {
                var question = '<li class="list-group-item clearfix">';
                question += '<a href="quiz.html?question_id=' + quiz_questions[key].questionID + '&quiz_id=' + quiz['quizID'] + '">' + quiz_questions[key].questionTitle + '</a>';
                question += '<button type="button" class="btn btn-default pull-right" id="deleteQuestion" onclick="deleteQuestion(' + quiz['quizID'] + ', ' + quiz_questions[key].questionID + ');">Delete</button>';
                question += '</li>';
                $('#quizQuestion').append(question);
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

function setQuestions(questions, handler) {
    // Get URL from where to fetch courses json
    var url = getHostRoot() + '/api/systemSettings/questions';

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

function getQuestion(question_id, handler) {
    getQuestions(function(questions) {
        // Retrieve question based on question_id
        var question = $.grep(questions['questions'], function(e){ return e.questionId == question_id; });

        // Result is an array, but should only be one element so using [0]
        if(question[0] == null) {
            handler(null);;
            return;
        }

        // Get question from questions and call handler function on it
        handler(question[0]);
    });
}

function saveQuestion(quiz_id, question_id) {
    // Create URL to POST new quiz to
    var url = getHostRoot() + '/api/systemSettings/questions';

    // Retrieve quiz title and quiz level from form
    var questionTitle =  $('#questionTitle').val();
    var questionQuestion = $('#questionQuestion').val();
    var questionAnswer = $('#questionAnswer').val();
    var questionType = $('#questionType').val();

    var legal = true;

    // Title can't be empty
    if(questionTitle.isEmpty()) {
        $('#questionTitle').addClass("invalid");
        $('#questionTitle').val("");
        $('#questionTitle').attr('placeholder', 'This field must be filled out.');
        legal = false;
    }

    // Question can't be empty
    if(questionQuestion.isEmpty()) {
        $('#questionQuestion').addClass("invalid");
        $('#questionQuestion').val("");
        $('#questionQuestion').attr('placeholder', 'This field must be filled out.');
        legal = false;
    }

    // Answer can't be empty
    if(questionAnswer.isEmpty()) {
        $('#questionAnswer').addClass("invalid");
        $('#questionAnswer').val("");
        $('#questionAnswer').attr('placeholder', 'This field must be filled out.');
        legal = false;
    }

    if(!legal) return false;


    getQuestions(function(questions) {

        // Check what type of question we have
        if(questionType === 'text') {
            // Here we have a new text question

            // Check if this is the first quiz
            if(questions == null) {
                questions = '{ "questionID" : ' + getUniqueID() + ', "quizID" : ' + quiz_id + ', "questionTitle" : "' + questionTitle
                        + '", "questionType" : "' + questionType + '", "questionQuestion" : "' + questionQuestion + '", "questionAnswer" : "' + questionAnswer + '" }';
                questions = '{ "questions" : [' + questions + '] }';
                questions = JSON.parse(questions);
            } else {

                if(question_id != null) {
                    // Here we must update given quiz_id
                    var question = $.grep(questions['questions'], function(e){ return e.questionID == question_id; });
                    question[0].questionTitle = questionTitle;
                    question[0].questionQuestion = questionQuestion;
                    question[0].questionAnswer = questionAnswer;
                } else {
                    // Here we have a new quiz
                    questions['questions'].push( {"questionID" : getUniqueID(), "quizID" : quiz_id, "questionTitle" : questionTitle,
                                                   "questionType" : questionType, "questionQuestion" : questionQuestion, "questionAnswer" : questionAnswer } );
                }
            }


        } else if(questionType === 'multiple') {
            // Here we have a new multiple choice question
        } else {
            // Here we have undefine behaviour
            console.log("saveQuestion: type not defined");
            return false;
        }

        // Update quizes on server and go to menu over quizes
        setQuestions(JSON.stringify(questions), function() {
            getQuiz(quiz_id, function(quiz) {
                window.location.href = getAppRoot() + '/content/quiz.html?course_id=' + quiz['courseID'] + '&quiz_id=' + quiz_id;
            })
        });
    });
}

function deleteQuestion(quiz_id, question_id) {
    if(question_id == null) return;

    // Create URL to POST new courses to
    var url = getHostRoot() + '/api/systemSettings/questions';

    getQuestions(function(questions) {

        // Check if there exists questions
        if(questions != null) {

            // Check that question_id is valid
            var question = $.grep(questions['questions'], function(e){ return e.questionID == question_id; });
            if(question[0] == null) return;

            // Retrieve index into question array for question
            var question_index = questions['questions'].indexOf(question[0]);

            // Delete question from questions
            questions['questions'].splice(question_index, 1);

            // Update questions on server and go to quiz that contained question
            setQuestions(JSON.stringify(questions), function() {
                getQuiz(quiz_id, function(quiz) {
                    window.location.href = getAppRoot() + '/content/quiz.html?course_id=' + quiz['courseID'] + '&quiz_id=' + quiz_id;
                })
            });
        }
    });
}