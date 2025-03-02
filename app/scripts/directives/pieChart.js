'use strict';

/**
 * @ngdoc directive
 * @name pisaVisualisationApp.directive:pieChart
 * @description
 * # pieChart
 */
angular.module('pisaVisualisationApp')
  .directive('pieChart', function (d3Service, toolTipService, preprocessorService) {
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

          var margin = { top: 50, right: 10, bottom: 100, left: 50 };
          var w = 400;
          var h = 400;
          var r = h/3;
          var colours = ['#A0CAA0', '#66C266', '#007A00', '#005C00', '#003D00', '#001F00'];

          function convertToPieData(fatherExpectationPercentage, motherExpectationPercentage) {
            var pieData = [
              {
                "label":"Father",
                "value": fatherExpectationPercentage,
                "percentages": {
                  "mother": motherExpectationPercentage,
                  "father": fatherExpectationPercentage
                }
              },
              {
                "label":"Mother",
                "value": motherExpectationPercentage,
                "percentages": {
                  "mother": motherExpectationPercentage,
                  "father": fatherExpectationPercentage
                }
              }
            ];
            return pieData;
          }

          var pieChart = function(fileName, selectedExpectation, selectedSalary) {
            d3.csv(fileName, function(d) {
              // Filter
              if (d.expectation === selectedExpectation && d.salary === selectedSalary) {
                return {
                  expectation: d.expectation,
                  salary: d.salary,
                  motherFrequency: parseInt(d.motherFrequency),
                  fatherFrequency: parseInt(d.fatherFrequency),
                  otherFrequency: parseInt(d.otherFrequency)
                };
              }
            }, function(error, data) {
              var total = d3.sum(data, function(d) {
                  return parseInt(d.fatherFrequency + d.motherFrequency);
                }),
                fatherExpectationPercentage = data[0].fatherFrequency/total,
                motherExpectationPercentage = data[0].motherFrequency/total;

              var pieData = convertToPieData(fatherExpectationPercentage, motherExpectationPercentage);

              var explode = function(x, index) {
                var offset = index === 0? 10: 10;
                var angle = (x.startAngle + x.endAngle) / 2;
                var xOff = Math.sin(angle)*offset;
                var yOff = -Math.cos(angle)*offset;
                return "translate("+xOff+","+yOff+")";
              };

              function createPieChart() {
                var vis = d3.select(".chartBackdrop")
                  .append("svg:svg")
                  .attr("id", "pieCanvas")
                  .data([pieData])
                  .attr("width", 40 + "%")
                  .attr("height", h)
                  .append("svg:g")
                  .attr("transform", "translate(" + (r + margin.left)  + "," + (r + margin.top) + ")");

                var pie = d3.layout.pie().value( function(d){ return d.value; });
                // declare an arc generator function
                var arc = d3.svg.arc().outerRadius(r);
                // select paths, use arc generator to draw
                var arcs = vis.selectAll("g.slice").data(pie).enter().append("svg:g").attr("class", "slice");
                arcs.append("svg:path")
                  .attr("fill", function(d, i){
                    return colours[i];
                  })
                  .attr("d", function (d) {
                    return arc(d);
                  })
                  .on("mouseover", function(d) {
                    arcs.transition().duration(500).attr("transform", explode);
                  })
                  .on("mouseout", function(d) {
                    arcs.transition().duration(500).attr("transform", explode(d, false));
                  });

                // add text
                arcs.append("svg:text").attr("transform", function(d){
                  d.innerRadius = 0;
                  d.outerRadius = r;
                  return "translate(" + arc.centroid(d) + ")";}).attr("text-anchor", "middle").text( function(d, i) {
                    return pieData[i].label + ": " + parseFloat(d.value * 100).toFixed(2) + "%";
                  }
                );

                // TODO: fix
                var isFather = false;
                // Add tool tip
                toolTipService.addToolTip(arcs, function(d) {
                  if (isFather) {
                    isFather = true;
                    // Father
                    return "Total Frequency:" + total;
                    //return "Total Frequency:" + total + "  Mother:" + (parseFloat(parseInt(1)-d.value) * 100).toFixed(2) + "%" + "  Father:"
                    //  + parseFloat(d.value * 100).toFixed(2) + "%";
                  } else {
                    isFather = false;
                    // Mother
                    return "Total Frequency:" + total;
                    //return "Total Frequency:" + total + "  Mother:" + (parseFloat(parseInt(1)-d.value) * 100).toFixed(2) + "%" + "  Father:"
                    //  + parseFloat(d.value * 100).toFixed(2) + "%";
                  }
                });
              }

              createPieChart();
            });
          };

          /**
           *  Update the data for the pie chart for dynamic visualisation.
           *
           * @param fileName
           * @param selectedExpectation
           * @param selectedSalary
           */
          function updatePieChart(fileName, selectedExpectation, selectedSalary) {
            // Get the data again
            d3.csv(fileName, function(d) {
              // Filter
              if (d.expectation === selectedExpectation && d.salary === selectedSalary) {
                return {
                  expectation: d.expectation,
                  salary: d.salary,
                  motherFrequency: parseInt(d.motherFrequency),
                  fatherFrequency: parseInt(d.fatherFrequency),
                  otherFrequency: parseInt(d.otherFrequency)
                };
              }
            }, function(error, data) {
              // total, father freq, mother freq
              var total = d3.sum(data, function(d) {
                  return parseInt(d.fatherFrequency + d.motherFrequency);
                }),
                fatherExpectationPercentage = data[0].fatherFrequency/total,
                motherExpectationPercentage = data[0].motherFrequency/total;
              // Data
              var pieData = convertToPieData(fatherExpectationPercentage, motherExpectationPercentage);

              function updateArcs() {
                // arc generator
                var arc = d3.svg.arc().outerRadius(r);
                // provides start angle, end angle, and value property
                var pie = d3.layout.pie().value(function(d){ return d.value; });
                // Attach the new data to the bars
                var arcs = d3.selectAll("#pieCanvas")
                  .selectAll("g.slice path")
                  .data(pie(pieData))
                  .transition().duration(500)
                  .attr("d", function (d) {
                    return arc(d);
                  })
                  .attr("fill", function(d, i){
                    return colours[i];
                  });

                // Update Labelling
                var textArc = d3.selectAll("#pieCanvas")
                  .selectAll("g.slice text")
                  .data(pie(pieData))
                  .transition().duration(500)
                  .attr("transform", function(d){
                    d.innerRadius = 0;
                    d.outerRadius = r;
                    return "translate(" + arc.centroid(d) + ")";}).attr("text-anchor", "middle").text( function(d, i) {
                    return pieData[i].label + ": " + parseFloat(d.value * 100).toFixed(2) + "%";
                  });

                // Update text data within svg
                var updateData = d3.selectAll("#pieCanvas")
                  .selectAll("g.slice")
                  .data(pie(pieData)).enter();
              }

              // Update pie chart
              updateArcs();

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
              updatePieChart(fileName, selectedExpectation, selectedSalary);
            } else {
              pieChart(fileName, selectedExpectation, selectedSalary);
            }
          });
        });
      }
    };
  });
