'use strict';

/**
 * @ngdoc directive
 * @name pisaVisualisationApp.directive:horizontalBarChart
 * @description
 * # horizontalBarChart
 */
angular.module('pisaVisualisationApp')
  .directive('horizontalBarChart', ['d3Service', 'queryService', function(d3Service, queryService) {
    return {
      restrict: 'E',
      replace: false,
      scope: {data: '=chartData'},
      link: function(scope, element, attrs) {
        d3Service.d3().then(function(d3) {

          scope.$watch('data', function(fileName) {
            if (!fileName) {
              return;
            }

            // Parent's expectations
            var fatherQualifications = [0,0,0,0,0]; // None, lv3, lv4, lv5B, lv5A,B
            var motherQualifications = [0,0,0,0,0];

            var salary = [0,0,0,0,0,0];
            var expectations = [0,0,0,0,0,0];
            var heatMap =
              [ 0,0,0,0,0,0, // lv2
                0,0,0,0,0,0, // lv3B or C
                0,0,0,0,0,0, // lv 3A
                0,0,0,0,0,0, // lv4
                0,0,0,0,0,0, // lv5B
                0,0,0,0,0,0 ]; // lv5A, or 6

            //var results = [
            //  {
            //    // expectation
            //    "ISCED lv2":  {
            //      //salary
            //      "Less than <$A>": {
            //        // Qualifications
            //        "motherQualification": {
            //          // HIGHEST levels of completion
            //          "none": 5,
            //          "ISCED 3A": 5,
            //          "ISCED 4": 0,
            //          "ISCED 5B": 0,
            //          "ISCED 5A,6": 0
            //        },
            //        "fatherQualification": {
            //          // HIGHEST levels of completion
            //          "none": 5,
            //          "ISCED 3A": 5,
            //          "ISCED 4": 0,
            //          "ISCED 5B": 0,
            //          "ISCED 5A,6": 0
            //        }
            //      },
            //      "<$A> or more but less than <$B>": {},
            //      "<$B> or more but less than <$C>": {},
            //      "<$C> or more but less than <$D>": {},
            //      "<$D> or more but less than <$E>": {},
            //      "<$E> or more": {}
            //    }
            //  }
            //];

            var answer = "Yes";

            var colourScheme = ["#A0CAA0", "#66C266", "#007A00", "#005C00"];

            d3.csv(fileName, function (data) {
              data.forEach(function (d) {

                // Father qualifications
                if (queryService.doesQuestionMatchAnswer("PA03Q04", d, answer)) {
                  queryService.addTo(fatherQualifications, 4, "PA03Q04", d, answer);
                } else if (queryService.doesQuestionMatchAnswer("PA03Q03", d, answer)) {
                  queryService.addTo(fatherQualifications, 3, "PA03Q03", d, answer);
                } else if (queryService.doesQuestionMatchAnswer("PA03Q02", d, answer)) {
                  queryService.addTo(fatherQualifications, 2, "PA03Q02", d, answer);
                } else if (queryService.doesQuestionMatchAnswer("PA03Q01", d, answer)) {
                  queryService.addTo(fatherQualifications, 1, "PA03Q01", d, answer);
                } else {
                  var no = "No";
                  if (queryService.doesQuestionMatchAnswer("PA03Q04", d, no)
                    || queryService.doesQuestionMatchAnswer("PA03Q03", d, no)
                    || queryService.doesQuestionMatchAnswer("PA03Q02", d, no)
                    || queryService.doesQuestionMatchAnswer("PA03Q01", d, no)) {
                    fatherQualifications[0]++;
                  }
                }
                // Mothers qualifications
                if (queryService.doesQuestionMatchAnswer("PA05Q04", d, answer)) {
                  queryService.addTo(motherQualifications, 4, "PA05Q04", d, answer);
                } else if (queryService.doesQuestionMatchAnswer("PA05Q03", d, answer)) {
                  queryService.addTo(motherQualifications, 3, "PA05Q03", d, answer);
                } else if (queryService.doesQuestionMatchAnswer("PA05Q02", d, answer)) {
                  queryService.addTo(motherQualifications, 2, "PA05Q02", d, answer);
                } else if (queryService.doesQuestionMatchAnswer("PA05Q01", d, answer)) {
                  queryService.addTo(motherQualifications, 1, "PA05Q01", d, answer);
                } else {
                  var no = "No";
                  if (queryService.doesQuestionMatchAnswer("PA05Q04", d, no)
                    || queryService.doesQuestionMatchAnswer("PA05Q03", d, no)
                    || queryService.doesQuestionMatchAnswer("PA05Q02", d, no)
                    || queryService.doesQuestionMatchAnswer("PA05Q01", d, no)) {
                    motherQualifications[0]++;
                  }
                }

                // Salary
                queryService.addTo(salary, 0, "PA07Q01", d, "Less than <$A>");
                queryService.addTo(salary, 1, "PA07Q01", d, "<$A> or more but less than <$B>");
                queryService.addTo(salary, 2, "PA07Q01", d, "<$B> or more but less than <$C>");
                queryService.addTo(salary, 3, "PA07Q01", d, "<$C> or more but less than <$D>");
                queryService.addTo(salary, 4, "PA07Q01", d, "<$D> or more but less than <$E>");
                queryService.addTo(salary, 5, "PA07Q01", d, "<$E> or more");

                var tick = "Tick";

                // Expectations
                queryService.addToExpectations(expectations, d, tick);
                queryService.addToHeatMap(heatMap, d, tick);

                //queryService.addTo(expectationsTwo, 0, "PA19Q01", d, tick); // lv2
                //queryService.addTo(expectationsTwo, 1, "PA19Q02", d, tick); // lv3B or C
                //queryService.addTo(expectationsTwo, 2, "PA19Q03", d, tick); // lv 3A
                //queryService.addTo(expectationsTwo, 3, "PA19Q04", d, tick); // lv4
                //queryService.addTo(expectationsTwo, 4, "PA19Q05", d, tick); // lv5B
                //queryService.addTo(expectationsTwo, 5, "PA19Q06", d, tick); // lv5A, or 6

                return d;
              });

              //var results = queryService.getParentsExpectationsBasedOnSalary(data);
              //var results = queryService.getQualifications(data);
              //console.log("father qualifications " + fatherQualifications);
              //console.log("mother qualifications " + motherQualifications);
              //console.log("salary " + salary);
              //console.log("total expectations " + expectations);
              //console.log("expectations and salary " + heatMap);
              //console.log("RESULTS: " + results);
              //console.log("RESULTS SIZE " + results.length);

              var graphQualifications = d3.select(element[0]);


              // Frequency of parents qualifications
              graphQualifications.append("div").attr("class", "backDrop")
                .selectAll('div')
                .data(motherQualifications).enter().append("div")
                .transition().ease("elastic")
                .style("width", function(d) { return d/1000 + "%"; })
                .style("background-color", function(d, i) { return "yellow";})
                .style("color", "black")
                .text(function(d) { return d + " freq"; });

              graphQualifications.append("div").attr("class", "backDrop")
                .selectAll('div')
                .data(fatherQualifications).enter().append("div")
                .transition().ease("elastic")
                .style("width", function(d) { return d/1000 + "%"; })
                .style("background-color", function(d, i) { return "yellow";})
                .style("color", "black")
                .text(function(d) { return d + " freq"; });

              var graphExpectations = d3.select(element[0]);

              // Frequency of parents expectations
              graphExpectations.append("div")
                .attr("class", "backDrop")
                .selectAll('div')
                .data(expectations).enter().append("div")
                .transition().ease("elastic")
                .style("width", function(d) { return d/1000 + "%"; })
                .style("background-color", function(d, i) { return "orange";})
                .style("color", "white")
                .text(function(d) { return d + " freq"; });

              var graphSalary = d3.select(element[0]);

              // Frequency of parents salary
              graphSalary.append("div")
                .attr("class", "backDrop")
                .selectAll('div')
                .data(salary).enter().append("div")
                .transition().ease("elastic")
                .style("width", function(d) { return d/1000 + "%"; })
                .style("background-color", function(d, i) { return "black";})
                .style("color", "white")
                .text(function(d) { return d + " freq"; });
            });
          });

        });
      }};
  }]);
