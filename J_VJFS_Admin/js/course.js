/**
 * Created by GladeJoa on 16.11.14.
 */

function displayCourses() {

    // Get URL to retrieve json object from
    var url = getHostRoot() + '/api/systemSettings/courses';

    // Get courses as json object
    getCourses(function(courses) {

        if(courses != null) {
            // Display courses
            for(key in courses.courses) {
                var course = '<li class="list-group-item"><a href="content/course.html?course_id=' + key + '">' + courses.courses[key].courseTitle + '</a></li>';
                $('#list_courses').append(course);
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
}

/**
 * Function will set courses with the string provided
 * and call the handler function upon return from the AJAX call.
 */
function setCourses(courses, handler) {
    // Get URL from where to fetch courses json
    var url = getHostRoot() + '/api/systemSettings/courses';

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

/**
 * Function will create a new course from form input and add it to courses
 */
function setCourse(form) {

    // Create URL to POST new course to
    var url = getHostRoot() + '/api/systemSettings/courses';

    console.log("Method: addCourse");

    // Retrieve course title and course description from form
    var courseTitle = form.courseTitle.value;
    var courseDescription = form.courseDescription.value;

    // Course title cannot be empty
    if(courseTitle.isEmpty()) return false;

    getCourses(function(courses) {

        // Retrieve new course values from form
        var course = '{ "courseTitle" : "' + courseTitle + '", "courseDescription" : "' + courseDescription + '"}';

        // Check if this is the first course
        if(courses == null) {
            course = '{ "courses" : [' + course + '] }';

            // Update courses on server and go to menu over courses
            setCourses(course, function() {
                window.location.href = getAppRoot();
            });
        } else {
            // Update with new course
            courses['courses'].push( {"courseTitle" : courseTitle, "courseDescription" : courseDescription} );

            // Update courses on server and go to menu over courses
            setCourses(JSON.stringify(courses), function() {
                window.location.href = getAppRoot();
            });
        }
    });

    return false;
}

function getCourse(handler) {
    // Fetch URL
    var url = window.location;

    // Check if a specific course is chosen
    var course_id = getURLParameter(url, 'course_id');
    if(course_id == null) {
        handler(null);
        return;
    }

    getCourses(function(courses) {
        // Check that index is within boundaries
        if(course_id < 0 || course_id >= courses['courses'].length) {
            handler(null);
            return;
        }

        // Get course from courses and call handler function on it
        var course = courses['courses'][course_id];
        handler(course);
    });
}