<?php

	$id = (isset($_GET['id'])) ? $_GET['id'] : false;

	$file = "data/cards.json";
	$fh = fopen($file, "r");
	$data = fread($fh, filesize($file));
	
	if ($id) {
		$json = json_decode($data, true);
		$data = $json[$id - 1];
		$data = json_encode($data);
	}

	header("Content-Type: application/json");
	echo $data;

?>
