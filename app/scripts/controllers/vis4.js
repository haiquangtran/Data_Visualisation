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
    $scope.barData = fileService.getFileNameTotalParentsExpectations;
    $scope.parentExpectationsFile = fileService.getFileNameTotalParentsExpectations;

    // Set dataset when button clicked
    $scope.setDataset = function() {
      $scope.heatData = fileService.getFileNameTotalParentsExpectations;
    }
  });
