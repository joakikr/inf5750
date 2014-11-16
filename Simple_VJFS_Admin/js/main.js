
function list_courses() {
	for(i = 0; i < 3; i++) {
		var course = '<li class="list-group-item"><a href="content/course.html?id=' + i + '">Course ' + i + '</a></li>'; 
		$('#list_courses').append(course);
	}

	return nil;
}
