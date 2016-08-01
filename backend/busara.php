<?php

if (isset($_SERVER['HTTP_ORIGIN'])) {
	header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
	header('Access-Control-Allow-Credentials: true');
	header('Access-Control-Max-Age: 86400');    // cache for 1 day
 }

if(isset($_POST['application']) && isset($_POST['user'])) {

	require_once  __DIR__ . '/db_connect.php';
	$db = new DB_CONNECT();

	$application = $_POST['application'];
	$surveyId = $_POST['user'];

	$respondentQuery = "SELECT * FROM  `respondents` WHERE  `survey_id` =  '$surveyId' AND  `application` =  '$application' LIMIT 0 , 30";

	$respodentResultSet = mysql_query($respondentQuery) or die(mysql_error());

	if($respodentResultSet) {

		$respondentId;

		if(mysql_num_rows($respodentResultSet) > 0) {

			$respondent = mysql_fetch_array($respodentResultSet);
			$respondentId = $respondent['id'];

		} else {

			// insert
			$respodentInsert = mysql_query("INSERT INTO `busara`.`respondents` (`id`, `survey_id`, `application`) VALUES (NULL, '$surveyId', '$application')");

			if($respodentInsert) {

				$respondentId = mysql_insert_id();
			} else {

				echo "Server error";
			}
		}

		if(isset($_POST['analytics'])) {

			$data = $_POST['analytics'];

			echo "<pre>";
			print_r($data);
			echo "</pre>";

			foreach ($data as $key => $value) {

				$timeStamp = $value['timeStamp'];
				$timeSpent = $value['timeSpent'];
				$previousPage = $value['previousPage'];
				$pageName = $value['pageName'];
				$pageOrder = $value['pageOrder'];
				$isInputPresent = $value['isInputPresent'];

				$pageAnalyticsQuery = "INSERT INTO `busara`.`page_statistics` (`id`, `respondent_id`, `timestamp`, `timespent`, `previousPage`, `pageName`, `pageOrder`, `isInputPresent`) VALUES (NULL, '$respondentId', '$timeStamp', '$timeSpent', '$previousPage', '$pageName', '$pageOrder', '$isInputPresent')";

				$pageQueryResultSet = mysql_query($pageAnalyticsQuery);

				if($pageQueryResultSet) {

					$pageStatsId = mysql_insert_id();

					if($isInputPresent == "yes") {

						$inputStats = $value['inputStats'];

						$backspaceCount = $inputStats['backspaceCount'];
						$totalKeyPressCount = $inputStats['totalKeyPressCount'];
						$timeStartTyping = $inputStats['timeStartTyping'];
						$timeStopTyping = $inputStats['timeStopTyping'];
						$timeSpentInField = $inputStats['timeSpentInField'];
						$finalInputValue = $inputStats['finalInputValue'];
						$finalInputLength = $inputStats['finalInputLength'];
						$intelliWordChanges = $inputStats['intelliWordChanges'];
						$intelliWordIndex = $inputStats['intelliWordIndex'];

						$inputAnalyticsQuery = "INSERT INTO `busara`.`input_stats` (`id`, `page_statistic_id`, `backspaceCount`, `totalKeyPressCount`, `timeStartTyping`, `timeStopTyping`, `timeSpentInField`, `finalInputValue`, `finalInputLength`, `intelliWordChanges`, `intelliWordIndex`) VALUES (NULL, '$pageStatsId', '$backspaceCount', '$totalKeyPressCount', '$timeStartTyping', '$timeStopTyping', '$timeSpentInField', '$finalInputValue', '$finalInputLength', '$intelliWordChanges', '$intelliWordIndex')";

						$inputStatsResultSet = mysql_query($inputAnalyticsQuery);

						if($inputStatsResultSet) {

						} else {

						}

					}
				} else {

				}

			}
		}

	} else {

		echo "Server error";

	}

} else if(isset($_GET['action'])) {

	require_once  __DIR__ . '/db_connect.php';
	$db = new DB_CONNECT();

	$action = $_GET['action'];

	$query = "SELECT * FROM `respondents`";

	if($action == 'all-data-for-app') {

		$app = $_GET['app'];

		$query .= " WHERE `application`='$app'";

	} else if($action == 'all-data-for-respondent') {

		$respondentId = $_GET["respodent_id"];

		$query .= " WHERE `survey_id`='$respondentId'";

	}

	$respondents = mysql_query($query) or die(mysql_error());

	if($respondents) {

		$data = array();

		$header = array(
			"Survey ID",// 0
			"Application", // 1

			"Page Name", // 2
			"Page Order", // 3
			"Previous Page", // 4
			"Time page accessed",// 5
			"Time Spent on Page",// 6
			"Page Contains input?",// 7

			"User input Value",// 8
			"User input length",// 9
			"Time Started typing",// 10
			"Time Stopped typing",// 11
			"Time spent typing",// 12
			"Total Keypress count",// 13
			"Total backspace count",// 14
			"Intelli Word Changes",//15
			"Intelli Word Index"// 16
		);

		array_push($data, $header);

		while($respondent = mysql_fetch_array($respondents)) {

			$row = array(
				"-",
				"-",
				"-",
				"-",
				"-",
				"-",
				"-",
				"-",
				"-",
				"-",
				"-",
				"-",
				"-",
				"-",
				"-",
				"-",
				"-"
			);

			$row[0] = $respondent["survey_id"];
			$row[1] = $respondent["application"];

			$respondentID = $respondent['id'];

			$pageQuery = "SELECT * FROM `page_statistics` WHERE `respondent_id`=$respondentID";
			$pageStats = mysql_query($pageQuery) or die(mysql_error());

			if($pageStats) {

				if(mysql_num_rows($pageStats) > 0) {

					while($pageStat = mysql_fetch_array($pageStats)) {

						$pageId = $pageStat['id'];
						$row[2] = $pageStat['pageName'];
						$row[3] = $pageStat['pageOrder'];
						$row[4] = $pageStat['previousPage'];
						$row[5] = convertTimeStamp($pageStat['timestamp']);
						$row[6] = $pageStat['timespent'] . " ms";
						$row[7] = $pageStat['isInputPresent'];


						$inputQuery = "SELECT * FROM `input_stats` WHERE `page_statistic_id`=$pageId";
						$inputStats = mysql_query($inputQuery) or die(mysql_error());

						if($inputStats) {

							if(mysql_num_rows($inputStats) > 0) {

								while($inputStat = mysql_fetch_array($inputStats)) {

									$row[8] = $inputStat["finalInputValue"];
									$row[9] = $inputStat["finalInputLength"];
									$row[10] = convertTimeStamp($inputStat['timeStartTyping']);
									$row[11] = convertTimeStamp($inputStat['timeStopTyping']);
									$row[12] = $inputStat['timeSpentInField'] .' ms';
									$row[13] = $inputStat['totalKeyPressCount'];
									$row[14] = $inputStat['backspaceCount'];
									$row[15] = $inputStat["intelliWordChanges"];
									$row[16] = $inputStat["intelliWordIndex"];

									array_push($data,	$row);

								}

							} else {
								$row[8] = "-";
								$row[9] = "-";
								$row[10] = "-";
								$row[11] = "-";
								$row[12] = "-";
								$row[13] = "-";
								$row[14] = "-";
								$row[15] = "-";
								$row[16] = "-";
								array_push($data, $row);
							}

						}
					}

				} else {

					$row[2] = "-";
					$row[3] = "-";
					$row[4] = "-";
					$row[5] = "-";
					$row[6] = "-";
					$row[7] = "-";
					$row[8] = "-";
					$row[9] = "-";
					$row[10] = "-";
					$row[11] = "-";
					$row[12] = "-";
					$row[13] = "-";
					$row[14] = "-";
					$row[15] = "-";
					$row[16] = "-";

					array_push($data, $row);
				}

			}
		}

		$fileName = 'data.csv';

		header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
		header('Content-Description: File Transfer');
		header("Content-type: text/csv");
		header("Content-Disposition: attachment; filename={$fileName}");
		header("Expires: 0");
		header("Pragma: public");

		$fh = @fopen( 'php://output', 'w' );

		foreach ( $data as $record ) {

			fputcsv($fh, $record);
		}

		fclose($fh);

		exit;
	}

} else {

	echo "No user or application";

}

function convertTimeStamp($timestamp) {

	$t = ceil($timestamp / 1000) + 60 * 60 * 3;

	$dt = new DateTime("@$t");

	return $dt->format('Y-m-d H:i:s');
}