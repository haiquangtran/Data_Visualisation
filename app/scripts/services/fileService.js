'use strict';

/**
 * @ngdoc service
 * @name pisaVisualisationApp.fileService
 * @description
 * # fileService
 * Factory in the pisaVisualisationApp.
 */
angular.module('pisaVisualisationApp')
  .factory('fileService', function ($http, $q) {
    var dir = "data/";

    /* Load Data from Files */

    function loadFile1() {
      return $http.get(dir + 'miserables.json');
    };

    function loadFile2() {
      return $http.get(dir + 'pm25.json');
    }

    function loadFile3() {
      return $http.get(dir + 'raw_data.csv');
    }

    /* Get the name of CSV files */

    function getFileName1() {
      return dir + "raw_data.csv";
    }


    // Public API here
    return {
      getForceMapData: loadFile1(),
      getHeatMapData: loadFile2(),
      getStackedBarData: loadFile3(),
      getRawDataFile: getFileName1()
    };
  });

