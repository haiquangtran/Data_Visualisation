'use strict';

/**
 * @ngdoc service
 * @name pisaVisualisationApp.toolTipService
 * @description
 * # toolTipService
 * Factory in the pisaVisualisationApp.
 */
angular.module('pisaVisualisationApp')
  .factory('toolTipService', function ($http) {

    function addToolTip(element, hoverTextCallback) {
      //tool tip on Hover
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
      element.on("mouseover", function(d, i) {
        d3.select(this).classed('selected', true);
        // Need call back to access data
        var hoverText = hoverTextCallback(d);
        tooltip.text(hoverText);
        tooltip.style("visibility", "visible");
      }).on("mousemove", function() {
        return tooltip.style("top" , (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
      }).on("mouseout", function(d, i) {
        d3.select(this).classed('selected', false);
        tooltip.style("visibility", "hidden");
      });
    }

    // Public API here
    return {
      addToolTip: function(element, hoverTextCallback) {
        return addToolTip(element, hoverTextCallback);
      }
    };
  });

