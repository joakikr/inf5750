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
                                var id = courses['courses'][key].courseID;
                                var course = '<li id='+id+' class="list-group-item clearfix">';
                                course += '<a href="content/course.html?course_id=' +
                                id + '">' +
                                courses['courses'][key].courseTitle + '</a>';
                                course += '</li>';
                                $('#courses').append(course);
                                coursePending(courses['courses'][key]['courseAttendants'], id);
                            }
                        }
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
                dataType: 'json',
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
                dataType: 'json',
            }).success(function(q) {
                if(q != null) {
                    if(containsCourse(course_id, q['questions'])) {
                        $('#'+student_username).append('<div><span class="label label-warning">Pending</span></div>');
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
                // Display students
                var name = students[key].attendantUsername;
                var student = '<li id='+name+' class="list-group-item clearfix">';
                student += '<a href="quiz.html?student_id=' + name + '&course_id=' + course_id + '">'+ students[key].attendantName + '</a>';
                student += '</li>';
                $('#students').append(student);
                studentPending(name, course_id);
            }
        });
}

function quizPending(quiz_id, student_username) {
        var userUrl = getHostRoot() + '/api/systemSettings/VJFS_' + student_username + '_questions';
        $.ajax({
                url: userUrl,
                dataType: 'json',
            }).success(function(q) {
                if(q != null) {
                    for(var key in q['questions']){
                        if(q['questions'][key].quizID == quiz_id && q['questions'][key].corrected == "false") {
                            $('#'+quiz_id).append('<div><span class="label label-warning">Pending</span></div>');
                            break;
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
                var quiz = '<li id='+quiz_id+' class="list-group-item clearfix">';
                quiz += '<a href="students.html?student_id=' + student_id + '&quiz_id=' + quiz_id + '">'+ q[key].quizTitle + '</a>';
                quiz += '</li>';
                $('#quizes').append(quiz);
                quizPending(quiz_id, student_id);
           }
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
                       if(containsQuiz(ID, userQuizes['questions'])) {
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


function displayQuestions(quiz_id, student_id, quizses) {
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
            $('#question_list').append('<button type="button" class="btn btn-success btn-block" onclick="saveCorrection(quiz_id, student_id);">SAVE</button>');
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
                        if(quizes == null) {
                            quizes = {"quizes" : []}
                        }
                        quizes['quizes'].push({"quizID" : quiz_id});
                        postData(JSON.stringify(quizes), completeUrl);
                }).error(function(error) {
                        console.log(error);
                        return;
                });
                postData(JSON.stringify(result), questionUrl);
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

function containsQuiz(value, array) {
    for(var key in array) {
        if(array[key].quizID == value) {
            return true;
        }
    }
    return false;
}

function containsCourse(value, array) {
    for(var key in array) {
        if(array[key].courseID == value) {
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


function mobileCheck() {
  var check = false;
  //Script from http://detectmobilebrowsers.com/ - Unlicensed open source
  (function(a,b){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
}