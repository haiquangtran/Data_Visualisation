'use strict';

/**
 * @ngdoc directive
 * @name pisaVisualisationApp.directive:verticalBarChart
 * @description
 * # verticalBarChart
 */
angular.module('pisaVisualisationApp')
  .directive('verticalBarChart', function (d3Service, toolTipService, helperService) {
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

          var colours = ['#A0CAA0', '#66C266', '#007A00', '#005C00', '#003D00', '#001F00'];
          var maleColor = "#003D00";
          var femaleColor = "#007A00";
          //var colours = ["pink"];
          var margin = { top: 0, right: 10, bottom: 100, left: 10 };
          var barWidth = 50;
          var height = 250;
          var width = 600;

          function calculateBarHeight(d, total, isFatherQualification) {
            var scaleFactor = 2.1;
            var padding = 10;

            if (isFatherQualification) {
              return padding + ((helperService.toPercentage(d.fatherFrequency, total)) * height * scaleFactor);
            }
            return padding + ((helperService.toPercentage(d.motherFrequency, total)) * height * scaleFactor);
          }

          function calculateBarY(d, total, isFatherQualification) {
            return height - calculateBarHeight(d, total, isFatherQualification);
          }

          var barChart = function(fileName, selectedExpectation, selectedSalary) {
            d3.csv(fileName, function(d) {
              // Filter
              if (d.expectation === selectedExpectation && d.salary === selectedSalary) {
                return {
                  expectation: d.expectation,
                  salary: d.salary,
                  motherQualification: d.motherQualification,
                  motherFrequency: parseInt(d.motherFrequency),
                  fatherQualification: d.fatherQualification,
                  fatherFrequency: parseInt(d.fatherFrequency)
                };
              }
            }, function(error, data) {
              var total = helperService.getTotal(data);
              var maxValue = helperService.getMaxFrequencyOutOfParents(data);
              var xLabels = [];
              data.map(function(d) {
                xLabels.push(d.motherQualification);
              });

              var x = d3.scale.ordinal().rangePoints([10, barWidth*10-90]);
              var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom")
                .ticks(10);
              x.domain(xLabels);

              //Create SVG element
              var svg = d3.select(".chartBackdrop").append("svg")
                .attr("id", "barCanvas")
                .attr("x", 0)
                .attr("width", 60 + "%")
                .attr("height", height + margin.top + margin.bottom)
                .style("background-color", "dark-grey")
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

              // X Axis
              svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(" + barWidth + "," + height + ")")
                .call(xAxis)
                .selectAll("text")
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", "-.55em")
                .attr("transform", "rotate(-90)" );

              function addBarText(svg, isFatherQualification) {
                var qualificationClass;
                if (isFatherQualification) {
                  qualificationClass = "fatherQualifications";
                } else {
                  qualificationClass = "motherQualifications";
                }
                // Text
                var barText = svg.selectAll("barText")
                  .data(data)
                  .enter().append("text")
                  .text(function(d) {
                    if (isFatherQualification) {
                      return helperService.toFullPercentage(d.fatherFrequency, total) + '%';
                    }
                    return helperService.toFullPercentage(d.motherFrequency, total) + '%';
                  })
                  .attr("x", function(d, i) {
                    if (isFatherQualification) {
                      return margin.left + (barWidth) + (barWidth*2) * (i);
                    }
                    return margin.left + (barWidth*2) * (i);
                  })
                  .attr("y", function(d) {
                    return calculateBarY(d, total, isFatherQualification);
                  })
                  .attr("class", qualificationClass)
                  .attr("text-anchor", "start");
              }

              // create bars for parents
              function createBars(isFatherQualification) {
                var qualificationClass;
                if (isFatherQualification) {
                  qualificationClass = "fatherQualifications";
                } else {
                  qualificationClass = "motherQualifications";
                }
                var bars = svg.selectAll("barRect").data(data)
                  .enter().append("rect");
                bars
                  .attr("class", qualificationClass)
                  .attr("x", function(d, i) {
                    if (isFatherQualification) {
                      return margin.left + (barWidth) + (barWidth*2) * (i);
                    }
                    return margin.left + (barWidth*2) * (i);
                  }).attr("y", function(d) {
                    return calculateBarY(d, total, isFatherQualification);
                  }).attr("width", barWidth)
                  .transition().ease("elastic")
                  .attr("height", function(d) {
                    return calculateBarHeight(d, total, isFatherQualification);
                  })
                  .attr("fill", function(d,i) {
                    if (isFatherQualification) {
                      return maleColor;
                    }
                    return femaleColor;
                  });

                addBarText(svg, isFatherQualification);

                toolTipService.addToolTip(bars, function(d) {
                  var hoverText = " Parent's Income: " + d.salary + " Parent's Expectations: " + d.expectation + "\n"
                    + "Mother freq: " + parseInt(d.motherFrequency) + "  Father freq: " +  parseInt(d.fatherFrequency)
                    + "\nBoth freq: " + parseInt(d.motherFrequency + d.fatherFrequency);
                  return hoverText;
                });
              }

              // Create bars in the bar chart representing the fathers highest qualification
              createBars(true);
              // Create bars in the bar chart representing the mothers highest qualification
              createBars(false);
            });
          };

          /**
           * Update barChart data.
           */
          function updateBarChart(fileName, selectedExpectation, selectedSalary) {
            // Get the data again
            d3.csv(fileName, function(d) {
              if (d.expectation === selectedExpectation && d.salary === selectedSalary) {
                return {
                  expectation: d.expectation,
                  salary: d.salary,
                  motherQualification: d.motherQualification,
                  motherFrequency: parseInt(d.motherFrequency),
                  fatherQualification: d.fatherQualification,
                  fatherFrequency: parseInt(d.fatherFrequency)
                }
              }
            }, function(error, data) {
              var total = helperService.getTotal(data);
              var maxValue = helperService.getMaxFrequencyOutOfParents(data);

              function updateBarText(isFatherQualification) {
                var qualificationText;
                if (isFatherQualification) {
                  qualificationText = "text.fatherQualifications";
                } else {
                  qualificationText = "text.motherQualifications";
                }

                // Update the Text
                var barText = d3.selectAll("#barCanvas")
                  .selectAll(qualificationText)
                  .data(data)
                  .transition().duration(500)
                  .attr("y", function(d) {
                    return calculateBarY(d, total, isFatherQualification);
                  })
                  .text(function(d) {
                    if (isFatherQualification) {
                      return helperService.toFullPercentage(d.fatherFrequency, total) + '%';
                    }
                    return helperService.toFullPercentage(d.motherFrequency, total) + '%';
                  });
              }

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
                  .data(data)
                  .transition().duration(500)
                  .attr("x", function(d, i) {
                    if (isFatherQualification) {
                      return margin.left + barWidth + (barWidth*2) * (i);
                    }
                    return margin.left + (barWidth*2) * (i);
                  }).attr("y", function(d) {
                    return calculateBarY(d, total, isFatherQualification);
                  }).attr("height", function(d) {
                    return calculateBarHeight(d, total, isFatherQualification);
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
                      return maleColor;
                    }
                    return femaleColor;
                  });

                updateBarText(isFatherQualification);
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
