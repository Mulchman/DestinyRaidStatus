<?php

header('Content-Type: application/json');

$game = $_GET['game'];
$url = 'https://www.the100.io/game/' . $game;
$contents = file_get_contents($url);

$doc = new DOMDocument;
$doc->preserveWhiteSpace = false;
$doc->strictErrorChecking = false;
$doc->recover = true;

libxml_use_internal_errors(true);
$doc->loadHTML($contents);
libxml_clear_errors();

$xpath = new DOMXPath($doc);

$queryPlayers = "//*[contains(@class, 'gamertag')]/a";
$entries = $xpath->query($queryPlayers);

$queryPsn = "//*[contains(@class, 'ps4')]";
$entriesPsn = $xpath->query($queryPsn);

$queryXbl = "//*[contains(@class, 'xbox-one')]";
$entriesXbl = $xpath->query($queryXbl);

$result = array();

if ($entriesPsn->length) {
  array_push($result, array('platform' => "PSN"));
} elseif ($entriesXbl->length) {
  array_push($result, array('platform' => "XBL"));
}

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