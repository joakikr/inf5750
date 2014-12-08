/**
 * Created by Trøtteman on 18.11.14.
 */
function displayCourses() {

    // Get URL to retrieve json object from
    var url = getHostRoot() + '/api/systemSettings/VJFS_courses';

    getMyUserName(function(user){
        username = user.userCredentials.username;
        // Get courses as json object
        getCourses(function(courses) {
            if(courses != null) {
                // Display courses
                for(var key in courses['courses']) {
                    if(containsMentor(username, courses['courses'][key]['courseMentors'])) {
                        if($("#courses:contains('"+courses['courses'][key].courseTitle+"')").length == 0) {
                            var id = courses['courses'][key].courseID;
                            var course = '<li id='+id+' class="list-group-item clearfix">';
                            course += '<a href="content/course.html?course_id=' +
                            id + '">' +
                            courses['courses'][key].courseTitle + '</a>';
                            course += '</li>';
                            $('#courses').append(course);
                        }
                        coursePending(courses['courses'][key]['courseAttendants'], courses['courses'][key].courseID);
                    }
                }
                $("#courses li").each(function( title ) {
                    var checker = 0;
                    for(var key2 in courses['courses']) {
                        if(($(this).text().indexOf(courses['courses'][key2].courseTitle)) < 0 || !containsMentor(username, courses['courses'][key2]['courseMentors'])) {
                            checker++;
                        }
                    }
                    if(checker == courses['courses'].length) {
                        //Should remove div here
                        $('#' + $(this).prop('id')).remove();
                    }
                });
            }
        });
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
}

function coursePending(attendants, course_id) {
    for(var key in attendants) {
        var attendee = attendants[key].attendantUsername;
        var userUrl = getHostRoot() + '/api/systemSettings/VJFS_' + attendee + '_questions';
        $.ajax({
            url: userUrl,
            dataType: 'json'
        }).success(function(q) {
            if(q != null) {
                if(containsCourse(course_id, q['questions'])) {
                    if($('#'+course_id).find('.pending').length == 0) {
                        $('#'+course_id).append('<div class="pending"><span class="label label-warning">Pending</span></div>');
                    }
                }
            }
        }).error(function(error) {
        });
    }
}

function studentPending(student_username, course_id) {
    var userUrl = getHostRoot() + '/api/systemSettings/VJFS_' + student_username + '_questions';
    $.ajax({
        url: userUrl,
        dataType: 'json'
    }).success(function(q) {
        if(q != null) {
            if(containsCourse(course_id, q['questions'])) {
                if($('#'+student_username).find('.pending').length == 0) {
                    $('#'+student_username).append('<div class="pending"><span class="label label-warning">Pending</span></div>');
                }
            }
        }
    }).error(function(error) {
    });
}

function displayStudents(course_id) {

    // Get courses as json object
    getCourse(course_id, function(course) {
        var students = course['courseAttendants'];
        for(key in students) {
            if($("#students:contains('"+students[key].attendantName+"')").length == 0) {
                // Display students
                var name = students[key].attendantUsername;
                var student = '<li id='+name+' class="list-group-item clearfix">';
                student += '<a href="quiz.html?student_id=' + name + '&course_id=' + course_id + '">'+ students[key].attendantName + '</a>';
                student += '</li>';
                $('#students').append(student);
            }
            studentPending(name, course_id);
        }
        $("#students li").each(function( title ) {
            var checker = 0;
            for(var key2 in students) {
                if(($(this).text().indexOf(students[key2].attendantName)) < 0) {
                    checker++;
                }
            }
            if(checker == students.length) {
                //Should remove div here
                console.log("Hello");
                $('#' + $(this).prop('id')).remove();
            }
        });
    });
}

function quizPending(quiz_id, student_username) {
    var userUrl = getHostRoot() + '/api/systemSettings/VJFS_' + student_username + '_questions';
    $.ajax({
        url: userUrl,
        dataType: 'json'
    }).success(function(q) {
        if(q != null) {
            for(var key in q['questions']){
                if(q['questions'][key].quizID == quiz_id && q['questions'][key].corrected == "false") {
                    if($('#'+quiz_id).find('.pending').length == 0) {
                        $('#'+quiz_id).append('<div class="pending"><span class="label label-warning">Pending</span></div>');
                        break;
                    }
                }
            }
        }
    }).error(function(error) {
    });
}

function displayQuizes(course_id, student_id) {
    // Get courses as json object
    getQuizes(course_id, student_id, function(q) {
        for(key in q) {
            // Display quizes
            var quiz_id = q[key].quizID;
            if($("#quizes:contains('"+q[key].quizTitle+"')").length == 0) {
                var quiz = '<li id='+quiz_id+' class="list-group-item clearfix">';
                quiz += '<a href="students.html?student_id=' + student_id + '&quiz_id=' + quiz_id + '&quiz_id=' + course_id +'">'+ q[key].quizTitle + '</a>';
                quiz += '</li>';
                $('#quizes').append(quiz);
            }
            quizPending(quiz_id, student_id);
        }
        $("#quizes li").each(function( title ) {
            var checker = 0;
            for(var key2 in q) {
                if(($(this).text().indexOf(q[key2].quizTitle)) < 0) {
                    checker++;
                }
            }
            if(checker == q.length) {
                //Should remove div here
                $('#' + $(this).prop('id')).remove();
            }
        });
    });
}

function getQuizes(course_id, student_id, handler) {
    // Get URL from where to fetch json
    var urlStudent = getHostRoot() + '/api/systemSettings/VJFS_' + student_id + '_questions';
    var urlQuizes = getHostRoot() + '/api/systemSettings/VJFS_quizes';
    var q = [];
    // Get quizes as json object and on success use handler function
    $.ajax({
        url: urlQuizes,
        dataType: 'json'
    }).success(function(quizes) {
        $.ajax({
            url: urlStudent,
            dataType: 'json'
        }).success(function(userQuizes) {
            for(key in quizes['quizes']) {
                var ID = quizes['quizes'][key].quizID;
                if(containsQuiz(ID, course_id, userQuizes['questions'])) {
                    q.push(quizes['quizes'][key]);
                }
            }
            handler(q);
        }).error(function(error) {
            handler(null);
            return;
        });
    }).error(function(error) {
        handler(null);
        return;
    });
}


function displayQuestions(quiz_id, student_id, course_id, quizses) {
    var allCorrect = 1;
    // Get Questions as json object
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
                if( quizQuestions[q].questionType == "text"){
                    tmp += '<div class="col-xs-0"></div>';
                    tmp += '<div class="col-xs-0">';
                    tmp += '<form role="form" id="alternatives_"'+quizQuestions[q].questionID+'>';
                    tmp += '<label for = "quizQuestionAnswer" > Correct Answer </label>';
                    tmp += '<textarea id="quizQuestionAnswer" style="width:100%; resize:vertical;" rows="6" readonly="readonly">'+quizQuestions[q].questionAnswer+'</textarea>';
                    tmp += '<label for = "userQuestionAnswer" > Attendant Answer </label>';
                    tmp += '<textarea id="userQuestionAnswer" style="width:100%; resize:vertical;" rows="6" readonly="readonly">'+userQuestions[q2].questionAnswer+'</textarea>';
                    tmp += '<div class="col-xs-2"></div>';
                    tmp += '<div class="col-xs-8">';
                    tmp += '<div class="alternative">';
                    tmp += '<div class="checkbox form-inline" >';
                    tmp += '<div class="pull-left">';
                    tmp += '<input type="radio" name="correct" value="correct"> Approved ';
                    tmp += '</div>';
                    tmp += '<div class="pull-right">';
                    tmp += '<input type="radio" name="correct" value="wrong" > Not approved ';
                    tmp += '</div>';
                    tmp += '</div>';
                    tmp += '</div>';
                    tmp += '</div>';
                } else {
                    tmp += '<div class="col-xs-2"></div>';
                    tmp += '<div class="col-xs-8">';
                    tmp += '<form role="form" id="alternatives_"'+quizQuestions[q].questionID+'>';
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
                    tmp += '<div class="alternative">';
                    tmp += '<div class="checkbox form-inline" >';
                    tmp += '<div class="pull-left">';
                    tmp += '<input type="radio" name="correct" value="correct"> Approved ';
                    tmp += '</div>';
                    tmp += '<div class="pull-right">';
                    tmp += '<input type="radio" name="correct" value="wrong" > Not approved ';
                    tmp += '</div>';
                    tmp += '</div>';
                    tmp += '</div>';
                }
                tmp += '</form>';
                tmp += '</div>';
                tmp += '</div>';
                tmp += '</div>';
                tmp += '</div>';
                $('#question_list').append(tmp);
            }
        }
        $('#question_list').append('<button type="button" class="btn btn-success btn-block" onclick="saveCorrection(quiz_id, student_id, course_id);">SAVE</button>');
    });
}

