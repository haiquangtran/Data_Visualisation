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

          function addTo(array, arrayIndex, question, data, answer) {
            if (data[question] === answer) {
              array[arrayIndex]++;
            }
          }

          scope.$watch('data', function(fileName) {
            if (!fileName) {
              return;
            }

            // Parent's expectations
            var qualifications = [0,0,0,0, 0,0,0,0];
            var salary = [0,0,0,0,0,0];
            var expectations = [0,0,0,0,0,0];

            var colourScheme = ["#A0CAA0", "#66C266", "#007A00", "#005C00"];

            d3.csv(fileName, function (data) {
              data.forEach(function (d) {
                var answer = "Yes";

                // Father
                addTo(qualifications, 0, "PA03Q01", d, answer);
                addTo(qualifications, 1, "PA03Q02", d, answer);
                addTo(qualifications, 2, "PA03Q03", d, answer);
                addTo(qualifications, 3, "PA03Q04", d, answer);

                // Mothers
                addTo(qualifications, 4, "PA05Q01", d, answer);
                addTo(qualifications, 5, "PA05Q02", d, answer);
                addTo(qualifications, 6, "PA05Q03", d, answer);
                addTo(qualifications, 7, "PA05Q04", d, answer);

                // Salary
                addTo(salary, 0, "PA07Q01", d, "Less than <$A>");
                addTo(salary, 1, "PA07Q01", d, "<$A> or more but less than <$B>");
                addTo(salary, 2, "PA07Q01", d, "<$B> or more but less than <$C>");
                addTo(salary, 3, "PA07Q01", d, "<$C> or more but less than <$D>");
                addTo(salary, 4, "PA07Q01", d, "<$D> or more but less than <$E>");
                addTo(salary, 5, "PA07Q01", d, "<$E> or more");

                var tick = "Tick";

                // Expectations
                addTo(expectations, 0, "PA19Q01", d, tick);
                addTo(expectations, 1, "PA19Q02", d, tick);
                addTo(expectations, 2, "PA19Q03", d, tick);
                addTo(expectations, 3, "PA19Q04", d, tick);
                addTo(expectations, 4, "PA19Q05", d, tick);
                addTo(expectations, 5, "PA19Q06", d, tick);

                return d;
              });

              console.log(qualifications);
              console.log(salary);
              console.log(expectations);

              var graphQualifications = d3.select(element[0]);

              // Frequency of parents qualifications
              graphQualifications.append("div").attr("class", "chartBackdrop")
                .selectAll('div')
                .data(qualifications).enter().append("div")
                .transition().ease("elastic")
                .style("width", function(d) { return d/1000 + "%"; })
                .style("background-color", function(d, i) { return "yellow";})
                .style("color", "black")
                .text(function(d) { return d + " freq"; });

              var graphExpectations = d3.select(element[0]);

              // Frequency of parents expectations
              graphExpectations.append("div")
                .attr("class", "chartBackdrop")
                .selectAll('div')
                .data(expectations).enter().append("div")
                .transition().ease("elastic")
                .style("width", function(d) { return d/1000 + "%"; })
                .style("background-color", function(d, i) { return "orange";})
                .style("color", "white")
                .text(function(d) { return d + " freq"; });

              var graphSalary = d3.select(element[0]);

              // Frequency of parents salary
              graphSalary.append("div")
                .attr("class", "chartBackdrop")
                .selectAll('div')
                .data(salary).enter().append("div")
                .transition().ease("elastic")
                .style("width", function(d) { return d/1000 + "%"; })
                .style("background-color", function(d, i) { return "black";})
                .style("color", "white")
                .text(function(d) { return d + " freq"; });
            });
          });

        });
      }};
  }]);
