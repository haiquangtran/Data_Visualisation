'use strict';

/**
 * @ngdoc directive
 * @name pisaVisualisationApp.directive:horizontalBarChart
 * @description
 * # horizontalBarChart
 */
angular.module('pisaVisualisationApp')
  .directive('horizontalBarChart', ['d3Service', 'queryService', function(d3Service, queryService) {
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

            // Parent's expectations
            var qualifications = [0,0,0,0, 0,0,0,0];
            var salary = [0,0,0,0,0,0];
            var expectations = [0,0,0,0,0,0];
            var heatMap =
              [ 0,0,0,0,0,0, // lv2
                0,0,0,0,0,0, // lv3B or C
                0,0,0,0,0,0, // lv 3A
                0,0,0,0,0,0, // lv4
                0,0,0,0,0,0, // lv5B
                0,0,0,0,0,0 ]; // lv5A, or 6

            var colourScheme = ["#A0CAA0", "#66C266", "#007A00", "#005C00"];

            d3.csv(fileName, function (data) {
              data.forEach(function (d) {
                var answer = "Yes";

                // Father
                queryService.addTo(qualifications, 0, "PA03Q01", d, answer); //lv5A,6
                queryService.addTo(qualifications, 1, "PA03Q02", d, answer); //lv 5B
                queryService.addTo(qualifications, 2, "PA03Q03", d, answer); //lv 4
                queryService.addTo(qualifications, 3, "PA03Q04", d, answer); //lv 3A

                // Mothers
                queryService.addTo(qualifications, 4, "PA05Q01", d, answer); //lv5A,6
                queryService.addTo(qualifications, 5, "PA05Q02", d, answer); //lv 5B
                queryService.addTo(qualifications, 6, "PA05Q03", d, answer); //lv 4
                queryService.addTo(qualifications, 7, "PA05Q04", d, answer); //lv 3A

                // Salary
                queryService.addTo(salary, 0, "PA07Q01", d, "Less than <$A>");
                queryService.addTo(salary, 1, "PA07Q01", d, "<$A> or more but less than <$B>");
                queryService.addTo(salary, 2, "PA07Q01", d, "<$B> or more but less than <$C>");
                queryService.addTo(salary, 3, "PA07Q01", d, "<$C> or more but less than <$D>");
                queryService.addTo(salary, 4, "PA07Q01", d, "<$D> or more but less than <$E>");
                queryService.addTo(salary, 5, "PA07Q01", d, "<$E> or more");

                var tick = "Tick";

                // Expectations
                queryService.addToExpectations(expectations, d, tick);
                queryService.addToHeatMap(heatMap, d, tick);

                //queryService.addTo(expectationsTwo, 0, "PA19Q01", d, tick); // lv2
                //queryService.addTo(expectationsTwo, 1, "PA19Q02", d, tick); // lv3B or C
                //queryService.addTo(expectationsTwo, 2, "PA19Q03", d, tick); // lv 3A
                //queryService.addTo(expectationsTwo, 3, "PA19Q04", d, tick); // lv4
                //queryService.addTo(expectationsTwo, 4, "PA19Q05", d, tick); // lv5B
                //queryService.addTo(expectationsTwo, 5, "PA19Q06", d, tick); // lv5A, or 6

                return d;
              });
              //
              //console.log("qualifications " + qualifications);
              //console.log("salary " + salary);
              //console.log("expectations " + expectations);
              //console.log("heatmap " + heatMap);

              var graphQualifications = d3.select(element[0]);

              // Frequency of parents qualifications
              graphQualifications.append("div").attr("class", "backDrop")
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
                .attr("class", "backDrop")
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
                .attr("class", "backDrop")
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