function getQuestions(quiz_id, student_username, handler) {
    // Get URL from where to fetch json
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


function saveCorrection(quiz_id, student_username, course_id) {
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
                quizes['quizes'].push({"quizID" : quiz_id, "courseID" : course_id});
                postData(JSON.stringify(quizes), completeUrl);
            }).error(function(error) {
                quizes = {"quizes" : []}
                quizes['quizes'].push({"quizID" : quiz_id, "courseID" : course_id});
                postData(JSON.stringify(quizes), completeUrl);
                return;
            });
            var postString = '{"questions":' + JSON.stringify(result) + '}';
            postData(postString, questionUrl);
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

function containsMentor(value, array) {
    for(key in array) {
        if(array[key].mentorUsername == value) {
            return true;
        }
    }
    return false;
}

function containsQuiz(value, course, array) {
    for(var key in array) {
        if(array[key].quizID == value && array[key].courseID == course) {
            return true;
        }
    }
    return false;
}


function containsCourse(value, array) {
    for(var key in array) {
        if(array[key].courseID == value && array[key].corrected == "false") {
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

function getMyUserName(handler) {
    var url = getHostRoot() + '/api/me';
    // Get the users information
    $.ajax({
        url: url,
        dataType: 'json'
    }).success(function(questions) {
        handler(questions);
    }).error(function(error) {
        handler(null)
    });
}