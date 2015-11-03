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
    $scope.barData = fileService.getHeatMapTwoFileName;
    $scope.parentExpectationsFile = fileService.getHeatMapTwoFileName;

    // Set dataset when button clicked
    $scope.setDataset = function() {
      $scope.heatData = fileService.getHeatMapTwoFileName;
    }
  });
