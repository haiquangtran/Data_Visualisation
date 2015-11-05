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
      scope: {
        data: '=chartData',
        // For filtering
        selectedSalary: '=selectedSalary',
        selectedExpectation: '=selectedExpectation'
      },
      link: function postLink(scope, element, attrs) {
        d3Service.d3().then(function(d3) {

          //var colours = ['#A0CAA0', '#66C266', '#007A00', '#005C00', '#003D00', '#001F00'];
          var colours = ["pink"];
          var margin = { top: 0, right: 10, bottom: 100, left: 10 };
          var barWidth = 40;
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

          function addToolTip(bars) {
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
              var popUpText = " Parent's Income: " + d.salary + " Parent's Expectations: " + d.expectation + "\n"
                + "Mother freq: " + parseInt(d.motherFrequency) + "  Father freq: " +  parseInt(d.fatherFrequency)
                + "\nBoth freq: " + parseInt(d.motherFrequency + d.fatherFrequency);
              tooltip.text(popUpText);
              tooltip.style("visibility", "visible");
            }).on("mousemove", function() {
              return tooltip.style("top" , (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
            }).on("mouseout", function(d, i) {
              d3.select(this).classed('selected', false);
              tooltip.style("visibility", "hidden");
            });
          }

          var barChart = function(fileName, selectedExpectation, selectedSalary) {
            d3.csv(fileName, function(d) {
              return {
                expectation: d.expectation,
                salary: d.salary,
                motherQualification: d.motherQualification,
                motherFrequency: parseInt(d.motherFrequency),
                fatherQualification: d.fatherQualification,
                fatherFrequency: parseInt(d.fatherFrequency)
              };
            }, function(error, data) {
              x.domain(data.map(function(d) { return d.motherQualification; }));
              //y.domain([0, d3.max(data, function(d) { return d.motherFrequency+d.fatherFrequency; })]);

              //Create SVG element
              var svg = d3.select(".chartBackdrop").append("svg")
                .attr("id", "barCanvas")
                .attr("x", 0)
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

              // create bars for mother
              function createBars(isFatherQualification) {
                var qualificationClass;
                if (isFatherQualification) {
                  qualificationClass = "fatherQualifications";
                } else {
                  qualificationClass = "motherQualifications";
                }
                var bars = svg.selectAll("motherRect").data(
                  data.filter(function(d){
                      // Filter
                      if (d.expectation === selectedExpectation && d.salary === selectedSalary) {
                        return d;
                      }
                    }
                  )).enter().append("rect");
                bars
                  .attr("class", qualificationClass)
                  .attr("x", function(d, i) {
                    if (isFatherQualification) {
                      return margin.left + (barWidth) + (barWidth*2) * (i);
                    }
                    return margin.left + (barWidth*2) * (i);
                  }).attr("y", function(d) {
                    if (isFatherQualification) {
                      return height - (d.fatherFrequency);
                    }
                    return height - (d.motherFrequency);
                  }).attr("width", barWidth)
                  .transition().ease("elastic")
                  .attr("height", function(d) {
                    if (isFatherQualification) {
                      return (d.fatherFrequency);
                    }
                    return (d.motherFrequency);
                  })
                  .attr("fill", function(d,i) {
                    if (isFatherQualification) {
                      return "blue";
                    }
                    return "red";
                    //return colours[i % colours.length];
                  });
                addToolTip(bars);
              }

              // Create bars in the bar chart representing the fathers highest qualification
              createBars(true);
              // Create bars in the bar chart representing the mothers highest qualification
              createBars(false);
            });
          };

          /**
           * Update barChart data.
           * Triggered from onClick
           */
          function updateBarChart(fileName, selectedExpectation, selectedSalary) {
            // Get the data again
            d3.csv(fileName, function(d) {
              return {
                expectation: d.expectation,
                salary: d.salary,
                motherQualification: d.motherQualification,
                motherFrequency: parseInt(d.motherFrequency),
                fatherQualification: d.fatherQualification,
                fatherFrequency: parseInt(d.fatherFrequency)
              };
            }, function(error, data) {

              function updateBars(isFatherQualification) {
                var qualificationRect;
                if (isFatherQualification) {
                  qualificationRect = "rect.fatherQualifications";
                } else {
                  qualificationRect = "rect.motherQualifications";
                }
                // Attach the new data to the bars
                var bars = d3.selectAll("#barCanvas")
                  .selectAll(qualificationRect)
                  .data(data.filter(function(d){
                    // Filter
                    if (d.expectation === selectedExpectation && d.salary === selectedSalary) {
                      return d;
                    }
                  }))
                  .transition().duration(500)
                  .attr("x", function(d, i) {
                    if (isFatherQualification) {
                      return margin.left + barWidth + (barWidth*2) * (i);
                    }
                    return margin.left + (barWidth*2) * (i);
                  }).attr("y", function(d) {
                    if (isFatherQualification) {
                      return height - (d.fatherFrequency);
                    }
                    return height - (d.motherFrequency);
                  }).attr("height", function(d) {
                    if (isFatherQualification) {
                      return (d.fatherFrequency);
                    }
                    return (d.motherFrequency);
                  })
                  .attr("width", barWidth)
                  .transition().ease("elastic")
                  .attr("fill", function(d,i) {
                    if (d.motherQualification === selectedExpectation || d.fatherQualification === selectedExpectation) {
                      d3.select(this).classed('selected', true);
                    } else {
                      d3.select(this).classed('selected', false);
                    }
                    if (isFatherQualification) {
                      return "blue";
                    }
                    return "red";
                    //return colours[i % colours.length];
                  });
              }

              // Update bars for father qualifications
              updateBars(true);
              // Update bars for mother qualifications
              updateBars(false);
            });
          }

          scope.$watchGroup(['data', 'selectedExpectation', 'selectedSalary'], function(newValues, oldValues, scope) {
            var fileName = newValues[0];
            var selectedExpectation = newValues[1];
            var selectedSalary = newValues[2];

            if (!fileName) {
              return;
            }

            if (selectedSalary != oldValues[2] || selectedExpectation != oldValues[1]) {
              updateBarChart(fileName, selectedExpectation, selectedSalary);
            } else {
              barChart(fileName, selectedExpectation, selectedSalary);
            }
          });
        });
      }
    };
  });
