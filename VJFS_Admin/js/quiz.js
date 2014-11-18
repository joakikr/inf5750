/**
 * Created by GladeJoa on 16.11.14.
 */

/**
 * Function will display quiz's for a given course.
 */
function displayQuizes(course) {

    // Display Quiz header and add new quiz button
    $('#course').append(' <label class="list-group-item active">Quiz</label>');
    $('#course').append('<ul class="list-group-item list-group" id="courseQuiz"></ul>');
    $('#course').append('<a href="quiz.html?course_id=' + course.courseID + '" class="list-group-item btn btn-default">New Quiz</a>');


    getQuizes(function(quizes) {

        if(quizes != null) {
            var course_quizes = $.grep(quizes['quizes'], function(e){ return e.courseID == course['courseID']; });

            // Display quiz's if course has any
            for(key in course_quizes) {
                var quiz = '<li class="list-group-item clearfix">';
                quiz += '<a href="quiz.html?quiz_id=' + course_quizes[key].quizID + '&course_id=' + course['courseID'] + '">' + course_quizes[key].quizTitle + '</a>';
                quiz += '<button type="button" class="btn btn-default pull-right" id="deleteQuiz" onclick="deleteQuiz(' + course['courseID'] + ', ' + course_quizes[key].quizID + ');">Delete</button>';
                quiz += '</li>';
                $('#courseQuiz').append(quiz);
            }
        }
    });
}

function getQuizes(handler) {
    // Get URL from where to fetch quiz's json
    var url = getHostRoot() + '/api/systemSettings/quizes';

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

function setQuizes(quizes, handler) {
    // Get URL from where to fetch courses json
    var url = getHostRoot() + '/api/systemSettings/quizes';

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

function getQuiz(quiz_id, handler) {
    getQuizes(function(quizes) {
        // Retrieve quiz based on quiz_id
        var quiz = $.grep(quizes['quizes'], function(e){ return e.quizID == quiz_id; });

        // Result is an array, but should only be one element so using [0]
        if(quiz[0] == null) {
            handler(null);;
            return;
        }

        // Get quiz from quizes and call handler function on it
        handler(quiz[0]);
    });
}

function saveQuiz(course_id, quiz_id) {
    // Create URL to POST new quiz to
    var url = getHostRoot() + '/api/systemSettings/quizes';

    // Retrieve quiz title and quiz level from form
    var quizTitle =  $('#quizTitle').val();
    var quizLevel = $('#quizLevel').val();

    // Quiz title cannot be empty: tell user and return
    if(quizTitle.isEmpty()) {
        $('#quizTitle').addClass('invalid');
        $('#quizTitle').val("");
        $('#quizTitle').attr('placeholder', 'This field must be filled out.');
        return false;
    }

    getQuizes(function(quizes) {

        // Check if this is the first quiz
        if(quizes == null) {
            quizes = '{ "quizID" : ' + getUniqueID() + ', "courseID" : ' + course_id + ', "quizTitle" : "' + quizTitle + '", "quizLevel" : "' + quizLevel + '", "quizQuestion" : []}';
            quizes = '{ "quizes" : [' + quizes + '] }';
            quizes = JSON.parse(quizes);
        } else {

            if(quiz_id != null) {
                // Here we must update given quiz_id
                var quiz = $.grep(quizes['quizes'], function(e){ return e.quizID == quiz_id; });
                quiz[0].quizTitle = quizTitle;
                quiz[0].quizLevel = quizLevel;
            } else {
                // Here we have a new quiz
                quizes['quizes'].push( {"quizID" : getUniqueID(), "courseID" : course_id, "quizTitle" : quizTitle, "quizLevel" : quizLevel, "quizQuestion" : [] } );
            }
        }

        // Update quizes on server and go to menu over quizes
        setQuizes(JSON.stringify(quizes), function() {
            window.location.href = getAppRoot() + '/content/course.html?course_id=' + course_id;
        });
    });
}

function deleteQuiz(course_id, quiz_id) {
    if(quiz_id == null) return;

    // Create URL to POST new courses to
    var url = getHostRoot() + '/api/systemSettings/quizes';

    getQuizes(function(quizes) {

        // Check if there exists courses
        if(quizes != null) {

            // Check that course_id is valid
            var quiz = $.grep(quizes['quizes'], function(e){ return e.quizID == quiz_id; });
            if(quiz[0] == null) return;

            // Retrieve index into courses array for course
            var quiz_index = quizes['quizes'].indexOf(quiz[0]);

            // Delete course from courses
            quizes['quizes'].splice(quiz_index, 1);

            // Update courses on server and go to menu over courses
            setQuizes(JSON.stringify(quizes), function() {
                window.location.href = getAppRoot() + '/content/course.html?course_id=' + course_id;
            });
        }
    });
}