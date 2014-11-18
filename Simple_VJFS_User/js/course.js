

function displayCourses() {
	
	// Get URL to retrieve json object from
	var url = getHostRoot() + '/api/systemSettings/courses';


	// Get courses as json object
	getCourses(function(courses) {

		if(courses != null) {
		
			// Display courses
			for(key in courses['courses']) {

				//var l = '<div class="list-group" id="list_courses"> ';

	            var l = '<div class="list-group" id='+courses['courses'][key].courseID+'>';

				l+= '<a href="#" class="list-group-item disabled">';
    			l+=	'<h4 class="list-group-item-heading">'+ courses['courses'][key].courseTitle +'</h4>';
    			l+=	'<p class="list-group-item-text">'+courses['courses'][key].courseDescription+'</p>';
 				l+= '</a>'

 				l+='</div>';

				$('#courses').append(l);

			}
		}
	});

}

function displayQuizes(course){


	getQuizes(function(quizes) {

		if(quizes != null) {
			var course_quizes = $.grep(quizes['quizes'], function(e){ return e.courseID == course['courseID']; });

			for(quiz_key in course_quizes) {

			 	//var l= '<a href=pages/questions.html?course_id='+courses.courseID +'">'+  +'" class="list-group-item">'+ course_quizes[quiz_key].quizLevel+' - '+course_quizes[quiz_key].quizTitle+'</a>';

			 	var l='<a href="pages/questions.html?quiz_id='+ course_quizes[key].quizID + '&course_id=' + course['courseID']+'" class="list-group-item">'+ course_quizes[quiz_key].quizLevel+' - '+course_quizes[quiz_key].quizTitle+'             </a>';
				$('#'+course['courseID']).append(l);
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