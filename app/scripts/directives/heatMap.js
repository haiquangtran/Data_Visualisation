'use strict';

/**
 * @ngdoc directive
 * @name pisaVisualisationApp.directive:heatMap
 * @description
 * # heatMap
 */
angular.module('pisaVisualisationApp')
  .directive('heatMap', function (d3Service, preprocessorService) {
    return {
      restrict: 'E',
      replace: false,
      scope: {
        data: '=chartData',
        onClickEvent: '&ngClick'
      },
      link: function postLink(scope, element, attrs) {
        d3Service.d3().then(function(d3) {

          var margin = { top: 50, right: 0, bottom: 100, left: 190 },
          // TODO: do not hardcode height and width values
            width = 960 - margin.left - margin.right,
            height = 450 - margin.top - margin.bottom,
            gridSize = Math.floor(width / 24),
            gridHeight = 1.4 * gridSize,
            gridWidth = 3.5 * gridSize,
            legendElementWidth = gridWidth,
            colours = ['#A0CAA0', '#66C266', '#007A00', '#005C00', '#003D00', '#001F00'],
            expectations = ["ISCED L2", "ISCED L3B,C", "ISCED L3A", "ISCED L4", "ISCED L5B", "ISCED L5A,6"],
            qualifications = ["None", "ISCED L3A", "ISCED L4", "ISCED L5B", "ISCED L5A,6"],
            salary = [ "< $40k", "$40k < $55k", "$50k < $70k", "$70k < $85k", "$85k < $100k", "$100k+"];

          var svg = d3.select(".chartBackdrop").append("svg")
            .attr("id", "heatMapCanvas")
            .attr("width", 100 + "%")
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          // X Axis Title
          svg.append("text")
            .attr("x", (width / 2) - 120)
            .attr("y", -(margin.top / 2))
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .text("Parent's Income (Dollars)");

          // Y Axis Title
          svg.append("text")
            .attr("x", 20)
            .attr("y", height/2)
            .attr("text-anchor", "end")
            .style("font-size", "16px")
            .attr("transform", "rotate(270, " + (-margin.left + 90) + "," + (height/2) +  ")")
            .text("Parent's Expectations (Education Lvl)");

          // X Axis Labels
          var timeLabels = svg.selectAll(".timeLabel")
            .data(salary)
            .enter().append("text")
            .text(function(d) { return d; })
            .attr("x", function(d, i) { return i * (gridWidth); })
            .attr("y", 0)
            .style("text-anchor", "middle")
            .attr("transform", "translate(" + gridSize + ", -6)");

          // Y Axis Labels
          var dayLabels = svg.selectAll(".dayLabel")
            .data(expectations)
            .enter().append("text")
            .text(function (d) { return d; })
            .attr("x", 0)
            .attr("y", function (d, i) { return i * gridHeight; })
            .style("text-anchor", "end")
            .attr("transform", "translate(-6," + gridHeight / 1.5 + ")");

          scope.$watch('data', function(fileName) {
            if (!fileName) {
              return;
            }

            // Heat Map
            var heatmapChart = function(fileName) {
              d3.csv(fileName, function(d) {
                return {
                  expectation: preprocessorService.getIndexFromParentExpectations(d.expectation),
                  salary: preprocessorService.getIndexFromParentExpectations(d.salary),
                  frequency: parseInt(d.frequency)
                };
              }, function(error, data) {
                // total
                var total = d3.sum(data, function(d) {
                  return d.frequency;
                });
                // Min and Max
                var minFreq = d3.min(data, function (d) {
                  return d.frequency;
                }), maxFreq = d3.max(data, function (d) {
                  return d.frequency;
                });

                var colorScale = d3.scale.quantile()
                  .domain([minFreq, maxFreq])
                  .range(colours);

                var heatRects = svg.selectAll(".hour")
                  .data(data, function(d) {return d.expectation +':'+d.salary;});

                heatRects.append("title");

                // Heat map rects
                heatRects.enter().append("rect")
                  .attr("x", function(d) { return (d.salary) * gridWidth; })
                  .attr("y", function(d) { return (d.expectation) * gridHeight; })
                  .attr("rx", 4)
                  .attr("ry", 4)
                  .attr("class", "bordered")
                  .attr("width", gridWidth)
                  .attr("height", gridHeight)
                  .attr("background-color", colours[0]);

                heatRects.transition().duration(1000)
                  .transition().ease("elastic")
                  .attr("fill", function(d) { return colorScale(d.frequency); });
                heatRects.select("title").text(function(d) { return d.frequency; });
                heatRects.exit().remove();

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
                heatRects.on("mouseover", function(d, i) {
                  d3.select(this).classed('selected', true);
                  // Hover Text
                  var popUpText = "Frequency:" + d.frequency;
                  tooltip.text(popUpText);
                  tooltip.style("visibility", "visible");


                  scope.onClickEvent({
                    expectation: preprocessorService.getParentExpectationsFromIndex(d.expectation),
                    salary: preprocessorService.getParentSalaryFromIndex(d.salary)
                  });
                }).on("mousemove", function() {
                  return tooltip.style("top" , (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
                }).on("mouseout", function(d, i) {
                  d3.select(this).classed('selected', false);
                  tooltip.style("visibility", "hidden");
                });

                // Selection
                heatRects.on("click", function(d) {
                  scope.onClickEvent({
                    expectation: preprocessorService.getParentExpectationsFromIndex(d.expectation),
                    salary: preprocessorService.getParentSalaryFromIndex(d.salary)
                  });
                });

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
                  .attr("fill", function(d, i) { return colours[i]; });

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
