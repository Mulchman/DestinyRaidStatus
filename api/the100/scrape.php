<?php

header('Content-Type: application/json');

$game = $_GET['game'];
$url = 'https://www.the100.io/game/' . $game;
$contents = file_get_contents($url);

$doc = new DOMDocument;
$doc->preserveWhiteSpace = false;
$doc->strictErrorChecking = false;
$doc->recover = true;
$doc->loadHTML($contents);

$xpath = new DOMXPath($doc);
$query = "//*[contains(@class, 'gamertag')]/a";
$entries = $xpath->query($query);

$result = array();
foreach ($entries as $entry) {
  $data = array(
    'player' => $entry->textContent
  );
  array_push($result, $data);
}

echo json_encode($result);

//foreach ($entries as $entry) {
  //echo $entry->textContent;
//}

?>