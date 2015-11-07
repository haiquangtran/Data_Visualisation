'use strict';

/**
 * @ngdoc directive
 * @name pisaVisualisationApp.directive:trendChart
 * @description
 * # trendChart
 */
angular.module('pisaVisualisationApp')
  .directive('areaChart', function (d3Service, toolTipService) {
    return {
      restrict: 'E',
      replace: false,
      scope: {
        data: '=chartData',
        // For filtering
        selectedSalary: '=selectedSalary',
        selectedExpectation: '=selectedExpectation'
      },
      link: function postLink(scope, element, attrs) {
        d3Service.d3().then(function(d3) {

          var margin = {top: 20, right: 20, bottom: 30, left: 50},
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

          var parseDate = d3.time.format("%d-%b-%y").parse;

          var x = d3.time.scale()
            .range([0, width]);

          var y = d3.scale.linear()
            .range([height, 0]);

          var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

          var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

          var area = d3.svg.area()
            .x(function(d) { return x(d.date); })
            .y0(height)
            .y1(function(d) { return y(d.close); });

          var svg = d3.select(".chartBack").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          var areaChart = function(fileName, selectedExpectation, selectedSalary) {
            d3.csv(fileName, function(error, data) {
              if (error) throw error;

              data.forEach(function(d) {
                d.date = parseDate(d.date);
                d.close = +d.close;
              });

              x.domain(d3.extent(data, function(d) { return d.date; }));
              y.domain([0, d3.max(data, function(d) { return d.close; })]);

              svg.append("path")
                .datum(data)
                .attr("class", "area")
                .attr("d", area);

              svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

              svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Price ($)");

              //
              //return {
              //  expectation: d.expectation,
              //  salary: d.salary,
              //  motherQualification: d.motherQualification,
              //  motherFrequency: parseInt(d.motherFrequency),
              //  fatherQualification: d.fatherQualification,
              //  fatherFrequency: parseInt(d.fatherFrequency)
              //};
              //}
              //, function(error, data) {

            });
          };

          scope.$watchGroup(['data', 'selectedExpectation', 'selectedSalary'], function(newValues, oldValues, scope) {
            var fileName = newValues[0];
            var selectedExpectation = newValues[1];
            var selectedSalary = newValues[2];

            if (!fileName) {
              return;
            }

            if (selectedSalary != oldValues[2] || selectedExpectation != oldValues[1]) {
              //areaChart(fileName, selectedExpectation, selectedSalary);
            } else {
              areaChart(fileName, selectedExpectation, selectedSalary);
            }
          });
        });
      }
    };
  });
