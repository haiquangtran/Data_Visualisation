'use strict';

/**
 * @ngdoc function
 * @name pisaVisualisationApp.controller:Vis4Ctrl
 * @description
 * # Vis4Ctrl
 * Controller of the pisaVisualisationApp
 */
angular.module('pisaVisualisationApp')
  .controller('Vis4Ctrl', function ($http, $scope, dataLoaderService) {
    dataLoaderService.getHeatMapData.success(function (response) {
      $scope.myData = response;
    });

  });
