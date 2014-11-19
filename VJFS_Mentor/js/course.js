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
            for(key in courses['courses']) {
                var course = '<li class="list-group-item clearfix">';
                course += '<a href="content/course.html?course_id=' + courses['courses'][key].courseID + '">' + courses['courses'][key].courseTitle + '</a>';
                course += '<button type="button" class="btn btn-default pull-right" id="deleteCourse" onclick="deleteCourse(' + courses['courses'][key].courseID + ');">Delete</button>';
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

function getCourse(course_id, handler) {

    getCourses(function(courses) {
        // Retrieve course based on course_id
        var course = $.grep(courses['courses'], function(e){ return e.courseID == course_id; });

        // Result is an array, but should only be one element so using [0]
        if(course[0] == null) {
            handler(null);;
            return;
        }

        // Get course from courses and call handler function on it
        handler(course[0]);
    });
}