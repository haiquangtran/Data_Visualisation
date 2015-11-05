'use strict';

/**
 * @ngdoc service
 * @name pisaVisualisationApp.preprocessorService
 * @description
 * # preprocessorService
 * Factory in the pisaVisualisationApp.
 */
angular.module('pisaVisualisationApp')
  .factory('preprocessorService', function () {

    /**
     * Heat map helper
     * Converts data from the parent's expectations file into row/col index.
     * Returns what the row or col index should be from the converted data.
     * Note: Row and col are considered interchangeable in regard to the data.
     * @param stringDatas
     * @returns {number}
     */
    function getIndexFromParentExpectations(stringData) {
      var expectations = ["ISCED lv2", "ISCED lv3B,C", "ISCED lv3A", "ISCED lv4", "ISCED lv5B", "ISCED lv5A,6"];
      var answers = ["Less than <$A>", "<$A> or more but less than <$B>", "<$B> or more but less than <$C>",
        "<$C> or more but less than <$D>", "<$D> or more but less than <$E>", "<$E> or more"];

      for (var i = 0; i < expectations.length; i++) {
        if (stringData === expectations[i] || stringData === answers[i]) {
          return i;
        }
      }
    }

    /**
     * Heat map helper
     *
     * @param index
     * @returns {string}
     */
    function getParentExpectationsFromIndex(index) {
      var expectations = ["ISCED lv2", "ISCED lv3B,C", "ISCED lv3A", "ISCED lv4", "ISCED lv5B", "ISCED lv5A,6"];
      if (index >= 0) return expectations[index];
    }

    /**
     * Heat map helper
     *
     * @param stringDatas
     * @returns {string}
     */
    function getParentSalaryFromIndex(index) {
      var salary = ["Less than <$A>", "<$A> or more but less than <$B>", "<$B> or more but less than <$C>",
        "<$C> or more but less than <$D>", "<$D> or more but less than <$E>", "<$E> or more"];
      if (index >= 0) return salary[index];
    }

    // Public API here
    return {
      getIndexFromParentExpectations: function(stringData) {
        return getIndexFromParentExpectations(stringData);
      },
      getParentExpectationsFromIndex: function(index) {
        return getParentExpectationsFromIndex(index);
      },
      getParentSalaryFromIndex: function(index) {
        return getParentSalaryFromIndex(index);
      }
    };
  });

