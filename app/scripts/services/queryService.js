'use strict';

/**
 * @ngdoc service
 * @name pisaVisualisationApp.queryService
 * @description
 * # queryService
 * Factory in the pisaVisualisationApp.
 */
angular.module('pisaVisualisationApp')
  .factory('queryService', function () {

    function addTo(array, arrayIndex, question, data, answer) {
      if (data[question] === answer) {
        array[arrayIndex]++;
      }
    }

    function doesQuestionMatchAnswer(question, data, answer) {
      if (data[question] === answer) {
        return true;
      }
      return false;
    }

    function addToExpectations(array, data, answer) {
      if (data["PA19Q06"] === answer) {
        array[5]++;
        return;
      } else if (data["PA19Q05"] === answer) {
        array[4]++;
        return;
      } else if (data["PA19Q04"] === answer) {
        array[3]++;
        return;
      } else if (data["PA19Q03"] === answer) {
        array[2]++;
        return;
      } else if (data["PA19Q02"] === answer) {
        array[1]++;
        return;
      } else if (data["PA19Q01"] === answer) {
        array[0]++;
        return;
      }
    }

    function getSalaryIndex(data) {
      if (data["PA07Q01"] === "Less than <$A>") {
        return 0;
      } else if (data["PA07Q01"] === "<$A> or more but less than <$B>") {
        return 1;
      } else if (data["PA07Q01"] === "<$B> or more but less than <$C>") {
        return 2;
      } else if (data["PA07Q01"] === "<$C> or more but less than <$D>") {
        return 3;
      } else if (data["PA07Q01"] === "<$D> or more but less than <$E>") {
        return 4;
      } else if (data["PA07Q01"] === "<$E> or more") {
        return 5;
      } else {
        return;
      }
    }

    function addToHeatMap(array, data, answer) {
      var salaryIndex = getSalaryIndex(data);
      if (salaryIndex == null) { return; }
      var salaryNum = 6;
      if (data["PA19Q06"] === answer) {
        array[(5 * salaryNum) + salaryIndex]++;
        return;
      } else if (data["PA19Q05"] === answer) {
        array[(4 * salaryNum) + salaryIndex]++;
        return;
      } else if (data["PA19Q04"] === answer) {
        array[(3 * salaryNum) + salaryIndex]++;
        return;
      } else if (data["PA19Q03"] === answer) {
        array[(2 * salaryNum) + salaryIndex]++;
        return;
      } else if (data["PA19Q02"] === answer) {
        array[(1 * salaryNum) + salaryIndex]++;
        return;
      } else if (data["PA19Q01"] === answer) {
        array[(0 * salaryNum) + salaryIndex]++;
        return;
      }
    }



    // Public API here
    return {
      // HELPERS
      // Used to discover information from the PISA dataset.
      addTo: function(array, arrayIndex, question, data, answer) {
        return addTo(array, arrayIndex, question, data, answer);
      },
      addToExpectations: function(array, data, answer) {
        return addToExpectations(array, data, answer);
      },
      addToHeatMap: function(array, data, answer) {
        return addToHeatMap(array, data, answer);
      },
      doesQuestionMatchAnswer: function(question, data, answer) {
        return doesQuestionMatchAnswer(question, data, answer);
      }
    };
  });

