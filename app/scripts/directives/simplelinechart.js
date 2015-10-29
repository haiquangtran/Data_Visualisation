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
              var fatherQualifications = [0,0,0,0];

              data.forEach(function (d) {
                if (d["PA03Q01"] === "Yes") {
                  fatherQualifications[0]++;
                }
                if (d["PA03Q02"] === "Yes") {
                  fatherQualifications[1]++;
                }
                if (d["PA03Q03"] === "Yes") {
                  fatherQualifications[2]++;
                }
                if (d["PA03Q04"] === "Yes") {
                  fatherQualifications[3]++;
                }
                return d;
              });

              console.log(fatherQualifications);
              var chart = d3.select(element[0]);
              chart.append("div").attr("class", "chart")
                .selectAll('div')
                .data(fatherQualifications).enter().append("div")
                .transition().ease("elastic")
                .style("width", function(d) { return d/1000 + "%"; })
                .text(function(d) { return d + "%"; });

            });
          });

        });
      }};
  }]);
