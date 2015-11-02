'use strict';

/**
 * @ngdoc directive
 * @name pisaVisualisationApp.directive:heatMapTwo
 * @description
 * # heatMapTwo
 */
angular.module('pisaVisualisationApp')
  .directive('heatMapTwo', function (d3Service) {
    return {
      restrict: 'E',
      replace: false,
      scope: {data: '=chartData'},
      link: function postLink(scope, element, attrs) {
        d3Service.d3().then(function(d3) {

          scope.$watch('data', function(fileName) {
            if (!fileName) {
              return;
            }

            var margin = { top: 50, right: 0, bottom: 100, left: 90 },
              width = 960 - margin.left - margin.right,
              height = 320 - margin.top - margin.bottom,
              gridSize = Math.floor(width / 24),
              legendElementWidth = gridSize*3,
              buckets = 9,
              colors = ['#A0CAA0', '#66C266', '#007A00', '#005C00', '#003D00', '#001F00'],
              expectations = ["ISCED L3A", "ISCED L4", "ISCED L5B", "ISCED L5A,6"],
              times = [ "< <$A>", "<$A> < <$B>", "<$B> < <$C>", "<$C> < <$D>", "<$D> < <$E>", "<$E>+"];
            var svg = d3.select(".chartBackdrop").append("svg")
              .attr("width", width + margin.left + margin.right + "%")
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            // X Axis
            var timeLabels = svg.selectAll(".timeLabel")
              .data(times)
              .enter().append("text")
              .text(function(d) { return d; })
              .attr("x", function(d, i) { return i * (gridSize*3); })
              .attr("y", 0)
              .style("text-anchor", "middle")
              .attr("transform", "translate(" + gridSize + ", -6)");

            // Y Axis
            var dayLabels = svg.selectAll(".dayLabel")
              .data(expectations)
              .enter().append("text")
              .text(function (d) { return d; })
              .attr("x", 0)
              .attr("y", function (d, i) { return i * gridSize; })
              .style("text-anchor", "end")
              .attr("transform", "translate(-6," + gridSize / 1.5 + ")");

            // Heat Map
            var heatmapChart = function(tsvFile) {
              d3.tsv(tsvFile, function(d) {
                return {
                  expectation: + d.expectation,
                  salary: + d.salary,
                  frequency: + d.frequency
                };
              },  function(error, data) {
                var colorScale = d3.scale.quantile()
                  .domain([0, buckets - 1, d3.max(data, function (d) { return d.frequency; })])
                  .range(colors);

                var heatRects = svg.selectAll(".hour")
                  .data(data, function(d) {return d.expectation +':'+d.salary;});

                heatRects.append("title");

                heatRects.enter().append("rect")
                  .attr("x", function(d) { return (d.salary - 1) * gridSize*3; })
                  .attr("y", function(d) { return (d.expectation - 1) * gridSize; })
                  .attr("rx", 4)
                  .attr("ry", 4)
                  .attr("class", "hour bordered")
                  .attr("width", gridSize*3)
                  .attr("height", gridSize)
                  .style("fill", colors[0]);

                heatRects.transition().duration(1000)
                  .transition().ease("elastic")
                  .style("fill", function(d) { return colorScale(d.frequency); });

                heatRects.select("title").text(function(d) { return d.frequency; });

                heatRects.exit().remove();


                // Draw legend
                var legend = svg.selectAll(".legend")
                  .data([0].concat(colorScale.quantiles()), function(d) { return d; });

                legend.enter().append("g")
                  .attr("class", "legend");

                legend.append("rect")
                  .attr("x", function(d, i) { return legendElementWidth * i; })
                  .attr("y", height)
                  .attr("width", legendElementWidth)
                  .attr("height", gridSize / 2)
                  .style("fill", function(d, i) { return colors[i]; });

                legend.append("text")
                  .attr("class", "mono")

                  .text(function(d) { return "≥ " + Math.round(d); })
                  .attr("x", function(d, i) { return legendElementWidth * i; })
                  .attr("y", height + gridSize);

                legend.exit().remove();

              });
            };

            heatmapChart(fileName);

          });
        });
      }
    };
  });
