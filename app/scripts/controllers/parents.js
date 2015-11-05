'use strict';

/**
 * @ngdoc function
 * @name pisaVisualisationApp.controller:ParentsCtrl
 * @description
 * # ParentsCtrl
 * Controller of the pisaVisualisationApp
 */
angular.module('pisaVisualisationApp')
  .controller('ParentsCtrl', function ($scope, fileService) {
    $scope.parentQualificationsFile = fileService.getFileNameTotalParentsQualifications;
    // Default values
    $scope.selectedSalary = "Less than <$A>";
    $scope.selectedExpectation = "ISCED lv2";
    $scope.parentExpectationsFile = fileService.getFileNameTotalParentsExpectations;


    // Set selected values from heat map when button clicked
    $scope.setSelected = function(salary, expectation) {
      $scope.selectedSalary = salary;
      $scope.selectedExpectation = expectation;
      $scope.$apply();
      console.log($scope.selectedSalary);
      console.log($scope.selectedExpectation);
    }
  });
