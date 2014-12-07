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

    function mobileCheck() {
        var check = false;
        return true;
        //Script from http://detectmobilebrowsers.com/ - Unlicensed open source
        (function(a,b){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
        return true;
}
