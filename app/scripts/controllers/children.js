'use strict';

/**
 * @ngdoc function
 * @name pisaVisualisationApp.controller:ChildrenCtrl
 * @description
 * # ChildrenCtrl
 * Controller of the pisaVisualisationApp
 */
angular.module('pisaVisualisationApp')
  .controller('ChildrenCtrl', function ($scope, fileService) {
    $scope.parentQualificationsFile = fileService.getFileNameTotalParentsQualifications;
    // Default values
    $scope.selectedSalary = "Less than <$A>";
    $scope.selectedExpectation = "ISCED lv2";
    $scope.parentTotalExpectationsFile = fileService.getFileNameTotalParentsExpectations;
    // TODO: real data
    $scope.rawFile = fileService.getFileNameRaw;
    $scope.test = fileService.test;

    // Set selected values from heat map when button clicked
    $scope.setSelected = function(salary, expectation) {
      $scope.selectedSalary = salary;
      $scope.selectedExpectation = expectation;
      $scope.$apply();
      console.log($scope.selectedSalary);
      console.log($scope.selectedExpectation);
    }
  });
