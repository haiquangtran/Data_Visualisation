'use strict';

/**
 * @ngdoc directive
 * @name pisaVisualisationApp.directive:verticalBarChart
 * @description
 * # verticalBarChart
 */
angular.module('pisaVisualisationApp')
  .directive('verticalBarChart', function (d3Service, preprocessorHelper) {
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

            var colours = ['#A0CAA0', '#66C266', '#007A00', '#005C00', '#003D00', '#001F00'];
            var margin = { top: 0, right: 10, bottom: 100, left: 10 };
            var barWidth = 15;
            var height = 200;
            var width = 500;

            var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

            var y = d3.scale.linear().range([height, 0]);

            var xAxis = d3.svg.axis()
              .scale(x)
              .orient("bottom")
              .ticks(10);

            var yAxis = d3.svg.axis()
              .scale(y)
              .orient("left")
              .ticks(10);

            var barChart = function(fileName) {
              d3.csv(fileName, function(d) {
                return {
                  expectation: d.expectation,
                  salary: d.salary,
                  frequency: parseInt(d.frequency)
                };
              }, function(error, data) {

                x.domain(data.map(function(d) { return d.frequency; }));
                y.domain([0, d3.max(data, function(d) { return d.frequency; })]);

                //Create SVG element
                var svg = d3.select(".chartBackdrop").append("svg")
                  .attr("width", 50 + "%")
                  .attr("height", height + margin.top + margin.bottom)
                  .style("background-color", "dark-grey")
                  .append("g")
                  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                // X Axis
                svg.append("g")
                  .attr("class", "x axis")
                  .attr("transform", "translate(0," + height + ")")
                  .call(xAxis)
                  .selectAll("text")
                  .style("text-anchor", "end")
                  .attr("dx", "-.8em")
                  .attr("dy", "-.55em")
                  .attr("transform", "rotate(-90)" );

                // Y Axis
                svg.append("g")
                  .attr("class", "y axis")
                  .call(yAxis)
                  .append("text")
                  .attr("transform", "rotate(-90)")
                  .attr("y", 6)
                  .attr("dy", ".71em")
                  .style("text-anchor", "end")
                  .text("Value ($)");

                // create bars
                var bars = svg.selectAll("rect")
                  .data(data).enter().append("rect");

                bars.attr("x", function(d, i) {
                  return margin.left + barWidth * (i);
                }).attr("y", function(d) {
                  return height - (d.frequency/10);
                }).attr("width", barWidth)
                  .transition().ease("elastic")
                  .attr("height", function(d) {
                    return (d.frequency/10);
                  })
                  .attr("fill", function(d,i) {
                    return colours[i % colours.length];
                  });

                // TODO: put into service or directive
                // Tool Tip
                var tooltip = d3.select("body")
                  .append("div")
                  .style("position", "absolute")
                  .style("z-index", "1")
                  .style("visibility", "hidden")
                  .style("width", "200px")
                  .style("height", "100px")
                  .style("background", "rgba(255,255, 255,0.8)")
                  .style("text-align", "center");

                // Hover
                bars.on("mouseover", function(d, i) {
                  d3.select(this).classed('selected', true);
                  // Hover Text
                  var popUpText = "Frequency:" + d.frequency + " Parent's Income: " + d.salary + " Parent's Expectations: " + d.expectation;
                  tooltip.text(popUpText);
                  tooltip.style("visibility", "visible");
                }).on("mousemove", function() {
                  return tooltip.style("top" , (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
                }).on("mouseout", function(d, i) {
                  d3.select(this).classed('selected', false);
                  tooltip.style("visibility", "hidden");
                });
              });
            };

            barChart(fileName);

          });
        });
      }
    };
  });
