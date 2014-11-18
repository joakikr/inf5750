/**
 * Created by GladeJoa on 16.11.14.
 */

function displayStudents() {

    // Get URL to retrieve json object from
    var url = getHostRoot() + '/api/systemSettings/students';

    // Get courses as json object
    getStudents(function(students) {

            if(students != null) {
                // Display students
                for(key in students['students']) {
                    var course = '<li class="list-group-item clearfix">';
                    students += '<a href="content/mentor.html?course_id=' + students['students'][key].courseID + '">' + students['students'][key].studentName + '</a>';
                    students += '</li>';
                    $('#students').append(students);
                }
            }
        });
}

/**
 * Function will retrieve all courses as a json object
 * and call the handler function with the courses.
 */
function getStudents(handler) {
    // Get URL from where to fetch courses json
    var url = getHostRoot() + '/api/systemSettings/students';

    // Get courses as json object and on success use handler function
    $.ajax({
            url: url,
                dataType: 'json'
                }).success(function(students) {
                        handler(students);
                    }).error(function(error) {
                            handler(null);
                        });
}



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
        }

        // Update courses on server and go to menu over courses
        setStudents(JSON.stringify(students), function() {
                window.location.href = getAppRoot();
            });
        });
}