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
  
  	<div class="container">
  		<div class="row">
  			<!-- padd content to center -->
  			<div class="col-xs-3"></div>
  			
	  		<form role="form" class="col-xs-6">
				<div class="form-group row">
					<div class="col-xs-9">
						<label for="quizTitle">Quiz Title</label> 
						<input type="text" class="form-control" id="quizTitle" value="Quiz 1">
					</div>
					
					<div class="col-xs-3">
						<label for="quizLevel">Level</label>
						<select class="selectpicker form-control" id="quizLevel">
							<option>1</option>
							<option>2</option>
							<option>3</option>
						</select>
					</div>
				</div>
	
				<button type="submit" class="btn btn-default">Save</button>
				
			</form>
  		</div>
	  
	  	<br><br>
	  	
	  	<div class="row">
  			<!-- padd content to center -->
  			<div class="col-xs-3"></div>
  			
	  		<div class="col-xs-6">
	  			<label>Questions</label> 
	  	
				<ul>
					<li class="list-group-item" id="question_1_id"><a href="question.jsp">Question 1</a></li>
					<li class="list-group-item" id="question_2_id"><a href="question.jsp">Question 2</a></li>
					<li class="list-group-item" id="question_3_id"><a href="question.jsp">Question 3</a></li>
				</ul>
		  
				<a href="question_text.jsp" class="btn btn-default">New Text Question</a>
				<a href="question_multiplechoice.jsp" class="btn btn-default">New Multiple Choice Question</a>
	  		</div>
	  	</div>
  	</div>
  
	
    <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
    <!-- Include all compiled plugins (below), or include individual files as needed -->
    <script src="js/bootstrap.min.js"></script>
  </body>
</html>