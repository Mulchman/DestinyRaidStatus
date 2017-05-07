import angular from 'angular';

angular
    .module('drsApp')
    .factory('The100Service', The100Service);

The100Service.$inject = ['$q', '$http', '$sce'];

var the100endpoint = $DRS_100_ENDPOINT;

function The100Service($q, $http, $sce) {

    const service = {
        scrapeGamertags: scrapeGamertags,
    };
    return service;


    function scrapeGamertags(gameId) {

        var url = the100endpoint + gameId;

        const p = $q.defer();

        return $http.get(url).then(function (data) {
            return data.data;
        }).catch(function (data) {
            console.error(data)
        });
    }
}
