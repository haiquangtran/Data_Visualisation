'use strict';

/**
 * @ngdoc function
 * @name pisaVisualisationApp.controller:Vis3Ctrl
 * @description
 * # Vis3Ctrl
 * Controller of the pisaVisualisationApp
 */
angular.module('pisaVisualisationApp')
  .controller('Vis3Ctrl', function ($scope, fileService) {
    $scope.myData = [10,20,30,40,60];
    $scope.test = fileService.test;

    // Default values
    $scope.selectedSalary = "Less than <$A>";
    $scope.selectedExpectation = "ISCED lv2";
    $scope.parentTotalExpectationsFile = fileService.getFileNameTotalParentsExpectations;
    $scope.parentExpectationsFile = fileService.getFileNameParentsExpectations;
  });
