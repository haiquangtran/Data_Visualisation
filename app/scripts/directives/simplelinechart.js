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

          function addTo(array, arrayIndex, question, data) {
            if (data[question] === "Yes") {
              array[arrayIndex]++;
            }
          }
          scope.$watch('data', function(fileName) {
            if (!fileName) {
              return;
            }

            d3.csv(fileName, function (data) {
              var qualifications = [0,0,0,0,0,0,0,0];
              var expectations = [0, 0, 0, 0, 0, 0];
              //PA19Q01, PA19Q02, PA19Q03, PA19Q04, PA19Q05, PA19Q06


              data.forEach(function (d) {
                // Father
                addTo(qualifications, 0, "PA03Q01", d);
                addTo(qualifications, 1, "PA03Q02", d);
                addTo(qualifications, 2, "PA03Q03", d);
                addTo(qualifications, 3, "PA03Q04", d);

                // Mothers
                addTo(qualifications, 4, "PA05Q01", d);
                addTo(qualifications, 5, "PA05Q02", d);
                addTo(qualifications, 6, "PA05Q03", d);
                addTo(qualifications, 7, "PA05Q04", d);

                // Expectations
                addTo(expectations, 0, "PA19Q01", d);


                return d;
              });

              console.log(qualifications);
              console.log("Expectations: " + expectations);
              var chart = d3.select(element[0]);
              chart.append("div").attr("class", "chart")
                .selectAll('div')
                .data(qualifications).enter().append("div")
                .transition().ease("elastic")
                .style("width", function(d) { return d/1000 + "%"; })
                .style("background-color", "#003D00")
                .style("color", "white")
                .text(function(d) { return d + " freq"; });
            });
          });

        });
      }};
  }]);
