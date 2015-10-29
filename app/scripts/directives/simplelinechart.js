'use strict';

/**
 * @ngdoc directive
 * @name pisaVisualisationApp.directive:simpleLineChart
 * @description
 * # simpleLineChart
 */
angular.module('pisaVisualisationApp')
  .directive('simpleLineChart', ['d3Service', function(d3Service) {
    return {
      restrict: 'E',
      replace: false,
      scope: {data: '=chartData'},
      link: function(scope, element, attrs) {
        d3Service.d3().then(function(d3) {

          scope.$watch('data', function(fileName) {
            if (!fileName) {
              return;
            }

            d3.csv(fileName, function (data) {
              console.log(data);

              data.forEach(function (d) {
                return d;
              });
            });
          });

        });
      }};
  }]);
