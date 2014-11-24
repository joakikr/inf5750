/**
 * Created by Trøtteman on 18.11.14.
 */

function displayCourses() {

    // Get URL to retrieve json object from
    var url = getHostRoot() + '/api/systemSettings/VJFS_courses';

    // Get courses as json object
    getCourses(function(courses) {
            if(courses != null) {
                // Display courses
                for(key in courses['courses']) {
                    var course = '<li class="list-group-item clearfix">';
                    course += '<a href="content/course.html?course_id=' +
                    courses['courses'][key].courseID + '">' +
                    courses['courses'][key].courseTitle + '</a>';
                    course += '</li>';
                    $('#courses').append(course);
                }
            }
        });
}

function getCourses(handler) {

    // Get URL from where to fetch courses json
    var url = getHostRoot() + '/api/systemSettings/VJFS_courses';

    // Get courses as json object and on success use handler function
    $.ajax({
        url: url,
        dataType: 'json'
    }).success(function(courses) {
        handler(courses);
    }).error(function(error) {
        handler(null);
    });

    //handler(json);
}

function displayStudents(course_id) {

    // Get courses as json object
    getCourse(course_id, function(course) {
            var students = course['courseAttendants'];
            for(key in students) {
                // Display students
                    var student = '<li class="list-group-item clearfix">';
                    student += '<a href="quiz.html?student_id=' + students[key].attendantUsername + '&course_id=' + course_id + '">'+ students[key].attendantName + '</a>';
                    student += '</li>';
                    $('#students').append(student);
           }
        });
}

function displayQuizes(course_id, student_id) {
    // Get courses as json object
    getQuizes(course_id, student_id, function(q) {
            for(key in q) {
                // Display students
                var quiz_id = q[key].quizID;
                var quiz = '<li class="list-group-item clearfix">';
                quiz += '<a href="students.html?student_id=' + student_id + '&quiz_id=' + quiz_id + '">'+ q[key].quizTitle + '</a>';
                quiz += '</li>';
                $('#quizes').append(quiz);
           }
        });
}

function getQuizes(course_id, student_id, handler) {
    // Get URL from where to fetch courses json
    var urlStudent = getHostRoot() + '/api/systemSettings/VJFS_' + student_id + '_questions';
    var urlQuizes = getHostRoot() + '/api/systemSettings/VJFS_quizes';
    var q = [];
    // Get courses as json object and on success use handler function
    $.ajax({
        url: urlQuizes,
        dataType: 'json'
    }).success(function(quizes) {
            $.ajax({
                    url: urlStudent,
                    dataType: 'json'
            }).success(function(userQuizes) {
                   for(key in quizes['quizes']) {
                       if(containsQuiz(quizes['quizes'][key].quizID, userQuizes['questions'])) {
                           q.push(quizes['quizes'][key]);
                       }
                   }
                   handler(q);
            }).error(function(error) {
                    handler(null, null);
                    return;
            });
    }).error(function(error) {
        handler(null, null);
        return;
    });
}


function displayQuestions(quiz_id, student_id, quizses) {
    var allCorrect = 1;
    // Get courses as json object
    getQuestions(quiz_id, student_id, function(userQuestions, quizQuestions) {
            if(!quizQuestions || !quizQuestions.count) {
                for(q in quizQuestions) {
                    var q2 = -1;
                    for(userNum in userQuestions) {
                        if(userQuestions[userNum].questionID == quizQuestions[q].questionID) {
                            q2 = userNum;
                            break;
                        }
                    }
                    var tmp = '<div class="panel panel-default" id='+quizQuestions[q].questionID+'>';
                    tmp += '<div class="panel-heading">';
                    tmp += '<h3 class="panel-title">'+ quizQuestions[q].questionTitle+'</h3>';
                    tmp += '<h3 class="panel-title">'+ quizQuestions[q].questionQuestion+'</h3>';
                    tmp += '</div>';
                    tmp += '<div class="panel-body">';
                    tmp += '<div class="row">';
                    tmp += '<div class="col-xs-3"></div>';
                    tmp += '<div class="col-xs-6">';
                    tmp += '<form role="form" id="alternatives_"'+quizQuestions[q].questionID+'>';
                    if( quizQuestions[q].questionType == "text"){
                        tmp += '<label for = "quizQuestionAnswer" > Correct Answer </label>';
                        tmp += '<textarea id="quizQuestionAnswer" readonly="readonly">'+quizQuestions[q].questionAnswer+'</textarea>';
                        tmp += '<label for = "userQuestionAnswer" > Attendant Answer </label>';
                        tmp += '<textarea id="userQuestionAnswer" readonly="readonly">'+userQuestions[q2].questionAnswer+'</textarea>';
                    } else {
                        var num_alternatives = quizQuestions[q]['questionAlternatives'].length;
                        for(var i = 0; i < num_alternatives; i++) {
                            var checked = userQuestions[q2]['questionAlternatives'][i]['alternativeChecked'] ? "checked=" : "";
                            var isCorrect = quizQuestions[q]['questionAlternatives'][i]['alternativeChecked'] ? "(Correct)" : "(Wrong)";
                            tmp += '<div class="alternative">';
                            tmp += '<div class="checkbox form-inline" >';
                            tmp += '<input type="checkbox" id="alternativeYN" disabled '+checked+'>';
                            tmp += '<p>'+ isCorrect + ' ' + quizQuestions[q]['questionAlternatives'][i]['alternativeValue'] + '  </p> ';
                            tmp += '</div>';
                            tmp += '</div>';

                        }
                    }
                    tmp += '<div class="alternative">';
                    tmp += '<div class="checkbox form-inline" >';
                    tmp += '<div class="pull-left">'
                    tmp += '<input type="radio" name="correct" value="correct"> Approved ';
                    tmp += '</div>'
                    tmp += '<div class="pull-right">'
                    tmp += '<input type="radio" name="correct" value="wrong" > Not approved ';
                    tmp += '</div>'
                    tmp += '</div>';
                    tmp += '</div>';
                    tmp += '</form>';
                    tmp += '</div>';
                    tmp += '</div>';
                    tmp += '</div>';
                    tmp += '</div>';
                    $('#question_list').append(tmp);
                }
            }
            $('#question_list').append('<button type="button" class="btn btn-default list-group-item" onclick="saveCorrection(quiz_id, student_id);">SAVE</button>');
        });
}

