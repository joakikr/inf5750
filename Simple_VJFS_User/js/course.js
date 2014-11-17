

function displayCourses() {
	
	// Get URL to retrieve json object from
	var url = getHostRoot() + '/api/systemSettings/courses';


	// Get courses as json object
	getCourses(function(courses) {

		if(courses != null) {
		
			// Display courses
			for(key in courses['courses']) {

				var l = '<div class="list-group" id="list_courses"> '
				$('#courses').append(l);

  				var t = '<h4 class="list-group-item heading"> '+ courses['courses'][key].courseTitle +  '</h4>'

  				$('#list_courses').append(t);

  				var t_info = '<p class="list-group-item-text">'+courses['courses'][key].courseDescription+'</p>'

				$('#list_courses').append(t_info);



  				//replace this with real quizes, append them to list_courses
  				var tmp1 = '<a href="#" class="list-group-item">QUiz</a>'
  			   	var tmp2 = '<a href="#" class="list-group-item">QUiz</a>'
  			    var tmp3 = '<a href="#" class="list-group-item">QUiz</a>'
                var tmp4 = '<a href="#" class="list-group-item">QUiz</a>'

                $('#list_courses').append(tmp1);
				$('#list_courses').append(tmp2);
				$('#list_courses').append(tmp3);
				$('#list_courses').append(tmp3);
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