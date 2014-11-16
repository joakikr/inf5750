/**
 * Created by GladeJoa on 16.11.14.
 */

/**
 * Function will display quiz's for a given course.
 */
function displayQuiz(course) {

    // Display Quiz header and add new quiz button
    $('#course').append(' <label class="list-group-item active">Quiz</label>');
    $('#course').append('<ul class="list-group-item list-group" id="courseQuiz"></ul>');
    $('#course').append(' <a href="quiz.html" class="list-group-item btn btn-default">New Quiz</a>');

    // Display quiz's if course has any
    if(course.hasOwnProperty('quiz')) {
        var quizes = course['quiz'];

        for(key in quizes) {
            var quiz = '<li class="list-group-item clearfix">';
            quiz += '<a href="quiz.html?quiz_id=' + key + '">' + quizes[key].quizTitle + '</a>';
            quiz += '<button type="button" class="btn btn-default pull-right" id="deleteQuiz" onclick="deleteQuiz(' + key + ');">Delete</button>';
            quiz += '</li>';
            $('#list_quizes').append(quiz);
        }
    }
}

function saveQuiz() {

}