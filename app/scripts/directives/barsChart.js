'use strict';

/**
 * @ngdoc directive
 * @name pisaVisualisationApp.directive:barsChart
 * @description
 * # barsChart
 */
angular.module('pisaVisualisationApp')
  .directive('barsChart', function ($parse, d3Service) {
    var directiveObject = {
      restrict: 'E',
      //this is important,
      //we don't want to overwrite our directive declaration
      //in the HTML mark-up
      replace: false,
      //our data source would be an array
      //passed thru chart-data attribute
      scope: {data: '=chartData'},
      link: function postLink(scope, element, attrs) {
        d3Service.d3().then(function(d3) {
          //in D3, any selection[0] contains the group
          //selection[0][0] is the DOM node
          //but we won't need that this time
          var chart = d3.select(element[0]);
          //to our original directive markup bars-chart
          //we add a div with out chart stling and bind each
          //data entry to the chart
          chart.append("div").attr("class", "chart")
            .selectAll('div')
            .data(scope.data).enter().append("div")
            .transition().ease("elastic")
            .style("width", function(d) { return d + "%"; })
            .text(function(d) { return d + "%"; });
          //a little of magic: setting it's width based
          //on the data value (d)
          //and text all with a smooth transition
        });
      }
    };
    return directiveObject;
  });

