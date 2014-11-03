<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Bootstrap 101 Template</title>

<!-- Bootstrap -->
<link href="css/bootstrap.min.css" rel="stylesheet">

<!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
<!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
<!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
      <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
</head>
<body>

	<a href="#" class="list-group-item active"> Courses </a>

	<div class="panel-group" id="accordion" role="tablist"
		aria-multiselectable="true">
		<div class="panel panel-default">
			<div class="panel-heading" role="tab" id="headingOne">
				<h4 class="panel-title">
					<a data-toggle="collapse" data-parent="#accordion"
						href="#collapseOne" aria-expanded="false" data-parent="#accordion"
						aria-controls="collapseOne"> Course 1 <span
						class="label label-success">Finished</span></a>
				</h4>
			</div>
			<div id="collapseOne" class="panel-collapse collapse in"
				role="tabpanel" aria-labelledby="headingOne">
				<div class="panel-body">
					<a href="questions.jsp" class="list-group-item">Quiz 1 <span
						class="label label-success">Finished</span></a> <a href="#"
						class="list-group-item">Quiz 2 <span
						class="label label-success">Finished</span></a> <a href="#"
						class="list-group-item">Quiz 3 <span
						class="label label-success">Finished</span></a> <a href="#"
						class="list-group-item">Quiz 4 <span
						class="label label-success">Finished</span></a>
				</div>
			</div>
		</div>
		<div class="panel panel-default">
			<div class="panel-heading" role="tab" id="headingTwo">
				<h4 class="panel-title">
					<a class="collapsed" data-toggle="collapse"
						data-parent="#accordion" href="#collapseTwo" aria-expanded="false"
						aria-controls="collapseTwo"> Course 2 <span
						class="label label-danger">Not started</span></a>
				</h4>
			</div>
			<div id="collapseTwo" class="panel-collapse collapse" role="tabpanel"
				aria-labelledby="headingTwo">
				<div class="panel-body">
					<a href="#" class="list-group-item">Quiz 1</a> <a href="#"
						class="list-group-item">Quiz 2</a> <a href="#"
						class="list-group-item">Quiz 3</a> <a href="#"
						class="list-group-item">Quiz 4</a>
				</div>
			</div>
		</div>
		<div class="panel panel-default">
			<div class="panel-heading" role="tab" id="headingThree">
				<h4 class="panel-title">
					<a class="collapsed" data-toggle="collapse"
						data-parent="#accordion" href="#collapseThree"
						aria-expanded="false" aria-controls="collapseThree"> Course 3
						<span class="label label-warning">Started</span>
					</a>
				</h4>
			</div>
			<div id="collapseThree" class="panel-collapse collapse"
				role="tabpanel" aria-labelledby="headingThree">
				<div class="panel-body">
					<a href="questions.jsp" class="list-group-item">Quiz 1 <span
						class="label label-success">Finished</span></a></a> <a
						href="questions.jsp" class="list-group-item">Quiz 2 <span
						class="label label-success">Finished</span></a></a> <a
						href="questions.jsp" class="list-group-item">Quiz 3 <span
						class="label label-warning">Started</span></a> <a 
						href="questions.jsp" class="list-group-item">Quiz 4 <span
						class="label label-danger">Not started</span></a>
				</div>
			</div>
		</div>
	</div>

	<!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
	<script
		src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
	<!-- Include all compiled plugins (below), or include individual files as needed -->
	<script src="js/bootstrap.min.js"></script>
</body>
</html>