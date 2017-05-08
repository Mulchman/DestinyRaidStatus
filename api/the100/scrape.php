<?php

header('Content-Type: application/json');
$result = array();

if (!isset($_GET['game'])) {
  $result['error'] = "Unknown gameId.";
  echo json_encode($result);
  return;
}

$game = $_GET['game'];
if (!ctype_digit($game)) {
  $result['error'] = "Invalid gameId.";
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
  $result['error'] = "Unknown platform.";
  echo json_encode($result);
  return;
}

$players = array();
foreach ($entries as $entry) {
  array_push($players, $entry->textContent);
}
$result['players'] = $players;

echo json_encode($result);

?>