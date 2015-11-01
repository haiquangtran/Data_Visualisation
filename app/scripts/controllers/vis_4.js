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
    //fileService.getHeatMapData.success(function (response) {
    //  $scope.myData = response;
    //});
    $scope.myData = fileService.getParentsExpectationsFileName;
  });