function getQuestions(quiz_id, student_username, handler) {
    // Get URL from where to fetch quizs json
    var urlStudent = getHostRoot() + '/api/systemSettings/VJFS_' + student_username + '_questions';
    var urlQuiz = getHostRoot() + '/api/systemSettings/VJFS_questions';
    var uq = [];
    var qq = [];
    // Get quizs as json object and on success use handler function
    var a = $.ajax({
        url: urlStudent,
        dataType: 'json'
    }).success(function(questions) {
        for(key in questions['questions']) {
            if(questions['questions'][key].quizID == quiz_id) {
                uq.push(questions['questions'][key]);
            }
        }
    }).error(function(error) {
        handler(null, null);
        return;
    });
    var b = $.ajax({
        url: urlQuiz,
        dataType: 'json'
    }).success(function(questions) {
        for(key in questions['questions']) {
            if(questions['questions'][key].quizID == quiz_id) {
                qq.push(questions['questions'][key]);
            }
        }
    }).error(function(error) {
        handler(null, null);
        return;
    });
    $.when(a,b).done(function() {
            handler(uq, qq);
        });
}


function getCourse(course_id, handler) {

    getCourses(function(courses) {
        // Retrieve course based on course_id
        var course = $.grep(courses['courses'], function(e){ return e.courseID == course_id; });

        // Result is an array, but should only be one element so using [0]
        if(course[0] == null) {
            handler(null);
            return;
        }
        // Get course from courses and call handler function on it
        handler(course[0]);
    });

}




//Code below is broken

function saveCorrection(quiz_id, student_username) {
    var radios = document.getElementsByName('correct');
    var allCorrect = 1;
    var amountChecked = 0;
    for (var i = 0; i < radios.length; i++) {
        if(radios[i].checked) {
            amountChecked++;
            if(radios[i].value == 'wrong') {
                allCorrect = 0;
            }
        }
    }
    if(amountChecked < radios.length/2) {
        $('#question_list').append('<p id="quizWrong" style="color: red;">Not all answers were corrected</p>')
        return;
    }

    var questionUrl = getHostRoot() + '/api/systemSettings/VJFS_'+student_username+'_questions';

    if(allCorrect == 1) {
        $.ajax({
                url: questionUrl,
                dataType: 'json'
        }).success(function(questions) {
                var result = [];
                for(key in questions['questions']) {
                    if(questions['questions'][key].quizID != quiz_id) {
                        result.push(questions['questions'][key]);
                    }
                }
                var completeUrl = getHostRoot() + '/api/systemSettings/VJFS_'+student_username+'_quizes';
                $.ajax({
                        url: completeUrl,
                        dataType: 'json'
                }).success(function(quizes) {
                        quizes['quizes'].push({"quizID" : quiz_id});
                        postData(JSON.stringify(quizes), completeUrl);
                }).error(function(error) {
                        console.log(error);
                        return;
                });
                postData(JSON.stringify(questions), questionUrl);
        }).error(function(error) {
                //Handle error
                console.log(error);
                return;
        });
    } else {
        $.ajax({
                url: questionUrl,
                dataType: 'json'
        }).success(function(questions) {
                for(key in questions['questions']) {
                    if(questions['questions'][key].quizID == quiz_id) {
                        questions['questions'][key].corrected = 'true';
                    }
                }
                postData(JSON.stringify(questions), questionUrl);
        }).error(function(error) {
                //Handle error
                console.log(error);
                return;
        });
    }
}

function contains(value, array) {
    for(key in array) {
        if(array[key] == value) {
            return true;
        }
    }
    return false;
}

function containsQuiz(value, array) {
    for(key in array) {
        if(array[key].quizID == value) {
            return true;
        }
    }
    return false;
}

function postData(data, url) {
    $.ajax({
            type: 'POST',
            url: url,
            data: data,
    	    contentType: 'text/plain'
            }).success(function(data) {
                window.location.href = getAppRoot();
            }).error(function(error) {
                console.log(error);
            });
}