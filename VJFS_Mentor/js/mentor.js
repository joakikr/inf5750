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
		    "studentName" : "Joakim"
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
/*
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
*/
	handler(json);
}

function displayStudents(course_id) {

    // Get courses as json object
    getCourse(course_id, function(course) {
            var students = course['courseStudents'];
		
            for(key in students) {

                // Display students
                    var student = '<li class="list-group-item clearfix">';
                    student += '<a href="content/students.html?student_id=' + students[key].studentID + '">'+ students[key].studentName + '</a>';
                    student += '</li>';
                    $('#students').append(student);
           }
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



// ------   For now, not used below here -------

/**
 * Function will set courses with the string provided
 * and call the handler function upon return from the AJAX call.
 */
function setStudents(student, handler) {
    // Get URL from where to fetch courses json
    var url = getHostRoot() + '/api/systemSettings/courses';

    // Update courses on server
    $.ajax({
            type: "POST",
                url: url,
                data: students,
                contentType: 'text/plain'
                }).success(function(data) {
                        handler(data);
                    }).error(function() {
                            handler(null);
                        });
}

function getStudent(student_username, handler) {

    getStudent(function(student) {
            // Retrieve course based on course_id
            var course = $.grep(student['student'], function(e){ return e.username == student_username; });

            // Result is an array, but should only be one element so using [0]
            if(student[0] == null) {
                handler(null);;
                return;
            }

            // Get course from courses and call handler function on it
            handler(course[0]);
        });
}

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
