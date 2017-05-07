import angular from 'angular';

angular
    .module('drsApp')
    .factory('The100Service', The100Service);

The100Service.$inject = ['$http'];

var the100endpoint = $DRS_100_ENDPOINT;

function The100Service($http) {

    const service = {
        scrapeGamertags: scrapeGamertags,
    };
    return service;

    function scrapeGamertags(gameId) {
        const url = the100endpoint + gameId;

        return $http.get(url).then(function (data) {
            return data.data;
        }).catch(function (data) {
            console.error(data)
        });
    }
}
