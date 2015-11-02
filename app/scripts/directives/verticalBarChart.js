/**
 * @ngdoc directive
 * @name pisaVisualisationApp.directive:verticalBarChart
 * @description
 * # verticalBarChart
 */
angular.module('pisaVisualisationApp')
  .directive('verticalBarChart', ['d3Service', function(d3Service) {
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
          };

          scope.$watch('data', function(fileName) {
            if (!fileName) {
              return;
            }

            // Parent's expectations
            var qualifications = [0,0,0,0, 0,0,0,0];

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

                return d;
              });

              var barWidth = 40;
              var w = qualifications.length * barWidth;
              var h = 200;

              //Create SVG element
              var svg = d3.select(element[0])
                .append("svg")
                .attr("width", w)
                .attr("height", h)
                .style("background-color", "red");

              // create bars
              svg.selectAll("rect")
                .data(qualifications)
                .enter()
                .append("rect")
                .attr("x", function(d, i) {
                  return barWidth * (i);
                })
                .attr("y", function(d) {
                  return h - (d/300);
                })
                .attr("width", barWidth)
                .transition().ease("elastic")
                .attr("height", function(d) {
                  return  d/300;
                })
                .attr("fill", "yellow");
            });
          });

        });
      }};
  }]);
