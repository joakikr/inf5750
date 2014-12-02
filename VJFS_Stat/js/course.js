/**
 * Created by GladeJoa on 16.11.14.
 */

function getCourseResourceURL() {
    var url = getHostRoot() + '/api/systemSettings/VJFS_courses';
    return url;
}


function getQuestions(handler) {
    // Get URL from where to fetch quiz's json
    var url = getHostRoot() + '/api/systemSettings/VJFS_questions';

    // Get question's as json object and on success use handler function
    $.ajax({
        url: url,
        dataType: 'json'
    }).success(function(questions) {
        handler(questions);
    }).error(function(error) {
        handler(null);
    });
}

function displayStats() {
    // Get URL from where to fetch json
    var urlCourses = getHostRoot() + '/api/systemSettings/VJFS_courses';
    var urlQuizes = getHostRoot() + '/api/systemSettings/VJFS_quizes';
    var urlQuestions = getHostRoot() + '/api/systemSettings/VJFS_questions';
    var q = [];
    var courseQuizes = [];
    var courseQuestins = [];
    var courseAttendants = [];
    var finishQuiz = [];
    var ape = 0;
    // Get quizes as json object and on success use handler function
    $.ajax({
        url: urlCourses,
        dataType: 'json'
    }).success(function(courses) {
            $.ajax({
                    url: urlQuizes,
                    dataType: 'json'
            }).success(function(quizes) {
                $.ajax({
                    url: urlQuestions,
                    dataType: 'json'
                }).success(function(questions){
                    var q = [];
                    var courseQuizes = [];
                    var courseQuestions = [];
                    var courseAttendants = [];
                    var finishQuiz = [];
                    var l = "";
                    var totalCourses = 0;
                    var totalQuizes = 0;
                    var cquizes = 0;
                    var cquestions = 0;
                    var catts = 0;
                    var finQuiz = 0;
                    var quizCounter = 0;
                    var temp = 0;
                    var quizData2 = {
                       labels : q,
                        datasets : [
                            {
                            fillColor : "#4682B4",
                            strokeColor : "#48A4D1",
                            data : [2,1]
                            }
                        ] 
                    }
                    for(key in courses['courses']){
                        var tempCourseID = courses['courses'][key].courseID;
                        //console.log(tempCourseTitle);
                        var name = courses['courses'][key].courseTitle;
                        if(name.length >= 15){
                            name = name.substring(0,15);
                            name = name+"..."
                            q.push(name);
                        }else{
                            q.push(name);
                        }
                        totalCourses++;
                        for(keys in quizes['quizes']){
                            if(courses['courses'][key].courseID == quizes['quizes'][keys].courseID){
                                totalQuizes++;
                                cquizes++;
                            }
                        }
                        for(keys in questions['questions']){
                            if(courses['courses'][key].courseID == questions['questions'][keys].course_id){
                                cquestions++;
                            }
                        }
                        
                        for(keys in courses['courses'][key]['courseAttendants']){
                            //console.log(courses['courses'][key]['courseAttendants'][keys].attendantName);
                             var urlStudent = getHostRoot() + '/api/systemSettings/VJFS_' + courses['courses'][key]['courseAttendants'][keys].attendantUsername + '_quizes';
                             //console.log(urlStudent);
                             $.ajax({
                                url: urlStudent,
                                dataType: 'json'
                            }).success(function(userquizes) {
                               for(keyss in userquizes['quizes']){
                                    for(keysss in quizes['quizes']){
                                        if((quizes['quizes'][keysss].quizID+"") == userquizes['quizes'][keyss].quizID && tempCourseID+"" == quizes['quizes'][keysss].courseID){
                                        }
                                    }
                                    //console.log("User quiz id" + userquizes['quizes'][keyss].quizID);
                               }
                            }).error(function(error) {
                                return;
                            });

                            catts++;
                        }
                        //var correctquizchart = document.getElementById("coursestat4").getContext("2d");
                        //new Chart(correctquizchart).Bar(quizData2);
                        quizCounter++;
                        //console.log("finquiz outside of for loop:" + finQuiz);
                        courseAttendants.push(catts);
                        courseQuizes.push(cquizes);
                        courseQuestions.push(cquestions);
                        cquizes = 0;
                        cquestions = 0;
                        catts = 0;   
                    }
                    l += "<p>" + "Total courses: " +  totalCourses + "</p>"
                    l +=  "<p>" + "Total quizes: " +  totalQuizes + "</p>"
                    $('#courses').append(l);
                    var courseData = {
                        labels : q,
                        datasets : [
                            {
                            fillColor : "#4682B4",
                            strokeColor : "#48A4D1",
                            data : courseQuizes
                            }
                        ]
                    }
                    var quizData = {
                       labels : q,
                        datasets : [
                            {
                            fillColor : "#4682B4",
                            strokeColor : "#48A4D1",
                            data : courseQuestions
                            }
                        ] 
                    }
                    var attenData = {
                        labels : q,
                        datasets : [
                            {
                            fillColor : "#4682B4",
                            strokeColor : "#48A4D1",
                            data : courseAttendants   
                            }
                        ]
                    }
                    var quizchart = document.getElementById("coursestat").getContext("2d");
                    new Chart(quizchart).Bar(courseData);
                    var  questionchart = document.getElementById("coursestat2").getContext("2d");
                    new Chart(questionchart).Bar(quizData);
                    var  attenchart = document.getElementById("coursestat3").getContext("2d");
                    new Chart(attenchart).Bar(attenData);
                    //console.log(courseQuestions);
                    //console.log(courseQuizes);
                    //console.log(q);
                }).error(function(error){
                    handler(null);
                    return;
                });
            }).error(function(error) {
                    handler(null);
                    return;
            });
    }).error(function(error) {
        handler(null);
        return;
    });
}

function displayCourses() {

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
    var courseDescription = JSON.stringify($('#courseDescription').code());

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
            course[0].courseDescription = courseDescription;
        } else {
            // Here we have a new course
            courses['courses'].push( {"courseID" : getUniqueID(), "courseTitle" : courseTitle, "courseDescription" : courseDescription, "courseAttendants" : [], "courseMentors" : [] } );
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

            // Retrieve index into courses array for course
            var course_index = courses['courses'].indexOf(course[0]);

            // Delete course from courses
            courses['courses'].splice(course_index, 1);

            // Update courses on server and go to menu over courses
            setCourses(JSON.stringify(courses), function() {
                window.location.href = getAppRoot();
            });
        }
    });
}
function mobileCheck() {
  var check = false;
  //Script from http://detectmobilebrowsers.com/ - Unlicensed open source
  (function(a,b){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
}