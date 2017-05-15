<?php

// version 2.0.0

header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');
$result = array();

if (!isset($_GET['game'])) {
  $result['errorCode'] = 2;
  echo json_encode($result);
  return;
}

$game = $_GET['game'];
if (!ctype_digit($game)) {
  $result['errorCode'] = 4;
  echo json_encode($result);
  return;
}

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

if ($entriesPsn->length) {
  $result['platform'] = "PSN";
} elseif ($entriesXbl->length) {
  $result['platform'] = "XBL";
} else {
  $result['errorCode'] = 8;
  echo json_encode($result);
  return;
}

$players = array();
foreach ($entries as $entry) {
  array_push($players, $entry->textContent);
}

if (empty($players)) {
  $result['errorCode'] = 16;
  echo json_encode($result);
  return;
}

$result['errorCode']= 1;
$result['players'] = $players;
echo json_encode($result);

?>