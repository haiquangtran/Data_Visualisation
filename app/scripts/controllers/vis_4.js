'use strict';

/**
 * @ngdoc function
 * @name pisaVisualisationApp.controller:Vis4Ctrl
 * @description
 * # Vis4Ctrl
 * Controller of the pisaVisualisationApp
 */
angular.module('pisaVisualisationApp')
  .controller('Vis4Ctrl', function ($scope, fileService) {
    $scope.myData = fileService.getHeatMapTwoFileName;

    // Set dataset when button clicked
    $scope.setDataset = function() {
      $scope.myData = fileService.getHeatMapTwoFileName;
    }
  });
