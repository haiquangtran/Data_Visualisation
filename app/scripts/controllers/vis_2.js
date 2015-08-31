'use strict';

/**
 * @ngdoc function
 * @name pisaVisualisationApp.controller:Vis2Ctrl
 * @description
 * # Vis2Ctrl
 * Controller of the pisaVisualisationApp
 */
angular.module('pisaVisualisationApp')
  .controller('Vis2Ctrl', function ($scope, $http, d3Service) {
    d3Service.d3().then(function(d3) {
      $scope.width = 500;
      $scope.height = 500;

      var color = d3.scale.category20();

      var force = d3.layout.force()
        .charge(-120)
        .linkDistance(30)
        .size([$scope.width, $scope.height]);

      $http.get('data/miserables.json').success(function (graph) {
        $scope.nodes = graph.nodes;
        $scope.links = graph.links;

        for (var i = 0; i < $scope.links.length; i++) {
          $scope.links[i].strokeWidth = Math.round(Math.sqrt($scope.links[i].value))
        }

        for (var i = 0; i < $scope.nodes.length; i++) {
          $scope.nodes[i].color = color($scope.nodes[i].group)
        }

        force
          .nodes($scope.nodes)
          .links($scope.links)
          .on("tick", function () {
            $scope.$apply()
          })
          .start();
      })
    });

  });
