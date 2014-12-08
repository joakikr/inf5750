
/**
 * Created by GladeJoa on 16.11.14.
 */
function getstatQuestions(userquizUrl,username,courseCode,coursesIDList,userName){
     var quizurl = getHostRoot() + '/api/systemSettings/VJFS_quizes';
     var courselst = [];
     var temp = 0;
    $.ajax({
        url: userquizUrl,
        dataType: 'json'
    }).success(function(userquizes) {
        $.ajax({
        url: quizurl,
        dataType: 'json'
        }).success(function(allquizes) {
            var temp = 0;
            for(key in allquizes['quizes']){
                for(keys in userquizes['quizes']){
                    if(allquizes['quizes'][key].quizID+"" == userquizes['quizes'][keys].quizID && courseCode+"" == allquizes['quizes'][key].courseID){ 
                        temp++;
                        //console.log(temp);
                        //console.log(userName + ", " + userquizes['quizes'][keys].quizID + courseCode + ", correct quizes in this course: " + temp);
                    }
                }
            }
            handler(temp);
        }).error(function(error) {       
            handler(null);
            return;
        });
         
    }).error(function(error) {
        handler(null);
        return;
    });
}
function creategraph(labelsx,datax){
    var quizData = {
            labels : labelsx,
            datasets : [
                {
                fillColor : "#4682B4",
                strokeColor : "#48A4D1",
                data : datax
                }
                ] 
    }
    var  attenchart = document.getElementById("coursestat4").getContext("2d");
    new Chart(attenchart).Bar(quizDatais);
}
function quizStats(){
    var courseurl = getHostRoot() + '/api/systemSettings/VJFS_courses';

    var swag = [];
    var courselabel = [];
    var a = $.ajax({
        url: courseurl,
        dataType: 'json'
    }).success(function(courses){
        for(key in courses['courses']){
            var noob = 0;
            var teller = 0;
            courselabel.push(courses['courses'][key].courseTitle);
            for(keys in courses['courses'][key]['courseAttendants']){

                var name = courses['courses'][key]['courseAttendants'][keys].attendantUsername;
                var nameUrl = getHostRoot() + '/api/systemSettings/VJFS_' + name + '_quizes';
                var b = $.ajax({
                    url: nameUrl,
                    dataType: 'json'
                }).success(function(nameQuizes) {

                    for(keyss in nameQuizes['quizes']){
                       
                        if(nameQuizes['quizes'][keyss].courseID == courses['courses'][key].courseID+""){
                            teller++;
                            //noob er riktig her inne 0
                        }
                    }
                }).error(function(error) {       
                    handler(null);
                    return;
                });
                $.when(b).done(function() {
                    swag[noob] = teller;
                    noob++;
                    //console.log(teller);     
                    teller = 0;
                    console.log(courselabel);
                    console.log(swag);
                    creategraph(courselabel,swag);
                });
            }
        
        }
    }).error(function(error) {       
            handler(null);
            return;
    });
    $.when(a).done(function() {
      
    });
}
function quizStats2(){

    var courseurl = getHostRoot() + '/api/systemSettings/VJFS_courses';
    var halla = [];
    var hallo = [];
    var teller = 0;
    var q = [];
    $.ajax({
        url: courseurl,
        dataType: 'json'
    }).success(function(courses){
         var quizData = {
            labels : q,
            datasets : [
                {
                fillColor : "#4682B4",
                strokeColor : "#48A4D1",
                data : halla
                }
                ] 
        }
        var quizchart = document.getElementById("coursestat4").getContext("2d");
        new Chart(quizchart).Bar(quizData);
        for(key in courses['courses']){
            q.push(courses['courses'][key].courseTitle);
            quizchart.addData([40, 60], "August");
            quizchart.update();
            hallo.push(courses['courses'][key].courseTitle);
            for(keys in courses['courses'][key]['courseAttendants']){
                var userUrl = getHostRoot() + '/api/systemSettings/VJFS_' + courses['courses'][key]['courseAttendants'][keys].attendantUsername + '_questions';
                $.ajax({
                    url: userUrl,
                    dataType: 'json'
                }).success(function(questions){
                    //console.log(userUrl);
                    for(keyss in questions['questions']){
                        if(courses['courses'][key].courseID+"" == questions['questions'][keyss].courseID){
                             if(questions['questions'][keyss].corrected == "true"){
                                teller++;
                                 halla.push(teller);      
                                 console.log(teller);                          
                             }
                        } 
                    }                   
                }).error(function(error) {       
                    handler(null);
                    return;
                }); 
             
            }
            halla.push(teller);
            teller = 0;
            console.log(halla);
            console.log(hallo);
    }    
    }).error(function(error) {       
            handler(null);
            return;
    });
}
function clickonChart(canvasID){
     var quizchart = document.getElementById(canvasID).getContext("2d");
     var activeBars = myBarChart.getBarsAtEvent(evt);
}
function displayStats() {
    // Get URL from where to fetch json
    var urlCourses = getHostRoot() + '/api/systemSettings/VJFS_courses';
    var urlQuizes = getHostRoot() + '/api/systemSettings/VJFS_quizes';
    var urlQuestions = getHostRoot() + '/api/systemSettings/VJFS_questions';
    var q = [];
    var courseQuizes = [];
    var courseQuestions = [];
    var courseAttendants = [];
    var coueseMentors = [];
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
                    var courseMentors = [];
                    var courseidList = [];
                    var coueseMentors = [];
                    var l = "";
                    var totalCourses = 0;
                    var totalQuizes = 0;
                    var cquizes = 0;
                    var cquestions = 0;
                    var catts = 0;
                    var finQuiz = 0;
                    var quizCounter = 0;
                    var mentorCounter = 0;
                    var totalAttendants = 0;
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
                        courseidList.push(tempCourseID);
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
                            catts++;
                            totalAttendants++;
                        }
                        for(keys in courses['courses'][key]['courseMentors']){
                            mentorCounter++;
                        }
                        quizCounter++;
                        courseMentors.push(mentorCounter);
                        courseAttendants.push(catts);
                        courseQuizes.push(cquizes);
                        courseQuestions.push(cquestions);
                        mentorCounter = 0;
                        cquizes = 0;
                        cquestions = 0;
                        catts = 0;   
                    }

                    l += "<p>" + "Total attendants: " +  totalAttendants + "</p>"
                    l += "<p>" + "Total courses: " +  totalCourses + "</p>"
                    l +=  "<p>" + "Total quizes: " +  totalQuizes + "</p>"
                    l += "<h1> <small>Press on desired statistic to show</small></h1>";
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
                    var mentData = {
                        labels : q,
                        datasets : [
                            {
                            fillColor : "#4682B4",
                            strokeColor : "#48A4D1",
                            data : courseMentors 
                            }
                        ]
                    }
                    var quizchart = document.getElementById("coursestat").getContext("2d");
                    new Chart(quizchart).Bar(courseData);
                    var  questionchart = document.getElementById("coursestat2").getContext("2d");
                    new Chart(questionchart).Bar(quizData);
                    var  attenchart = document.getElementById("coursestat3").getContext("2d");
                    new Chart(attenchart).Bar(attenData);
                    var  mentchart = document.getElementById("coursestat4").getContext("2d");
                    new Chart(mentchart).Bar(mentData);
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
