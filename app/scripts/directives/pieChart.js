'use strict';

/**
 * @ngdoc directive
 * @name pisaVisualisationApp.directive:pieChart
 * @description
 * # pieChart
 */
angular.module('pisaVisualisationApp')
  .directive('pieChart', function (d3Service, preprocessorHelper) {
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

            var margin = { top: 50, right: 10, bottom: 100, left: 100 };
            var w = 400;
            var h = 400;
            var r = h/3;
            var colours = ['#A0CAA0', '#66C266', '#007A00', '#005C00', '#003D00', '#001F00'];

            var pieData = [{"label":"Category A", "value":20},
              {"label":"Category B", "value":50},
              {"label":"Category C", "value":30}];

            var pieChart = function(fileName) {
              d3.csv(fileName, function(d) {
                return {
                  expectation: d.expectation,
                  salary: d.salary,
                  frequency: parseInt(d.frequency)
                };
              }, function(error, data) {


                var vis = d3.select(".chartBackdrop")
                  .append("svg:svg")
                  .data([pieData])
                  .attr("width", w)
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
                    // log the result of the arc generator to show how cool it is :)
                    console.log(arc(d));
                    return arc(d);
                  });
                // add the text
                arcs.append("svg:text").attr("transform", function(d){
                  d.innerRadius = 0;
                  d.outerRadius = r;
                  return "translate(" + arc.centroid(d) + ")";}).attr("text-anchor", "middle").text( function(d, i) {
                    return pieData[i].label;}
                );

                //tool  tip
                var tooltip = d3.select("body")
                  .append("div")
                  .style("position", "absolute")
                  .style("z-index", "10")
                  .style("visibility", "hidden")
                  .style("width", "200px")
                  .style("height", "100px")
                  .style("background", "rgba(255,255, 255,0.8)")
                  .style("text-align", "center");
                // Hover
                arcs.on("mouseover", function(d, i) {
                  d3.select(this).classed('selected', true);
                  // Hover Text
                  var popUpText = "Frequency:" + d.frequency;
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

            pieChart(fileName);

          });
        });
      }
    };
  });
