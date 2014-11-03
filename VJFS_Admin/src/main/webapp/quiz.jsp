<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Admin Panel</title>

    <!-- Bootstrap -->
    <link href="css/bootstrap.min.css" rel="stylesheet">
	
	<!-- CSS -->
<!--     <link href="css/main.css" rel="stylesheet"> -->
    

    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
      <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
  </head>
  <body>
	<div> 
		<textarea rows="1" cols="1">Quiz name</textarea>
		<select class="selectpicker">
			<option>1</option>
			<option>2</option>
			<option>3</option>
		</select>
		<ul>
		   	<li class="list-group-item"  id="quiz_1_id"><a href="quiz.jsp">Quiz 1</a></li>   
		   	<li class="list-group-item"  id="quiz_2_id"><a href="quiz.jsp">Quiz 2</a></li>
			<li class="list-group-item"  id="quiz_3_id"><a href="quiz.jsp">Quiz 3</a></li>    	
		</ul>
		<a href="localhost:8080/VJFS_Admin/NewText" class="btn btn-default">New Text Question</a>
		<a href="localhost:8080/VJFS_Admin/NewMulti" class="btn btn-default">New Multiple Choice Question</a>
  		<a href="localhost:8080/VJFS_Admin/quiz.jsp" class="btn btn-default">Save</a>
	</div>
	
    <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
    <!-- Include all compiled plugins (below), or include individual files as needed -->
    <script src="js/bootstrap.min.js"></script>
  </body>
</html>