

function displayCourses() {
	
	// Get URL to retrieve json object from
	var url = getHostRoot() + '/api/systemSettings/courses';


	// Get courses as json object
	getCourses(function(courses) {

		if(courses != null) {
		
			// Display courses
			for(key in courses['courses']) {

				var l = '<div class="list-group" id="list_courses"> ';

				l+= '<a href="#" class="list-group-item disabled">';
    			l+=	'<h4 class="list-group-item-heading">'+ courses['courses'][key].courseTitle +'</h4>';
    			l+=	'<p class="list-group-item-text">'+courses['courses'][key].courseDescription+'</p>';
 				l+= '</a>'



 				//Insert quiz_list into list_courses her

				l+= '<a href="#" class="list-group-item">QUiz</a>'


 				l+='</div>';

				$('#courses').append(l);

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


function getQuizes(handler) {

	// Get URL from where to fetch quiz's json
	var url = getHostRoot() + '/api/systemSettings/quizes';
	
	// Get quiz's as json object and on success use handler function
	$.ajax({
		url: url,
		dataType: 'json'
	}).success(function(quizes) {
		handler(quizes);
	}).error(function(error) {
		handler(null);
	});
}