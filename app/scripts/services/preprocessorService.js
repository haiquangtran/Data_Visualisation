'use strict';

/**
 * @ngdoc service
 * @name pisaVisualisationApp.preprocessorHelper
 * @description
 * # preprocessorHelper
 * Factory in the pisaVisualisationApp.
 */
angular.module('pisaVisualisationApp')
  .factory('preprocessorHelper', function () {

    /**
     * Heat map helper
     * Converts data from the parent's expectations file into row/col index.
     * Returns what the row or col index should be from the converted data.
     * Note: Row and col are considered interchangeable in regard to the data.
     * @param stringDatas
     * @returns {number}
     */
    function getIndexFromParentExpectations(stringData) {
      if (stringData === "ISCED lv2" || stringData === "Less than <$A>") {
        return parseInt(1);
      } else if (stringData === "ISCED lv3B,C" || stringData === "<$A> or more but less than <$B>") {
        return parseInt(2);
      } else if (stringData === "ISCED lv3A" || stringData === "<$B> or more but less than <$C>") {
        return parseInt(3);
      } else if (stringData === "ISCED lv4" || stringData === "<$C> or more but less than <$D>") {
        return parseInt(4);
      } else if (stringData === "ISCED lv5B" || stringData === "<$D> or more but less than <$E>") {
        return parseInt(5);
      } else if (stringData === "ISCED lv5A,6" || stringData === "<$E> or more") {
        return parseInt(6);
      }
    }

    /**
     * Heat map helper
     *
     * @param stringDatas
     * @returns {number}
     */
    function getParentExpectationsFromIndex(stringData) {
      //TODO: for heat map scrolling
    }

    // Public API here
    return {
      getIndexFromParentExpectations: function(stringData) {
        return getIndexFromParentExpectations(stringData);
      },
      getParentExpectationsFromIndex: function(stringData) {
        return getParentExpectationsFromIndex(stringData);
      }
    };
  });

