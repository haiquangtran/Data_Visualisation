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
    $scope.selectedExpectation = "ISCED lv2";
    $scope.parentTotalExpectationsFile = fileService.getFileNameTotalParentsExpectations;
    $scope.schoolFeelingsFile = fileService.getFileNameSchoolFeelings_l2;
    // TODO: real data
    $scope.rawFile = fileService.getFileNameRaw;
    $scope.test = fileService.test;

    // Set selected values from heat map when button clicked
    $scope.setSelected = function(expectation) {
      $scope.selectedExpectation = expectation;
      //$scope.$apply();
    }

    //TODO: BAD move to controller
    var expectations = ["ISCED lv2", "ISCED lv3B,C", "ISCED lv3A", "ISCED lv4", "ISCED lv5B", "ISCED lv5A,6"];
    var expectationsDataset = [fileService.getFileNameSchoolFeelings_l2, fileService.getFileNameSchoolFeelings_l3,
      fileService.getFileNameSchoolFeelings_l3A, fileService.getFileNameSchoolFeelings_l4, fileService.getFileNameSchoolFeelings_l5B,
      fileService.getFileNameSchoolFeelings_l6];

    $scope.switchDataset = function(selectedExpectation) {

      for (var i = 0; i < expectations.length; i++) {
        if (expectations[i] === selectedExpectation) {
          $scope.schoolFeelingsFile = expectationsDataset[i];
          return;
        }
      }
    };
  });
