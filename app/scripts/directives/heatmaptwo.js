'use strict';

/**
 * @ngdoc directive
 * @name pisaVisualisationApp.directive:heatMap
 * @description
 * # heatMap
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

            var margin = { top: 50, right: 0, bottom: 100, left: 30 },
              width = 960 - margin.left - margin.right,
              height = 430 - margin.top - margin.bottom,
              gridSize = Math.floor(width / 24),
              legendElementWidth = gridSize*2,
              buckets = 9,
              colors = ['#A0CAA0', '#66C266', '#007A00', '#005C00', '#003D00', '#001F00'],
              expectations = ["ISCED L3A", "ISCED L4", "ISCED L5B", "ISCED L5A,6"],
            //times = ["1a", "2a", "3a", "4a", "5a", "6a", "7a", "8a", "9a", "10a", "11a", "12a", "1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "9p", "10p", "11p", "12p"];
              times = [ "Less than <$A>", "<$A> or more but less than <$B>", "<$B> or more but less than <$C>", "<$C> or more but less than <$D>", "<$D> or more but less than <$E>", "<$E> or more"];
            var svg = d3.select("#chart").append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            var dayLabels = svg.selectAll(".dayLabel")
              .data(expectations)
              .enter().append("text")
              .text(function (d) { return d; })
              .attr("x", 0)
              .attr("y", function (d, i) { return i * gridSize; })
              .style("text-anchor", "end")
              .attr("transform", "translate(-6," + gridSize / 1.5 + ")");
            //.attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"); });

            var timeLabels = svg.selectAll(".timeLabel")
              .data(times)
              .enter().append("text")
              .text(function(d) { return d; })
              .attr("x", function(d, i) { return i * gridSize; })
              .attr("y", 0)
              .style("text-anchor", "middle")
              .attr("transform", "translate(" + gridSize / 2 + ", -6)")
              .attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); })

            var heatmapChart = function(tsvFile) {
              d3.tsv(tsvFile, function(d) {
                  return {
                    expectation: + d.expectation,
                    salary: + d.salary,
                    frequency: + d.frequency
                  };
                },
                function(error, data) {
                  var colorScale = d3.scale.quantile()
                    .domain([0, buckets - 1, d3.max(data, function (d) { return d.frequency; })])
                    .range(colors);

                  var cards = svg.selectAll(".hour")
                    .data(data, function(d) {return d.expectation+':'+d.salary;});

                  cards.append("title");

                  cards.enter().append("rect")
                    .attr("x", function(d) { return (d.salary - 1) * gridSize; })
                    .attr("y", function(d) { return (d.expectation - 1) * gridSize; })
                    .attr("rx", 4)
                    .attr("ry", 4)
                    .attr("class", "hour bordered")
                    .attr("width", gridSize)
                    .attr("height", gridSize)
                    .style("fill", colors[0]);

                  cards.transition().duration(1000)
                    .style("fill", function(d) { return colorScale(d.frequency); });

                  cards.select("title").text(function(d) { return d.frequency; });

                  cards.exit().remove();

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
