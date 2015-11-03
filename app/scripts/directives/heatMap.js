'use strict';

/**
 * @ngdoc directive
 * @name pisaVisualisationApp.directive:heatMap
 * @description
 * # heatMap
 */
angular.module('pisaVisualisationApp')
  .directive('heatMap', function (d3Service) {
    return {
      restrict: 'E',
      replace: false,
      scope: {data: '=chartData'},
      link: function postLink(scope, element, attrs) {
        d3Service.d3().then(function(d3) {

          //UI configuration
          var itemSize = 18,
            cellSize = itemSize - 1,
            width = 800,
            height = 500,
            margin = {top: 20, right: 20, bottom: 20, left: 25};

          //formats
          var hourFormat = d3.time.format('%H'),
            dayFormat = d3.time.format('%j'),
            timeFormat = d3.time.format('%Y-%m-%dT%X'),
            monthDayFormat = d3.time.format('%m.%d');

          //data vars for rendering
          var dateExtent = null,
            data = null,
            dayOffset = 0,
            colorCalibration = ['#A0CAA0', '#66C266', '#007A00', '#005C00', '#003D00', '#001F00'];

          //axises and scales
          var axisWidth = 0,
            axisHeight = itemSize * 24,
            xAxisScale = d3.time.scale(),
            xAxis = d3.svg.axis()
              .orient('top')
              .ticks(d3.time.days, 3)
              .tickFormat(monthDayFormat),
            yAxisScale = d3.scale.linear()
              .range([0, axisHeight])
              .domain([0, 24]),
            yAxis = d3.svg.axis()
              .orient('left')
              .ticks(5)
              .tickFormat(d3.format('02d'))
              .scale(yAxisScale);

          initCalibration();

          var svg = d3.select(element[0]).append("svg");

          var heatmap = svg
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('width', width - margin.left - margin.right)
            .attr('height', height - margin.top - margin.bottom)
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
          var rect = null;

          scope.$watch('data', function(fileName) {
            if(!fileName){ return; }

            d3.csv(fileName, function (data) {

              var income = [290211, 111092, 78853, 53184, 39265, 9979];
              var expectations = [32248, 19943, 47945, 10776, 24516, 63403];

              // TODO: Test data
              var data = [
                {
                  "expectation":"2014-09-25T01:00:01",
                  "income":{
                    "frequency":30.22
                  }
                },
                {
                  "expectation":"2014-09-25T01:00:01",
                  "income":{
                    "frequency":41.61
                  }
                }
              ];
              //var data = [
              //  {
              //    "expectation": "level1",
              //    "salary": {
              //      "Less than <$A>": 0,
              //      "<$A> or more but less than <$B>": 0,
              //      "<$B> or more but less than <$C>": 0,
              //      "<$C> or more but less than <$D>": 0,
              //      "<$D> or more but less than <$E>": 0,
              //      "<$E> or more": 0
              //    }
              //  },
              //  {
              //    "expectation": "level2",
              //    "salary": {
              //      "Less than <$A>": 0,
              //      "<$A> or more but less than <$B>": 0,
              //      "<$B> or more but less than <$C>": 0,
              //      "<$C> or more but less than <$D>": 0,
              //      "<$D> or more but less than <$E>": 0,
              //      "<$E> or more": 0
              //    }
              //  }
              //];

              data.forEach(function (valueObj) {
                valueObj['date'] = timeFormat.parse(valueObj['expectation']);
              }, true);

              dateExtent = d3.extent(data, function (d) {
                return d.date;
              });

              axisWidth = itemSize * ((dateExtent[1]) - (dateExtent[0]) + 1);

              //xAxis = d3.svg.axis()
              //  .orient('top')
              //  .ticks(d3.time.days, 3)
              //  .tickFormat(monthDayFormat);

              //TODO: AXIS
              //render axises
              xAxis.scale(xAxisScale.range([0, axisWidth]).domain([dateExtent[0], dateExtent[1]]));
              svg.append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
                .attr('class', 'x axis')
                .call(xAxis)
                .append('text')
                .text('date')
                .attr('transform', 'translate(' + axisWidth + ',-10)');

              svg.append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
                .attr('class', 'y axis')
                .call(yAxis)
                .append('text')
                .text('time')
                .attr('transform', 'translate(-10,' + axisHeight + ') rotate(-90)');

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

              //render heatmap rects
              dayOffset = dayFormat(dateExtent[0]);
              rect = heatmap.selectAll('rect')
                .data(data)
                .enter().append('rect')
                .attr('width', cellSize)
                .attr('height', cellSize)
                .attr('x', function (d) {
                  return itemSize * (dayFormat(d.date) - dayOffset);
                })
                .attr('y', function (d, i) {
                  return i * itemSize;
                })
                .attr('fill', '#ffffff')
                .on("mouseover", function(d, i) {
                  d3.select(this).classed('selected', true);
                  tooltip.text("This is a test");
                  tooltip.style("visibility", "visible");
                })
                .on("mousemove", function() {
                  return tooltip.style("top" , (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
                })
                .on("mouseout", function(d, i) {
                  d3.select(this).classed('selected', false);
                  tooltip.style("visibility", "hidden");
                });

              renderColor();
            });

          });

          /**
           * Triggers count or daily radio buttons when clicked
           */
          function initCalibration() {
            d3.select('[role="calibration"] [role="example"]').select('svg')
              .selectAll('rect').data(colorCalibration).enter()
              .append('rect')
              .attr('width', cellSize)
              .attr('height', cellSize)
              .attr('x', function (d, i) {
                return i * itemSize;
              })
              .attr('fill', function (d) {
                return d;
              });

            //bind click event
            d3.selectAll('[role="calibration"] [name="displayType"]').on('click', function () {
              renderColor();
            });
          }

          function renderColor() {
            var renderByCount = document.getElementsByName('displayType')[0].checked;

            rect
              .transition()
              .delay(function (d) {
                return 1;
              })
              .duration(500)
              .attrTween('fill', function (d, i, a) {
                //choose color dynamically
                var colorIndex = d3.scale.quantize()
                  .range([0, 1, 2, 3, 4, 5])
                  .domain((renderByCount ? [0, 500] : [500,100]));

                return d3.interpolate(a, colorCalibration[colorIndex(d.income['frequency'])]);
              });
          }

          //extend frame height in `http://bl.ocks.org/`
          d3.select(self.frameElement).style("height", "600px");
        });
      }
    };
  });
