

function displayCourses() {
	
	// Get URL to retrieve json object from
	var url = getHostRoot() + '/api/systemSettings/courses';


	getMyUserName(function(user){

		var userr = user.userCredentials.username

		// Get courses as json object
		getCourses(function(courses) {

			if(courses != null) {
			
				// Display courses
				for(key in courses['courses']) {

					if($("#courses:contains('"+courses['courses'][key].courseTitle+"')").length == 0) {

						var attendants =  courses['courses'][key].courseAttendants;
					

						for(keyY in attendants){
				
							if(attendants[keyY].attendantUsername === userr){
										
									
								var l = '<ul class="list-group-item" id='+courses['courses'][key].courseID+'_list>'
								l +=  '<div class="panel-heading"><h4>'+ courses['courses'][key].courseTitle +'</h4></div>'							
								l += '<ul class="list-group-item-clearfix" id='+courses['courses'][key].courseID+'></ul>'
								l += '</ul>'
					
								$('#courses').append(l);
								break;

							}
						}
                    
					}
					displayQuizesHelper(courses['courses'][key])

				}
				//TEST
				
				var div = document.getElementById('courses')
				// get an array of child nodes
				divChildren = div.childNodes;
			
				//loop all courses added to the list
				for (var i=0; i<divChildren.length; i++) {
						
					var found = 0;
					for(key2 in courses['courses']) {
					
	
						if(courses['courses'][key2].courseID+'_list' === divChildren[i].id){
							found = 1;
							break;
						}
					
					}
					if(found == 0){
						divChildren[i].remove();
					}
					found = 0;

				}
			}
		});

	});

}


function getMyUserName(handler) {
    // Get URL from where to fetch quiz's json
    var url = getHostRoot() + '/api/me';

    // Get the users information
    $.ajax({
        url: url,
        dataType: 'json'
    }).success(function(questions) {
        handler(questions);
    }).error(function(error) {
        handler(null);
    });
}


function displayQuizesHelper(course){

	getQuizes(function(quizes) {

		if(quizes != null) {

			var course_quizes = $.grep(quizes['quizes'], function(e){ return e.courseID == course['courseID']; });

			course_quizes.sort(function(a, b) {
				if(a.quizLevel < b.quizLevel) return -1;
				if(a.quizLevel > b.quizLevel) return 1;
				return 0;
			});

			for(quiz_key in course_quizes) {

				if($("#"+course['courseID']+":contains('"+course_quizes[quiz_key].quizTitle+"')").length == 0) {

						var t='<a href="pages/questions.html?quiz_id='+ course_quizes[quiz_key].quizID + '&course_id=';				
						t += course['courseID']+'" id="'+course_quizes[quiz_key].quizID+'_list" class="list-group-item">';
						t += course_quizes[quiz_key].quizLevel+' - '+course_quizes[quiz_key].quizTitle;
						t += '<div id='+course_quizes[quiz_key].quizID+'></div>'
						t +='</a>';

						$('#'+course['courseID']).append(t)			

				}
     
			}

			//TEST
			
			var div = document.getElementById(course['courseID'])
			// get an array of child nodes
			divChildren = div.childNodes;
		
			//loop all courses added to the list
			for (var i=0; i<divChildren.length; i++) {
			
				console.log(divChildren[i])
				
				var found = 0;
					for(quiz_key2 in course_quizes) {
					
						if(course_quizes[quiz_key2].quizID+'_list' === divChildren[i].id){
							found = 1;
							break;
						}
					
					}
					if(found == 0){
						divChildren[i].remove();
					}
					found = 0;
				
				
			}
			
			
			
			
			
			
			
			
			
			
			

			
  		}
		
		//Add green label for finished quiz
   		getUserQuizes(function(user_quizes) {
   			  
			if(user_quizes != null){  
			  
				for(key in user_quizes['quizes']){

					$('#'+user_quizes['quizes'][key].quizID).html("");
					$('#'+user_quizes['quizes'][key].quizID).append('<span class="label label-success">Finished</span>');
					
				}
   		
			}
   		});


   		//Add yellow label for quizes pending correction
		//Add red label for quizes that were not approved
   		getUserQuestions(function(user_questions){
			
			if(user_questions != null){
			
				for(key in user_questions['questions']){


					if(user_questions['questions'][key].corrected === "true"){

						$('#'+user_questions['questions'][key].quizID).html("");
						$('#'+user_questions['questions'][key].quizID).append('<span class="label label-danger">Wrong</span>');

					}else{
					
						$('#'+user_questions['questions'][key].quizID).html("");
						$('#'+user_questions['questions'][key].quizID).append('<span class="label label-warning">Pending correction</span>');
					}
				}
   			}
   			
   		});

 	});

}


/**
* Function will retrieve all courses as a json object
* and call the handler function with the courses.
*/
function getCourses(handler) {
	// Get URL from where to fetch courses json
	var url = getHostRoot() + '/api/systemSettings/VJFS_courses';
	
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
	var url = getHostRoot() + '/api/systemSettings/VJFS_quizes';
	
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