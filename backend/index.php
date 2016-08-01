<!DOCTYPE html>
<html>
	<head>
		<!-- Compiled and minified CSS -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.7/css/materialize.min.css">

  <!-- Compiled and minified JavaScript -->
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.7/js/materialize.min.js"></script>
	</head>
	<body>
<div class="container" style="margin-top: 60px;">
        <div class="row">
      <div class="col s6">
<div class="card-panel white">
          <p><a class="waves-effect waves-light btn" href="http://ec2-54-173-205-147.compute-1.amazonaws.com/busara/busara.php?action=">Download All Data</a>
      	<div class="divider"></div>
  <div class="section">
    <h5>Original USSD App</h5>
    <p><a class="waves-effect waves-light btn" href="http://ec2-54-173-205-147.compute-1.amazonaws.com/busara/busara.php?action=all-data-for-app&app=original">Download app's Data</a>
</p>
  </div>
  <div class="divider"></div>
  <div class="section">
    <h5>Deepnested USSD App</h5>
    <p><p><a class="waves-effect waves-light btn" href="http://ec2-54-173-205-147.compute-1.amazonaws.com/busara/busara.php?action=all-data-for-app&app=deepnested">Download App's Data</a></p>
  </div>
  <div class="divider"></div>
  <div class="section">
    <h5>Randomized USSD App</h5>
    <p><p><a class="waves-effect waves-light btn" href="http://ec2-54-173-205-147.compute-1.amazonaws.com/busara/busara.php?action=all-data-for-app&app=randomized">Download App's Data</a></p>
  </div>
        </div>



      </div>
      <div class="col s6">
      	<div class="card-panel white">
      	<div class="row">
      	<h5>Input Survey ID to Download Data</h5>
    <form class="col s12" method="get" action="http://ec2-54-173-205-147.compute-1.amazonaws.com/busara/busara.php">
    <input type="hidden" name="action" value="all-data-for-respondent" />
      <div class="row">
        <div class="input-field col s6">
          <input placeholder="e.g 40004050" id="first_name" name="respodent_id" type="text" class="validate">
          <label for="first_name">Survey ID</label>
        </div>
        <div class="input-field col s6">
          <input type="submit" value="Download Data" class="waves-effect waves-light btn"/>
        </div>
      </div>

    </form>
  </div>
        </div>
      </div>
    </div>
      </div>
	</body>
</html>