'use strict';

/**
 * @ngdoc function
 * @name pisaVisualisationApp.controller:Vis2Ctrl
 * @description
 * # Vis2Ctrl
 * Controller of the pisaVisualisationApp
 */
angular.module('pisaVisualisationApp')
  .controller('Vis2Ctrl', function ($scope, fileService) {
      $scope.myData = fileService.getRawDataFile;
  });
