'use strict';

/**
 * @ngdoc function
 * @name pisaVisualisationApp.controller:Vis4Ctrl
 * @description
 * # Vis4Ctrl
 * Controller of the pisaVisualisationApp
 */
angular.module('pisaVisualisationApp')
  .controller('Vis4Ctrl', function ($http, $scope) {

    $http.get('data/pm25.json').then(function(response){
      // your API would presumably be sending new data, not the same
      // data each time!
      var data = response.data;
      $scope.myData = data;
    }, function(err){
      throw err;
    });

  });
