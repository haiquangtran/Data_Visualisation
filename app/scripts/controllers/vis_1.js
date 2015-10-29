'use strict';

/**
 * @ngdoc function
 * @name pisaVisualisationApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the pisaVisualisationApp
 */
angular.module('pisaVisualisationApp')
  .controller('Vis1Ctrl', function ($scope, fileService) {
    $scope.myData = fileService.getParentsExpectationsFileName;
  });
