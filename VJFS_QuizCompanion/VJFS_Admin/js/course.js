/**
 * Created by GladeJoa on 16.11.14.
 */

function getCourseResourceURL() {
    var url = getHostRoot() + '/api/systemSettings/VJFS_courses';
    return url;
}

function displayCourses() {

    // Get courses as json object
    getCourses(function(courses) {

        if(courses != null) {
            // Display courses
            for(key in courses['courses']) {
                var course = '<li class="list-group-item clearfix">';
                course += '<a href="content/course.html?course_id=' + courses['courses'][key].courseID + '">' + courses['courses'][key].courseTitle + '</a>';
                course += '<button type="button" class="btn btn-danger pull-right" id="deleteCourse" onclick="deleteCourse(' + courses['courses'][key].courseID + ');">Delete</button>';
                course += '</li>';
                $('#courses').append(course);
            }
        }
    });
}

/**
 * Function will retrieve all courses as a json object
 * and call the handler function with the courses.
 */
function getCourses(handler) {
    // Get URL from where to fetch courses json
    var url = getCourseResourceURL();

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

/**
 * Function will set courses with the string provided
 * and call the handler function upon return from the AJAX call.
 */
function setCourses(courses, handler) {
    // Get URL from where to fetch courses json
    var url = getCourseResourceURL();

    // Update courses on server
    $.ajax({
        type: "POST",
        url: url,
        data: courses,
        contentType: 'text/plain'
    }).success(function(data) {
        handler(data);
    }).error(function() {
        handler(null);
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

function saveCourse(course_id) {
    // Create URL to POST new course to
    var url = getCourseResourceURL();

    // Retrieve course title and course description from form
    var courseTitle =  $('#courseTitle').val(); //form.courseTitle.value;

    // Course title cannot be empty: tell user and return
    if(courseTitle.isEmpty()) {
        $('#courseTitle').addClass("invalid");
        $('#courseTitle').val("");
        $('#courseTitle').prop('placeholder', 'This field must be filled out.');
        return false;
    }

    getCourses(function(courses) {
        // Check if this is the first course
        if(courses == null) {
            courses = { "courses" : [] };
        }

        if(course_id != null) {
            // Here we must update given course_id
            var course = $.grep(courses['courses'], function(e){ return e.courseID == course_id; });
            course[0].courseTitle = courseTitle;
        } else {
            // Here we have a new course
            courses['courses'].push( {"courseID" : getUniqueID(), "courseTitle" : courseTitle, "courseAttendants" : [], "courseMentors" : [] } );
        }

        // Update courses on server and go to menu over courses
        setCourses(JSON.stringify(courses), function() {
            window.location.href = getAppRoot();
        });
    });
}

function deleteCourse(course_id) {
    if(course_id == null) return;

    // Create URL to POST new courses to
    var url = getCourseResourceURL();

    getCourses(function(courses) {

        // Check if there exists courses
        if(courses != null) {

            // Check that course_id is valid
            var course = $.grep(courses['courses'], function(e){ return e.courseID == course_id; });
            if(course[0] == null) return;

            // Check that course doesn't contain quiz's
            getQuizes(function(quizes) {
                var delete_course = true;

                if(quizes != null) {
                    for(key in quizes['quizes']) {
                        if(quizes['quizes'][key].courseID == course_id) {
                            delete_course = false;
                            break;
                        }
                    }
                }

                if(delete_course) {
                    // Retrieve index into courses array for course
                    var course_index = courses['courses'].indexOf(course[0]);

                    // Delete course from courses
                    courses['courses'].splice(course_index, 1);

                    // Update courses on server and go to menu over courses
                     setCourses(JSON.stringify(courses), function() {
                        window.location.href = getAppRoot();
                     });
                } else {
                    alert("Can't delete: " + course[0].courseTitle + " cause it contains quizes.");
                }
            });
        }
    });
}