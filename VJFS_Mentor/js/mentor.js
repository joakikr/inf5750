/**
 * Created by Trøtteman on 18.11.14.
 */

var json = {
    "courses":[
        {
            "courseID":1416234255887,
            "courseTitle":"INF5750",
            "courseDescription":"Open Source Software Development.",
            "courseQuiz":[
            ],
            "courseStudents":[
                {
                    "studentID":"joakikr",
		    "studentName" : "Joakim",
                    "questions":[
                    ]
                },
                {
                    "studentID":"sigurhjs",
		    "studentName" : "Sigurd"
                }
            ]
        },
        {
            "courseID":1416234265000,
            "courseTitle":"UNIK4220",
            "courseDescription":"Introduction to crypto.",
            "courseQuiz":[
            ]
        },
        {
            "courseID":1416309399481,
            "courseTitle":"INF1000",
            "courseDescription":"Basic Java.",
            "courseQuiz":[
            ]
        }
    ]
}



function displayCourses() {

    // Get URL to retrieve json object from
    var url = getHostRoot() + '/api/systemSettings/courses';

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
    var url = getHostRoot() + '/api/systemSettings/courses';

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
                    student += '<a href="students.html?student_id=' + students[key].attendantUsername + '&course_id=' + course_id + '">'+ students[key].attendantName + '</a>';
                    student += '</li>';
                    $('#students').append(student);
           }
        });
}

function displayQuestions(course_id, student_id, quizses) {
    // Get courses as json object
    getQuestions(course_id, student_id, function(userQuestions, courseQuestions) {
            if(!courseQuestions || !courseQuestions.count) {
                for(q in courseQuestions) {
                    for(q2 in userQuestions) {
                        if(userQuestions[q2].questionID == courseQuestions[q].questionID) {
                            break;
                        }
                    }
                    var tmp = '<div class="panel panel-default" id='+courseQuestions[q].questionID+'>';
                    tmp += '<div class="panel-heading">';
                    tmp += '<h3 class="panel-title">'+ courseQuestions[q].questionTitle+'</h3>';
                    tmp += '<h3 class="panel-title">'+ courseQuestions[q].questionQuestion+'</h3>';
                    tmp += '</div>';
                    tmp += '<div class="panel-body">';
                    tmp += '<div class="row">';
                    tmp += '<div class="col-xs-3"></div>';
                    tmp += '<div class="col-xs-6">';
                    tmp += '<form role="form" id="alternatives_"'+courseQuestions[q].questionID+'>';
                    if( courseQuestions[q].questionType == "text"){
                        tmp += '<label for = "courseQuestionAnswer" > Correct Answer </label>';
                        tmp += '<textarea id="courseQuestionAnswer" readonly="readonly">'+courseQuestions[q].questionAnswer+'</textarea>';
                        tmp += '<label for = "userQuestionAnswer" > Attendant Answer </label>';
                        tmp += '<textarea id="userQuestionAnswer" readonly="readonly"></textarea>';//This should show user answer
                    } else {
                        var num_alternatives = courseQuestions[q]['questionAlternatives'].length;
                        for(var i = 0; i < num_alternatives; i++) {
                            //var checked = userQuestions[q2]['questionAlternatives'][i]['alternativeChecked'] ? "checked" : "";
                            var isCorrect = courseQuestions[q]['questionAlternatives'][i]['alternativeChecked'] ? "(Correct)" : "(Wrong)";
                            tmp += '<div class="alternative">';
                            tmp += '<div class="checkbox form-inline" >';
                            //tmp += '<input type="checkbox" id="alternativeYN" disabled '+checked+'>';
                            tmp += '<input type="checkbox" id="alternativeYN" disabled>';
                            tmp += '<p>'+ isCorrect + ' ' + courseQuestions[q]['questionAlternatives'][i]['alternativeValue'] + '  </p> ';
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
                    quizes.push(courseQuestions[q].quizID);
                }
            }
            $('#question_list').append('<button type="button" class="btn btn-default list-group-item" onclick="saveCorrection(course_id, student_id, quizes);">SAVE</button>');
        });
}

function getQuestions(course_id, student_username, handler) {
        // Get URL from where to fetch courses json
    var urlStudent = getHostRoot() + '/api/systemSettings/' + student_username + '.questions';
    var urlCourse = getHostRoot() + '/api/systemSettings/questions';
    var uq = [];
    var cq = [];
    // Get courses as json object and on success use handler function
    var a = $.ajax({
        url: urlCourse,
        dataType: 'json'
    }).success(function(questions) {
        for(key in questions) {
            if(questions[key].courseID == course_id) {
                uq.push(questions[key]);
            }
        }
    }).error(function(error) {
            console.log("Failed in 1");
        handler(null, null);
        return;
    });
    var b = $.ajax({
        url: urlCourse,
        dataType: 'json'
    }).success(function(questions) {
        for(key in questions['questions']) {
            //if(questions[key].courseID == course_id) {
                cq.push(questions['questions'][key]);
                //}
        }
    }).error(function(error) {
            console.log("Failed in 2");
        handler(null, null);
        return;
    });
    $.when(a,b).done(function() {
            console.log(uq);
            console.log(cq);
            handler(uq, cq);
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



function saveCorrection(course_id, student_username, quizes) {
    console.log("I dont work yet but you sent me course " + course_id + " for student " + student_id);
    console.log("Quizes are " + quizes);
}













// ------  Not used below here, saving as reference to make code from -------

function saveCourse(student_username) {
    // Create URL to POST new course to
    var url = getHostRoot() + '/api/systemSettings/students';

    // Retrieve student title and student description from form
    // studentDescription is textarea, and the \n must be escaped before stored in json
    var studentName =  $('#studentName').val(); //form.studentTitle.value;

    // Student title cannot be empty: tell user and return
    if(studentTitle.isEmpty()) {
        $('#studentName').addClass("invalid");
        $('#studentName').val("");
        $('#studentName').attr('placeholder', 'This field must be filled out.');
        return false;
    }

    getStudents(function(students) {
            if(student_username != null) {
                // Here we must update given student_id
                var student = $.grep(students['students'], function(e){ return e.studentUsername == student_username; });
                student[0].studentName = studentName;
            } else {
                //Display some error
            }
  

        // Update courses on server and go to menu over courses
        setStudents(JSON.stringify(students), function() {
                window.location.href = getAppRoot();
            });
        });

}
