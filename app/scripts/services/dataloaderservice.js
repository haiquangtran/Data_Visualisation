'use strict';

/**
 * @ngdoc service
 * @name pisaVisualisationApp.dataLoaderService
 * @description
 * # dataLoaderService
 * Factory in the pisaVisualisationApp.
 */
angular.module('pisaVisualisationApp')
  .factory('dataLoaderService', function ($http) {

    function loadFile1() {
      return $http.get('data/miserables.json');
    };

    function loadFile2() {
      return $http.get('data/pm25.json');
    }

    // Public API here
    return {
      getForceMapData: loadFile1(),
      getHeatMapData: loadFile2()
    };
  });

