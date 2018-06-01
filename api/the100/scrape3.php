<?php

// version 3.0.0 - Destiny 2

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

$url = 'https://www.the100.io/gaming_sessions/' . $game;
$contents = file_get_contents($url);

$doc = new DOMDocument;
$doc->preserveWhiteSpace = false;
$doc->strictErrorChecking = false;
$doc->recover = true;

libxml_use_internal_errors(true);
$doc->loadHTML($contents);
libxml_clear_errors();

$xpath = new DOMXPath($doc);
$players = array();

// Get all the gamertags
$gamertagQuery = "//*[contains(@class, 'gamertag')]";
$gamertagEntries = $xpath->query($gamertagQuery);

// Go through parsing details from each gamertag
foreach ($gamertagEntries as $gamertagEntry) {
  $gamertagDoc = new DOMDocument;
  $gamertagDoc->preserveWhiteSpace = false;
  $gamertagDoc->strictErrorChecking = false;
  $gamertagDoc->recover = true;
  $gamertagDoc->appendChild($gamertagDoc->importNode($gamertagEntry, true));
  // echo "\n\n" . $gamertagDoc->saveXML() . "\n\n";

  $gamertagXPath = new DOMXPath($gamertagDoc);

  $temp = $gamertagXPath->query("//a");
  $the100ioName = $temp->item(0)->nodeValue;
  
  $player = array();
  $player['name'] = $the100ioName;

  $aliases = array();
  $temp = $gamertagXPath->query("//*[contains(@class, 'ps4')]");
  $aliasPSN = $temp->length ? substr($temp->item(0)->nodeValue, 5) : ""; // stripping "PSN: "
  $aliases['PSN'] = $aliasPSN;

  $temp = $gamertagXPath->query("//*[contains(@class, 'xbox-one')]"); // stripping "Xbox: "
  $aliasXBL = $temp->length ? substr($temp->item(0)->nodeValue, 6) : "";
  $aliases['XBL'] = $aliasXBL;

  $temp = $gamertagXPath->query("//*[contains(@class, 'pc')]");
  $aliasPC = $temp->length ? substr($temp->item(0)->nodeValue, 6) : ""; // stripping "BNet: "
  $aliases['PC'] = $aliasPC;
  $player['aliases'] = $aliases;

  array_push($players, $player);
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