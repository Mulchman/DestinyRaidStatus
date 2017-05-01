import angular from 'angular';

angular
  .module('drsApp')
  .factory('RaidService', RaidService);

function RaidService() {
  // ordered based on 390 release, but it doesn't matter at all
  const raids = [
    // Crota's End- nm/hm/390
    1836893116, 1836893119, 4000873610,
    // Vault of Glass- nm/hm/390
    2659248071, 2659248068, 856898338,
    // Kings Fall- nm/hm/390
    1733556769, 3534581229, 3978884648,
    // Wrath of the Machine- nm/hm/390
    260765522, 1387993552, 3356249023
  ];

  const service = {
    raids: raids,
    getName: getName
  };
  return service;

  function getName(hash) {
    const ce = "Crota's End";
    const vog = "Vault of Glass";
    const kf = "King's Faull";
    const wotm = "Wrath of the Machine";
    const unk = "Unknown";
    let retval;

    switch (hash) {
      case service.raids[0]:
      case service.raids[1]:
      case service.raids[2]:
        retval = ce;
        break;
      case service.raids[3]:
      case service.raids[4]:
      case service.raids[5]:
        retval = vog;
        break;
      case service.raids[6]:
      case service.raids[7]:
      case service.raids[8]:
        retval = kf;
        break;
      case service.raids[9]:
      case service.raids[10]:
      case service.raids[11]:
        retval = wotm;
        break;
      default:
        retval = unk;
    }
    return retval;
  }
}