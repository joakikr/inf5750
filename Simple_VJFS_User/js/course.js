

function displayCourses() {
	
	// Get URL to retrieve json object from
	var url = getHostRoot() + '/api/systemSettings/courses';


	// Get courses as json object
	getCourses(function(courses) {

		if(courses != null) {
		
			// Display courses
			for(key in courses['courses']) {

				var desc = JSON.parse(courses['courses'][key].courseDescription);

				var l = '<div class="panel panel-default">'
				l +=  '<div class="panel-heading"><h4>'+ courses['courses'][key].courseTitle +'</h4></div>'
				l +=  '<div class="panel-body" >'+desc+'</div>'
				l += '<div class="panel-footer" id='+courses['courses'][key].courseID+'></div>'
				l += '</div>'


				/*
				var desc = JSON.parse(courses['courses'][key].courseDescription);

	            var l = '<div class="list-group" id='+courses['courses'][key].courseID+'>';

				l+= '<a href="#" class="list-group-item disabled">';
    			l+=	'<h4 class="list-group-item-heading">'+ courses['courses'][key].courseTitle +'</h4>';
    			l+=	'<h4>'+desc+'</h4>';
 				l+= '</a>'

 				l+='</div>';
				*/
				$('#courses').append(l);

			}
		}
	});

}

function displayQuizes(course){


	getUserQuizes(function(userQuizes) {
		if(userQuizes != null) {

			var course_quizes = $.grep(userQuizes['quizes'], function(e){ return e.courseID == course['courseID']; });


			for(quiz_key in course_quizes) {
				 console.log(course_quizes[quiz_key].quizID)
				console.log("asdfasdfa");
			}
		
		}

	});

	getQuizes(function(quizes) {

		if(quizes != null) {

			var course_quizes = $.grep(quizes['quizes'], function(e){ return e.courseID == course['courseID']; });

			course_quizes.sort(function(a, b) {
				if(a.quizLevel < b.quizLevel) return -1;
				if(a.quizLevel > b.quizLevel) return 1;
				return 0;
			});

			for(quiz_key in course_quizes) {
				 
				var t='<a href="pages/questions.html?quiz_id='+ course_quizes[quiz_key].quizID + '&course_id=';
				t += course['courseID']+'" class="list-group-item">';
				t += course_quizes[quiz_key].quizLevel+' - '+course_quizes[quiz_key].quizTitle;
				t += '<div id='+course_quizes[quiz_key].quizID+'></div>'
				t +='</a>';

				$('#'+course['courseID']).append(t);

					
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


function getQuiz(quiz_id, handler) {
	
	getQuizes(function(quizes) {

		// Retrieve quiz based on quiz_id
		var quiz = $.grep(quizes['quizes'], function(e){ return e.quizID == quiz_id; });
		
		// Result is an array, but should only be one element so using [0]
		if(quiz[0] == null) {
			handler(null);;
			return;
		}
		// Get quiz from quizes and call handler function on it
		handler(quiz[0]);
	});
}