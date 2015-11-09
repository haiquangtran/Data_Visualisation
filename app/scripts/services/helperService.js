'use strict';

/**
 * @ngdoc service
 * @name pisaVisualisationApp.helperService
 * @description
 * # helperService
 * Factory in the pisaVisualisationApp.
 */
angular.module('pisaVisualisationApp')
  .factory('helperService', function () {

    function toFullPercentage(value, total) {
      return parseFloat(parseFloat(value/total * 100).toFixed(2));
    }

    function toPercentage(value, total) {
      return parseFloat(parseFloat(value/total).toFixed(2));
    }

    function getTotal(data) {
      var total = d3.sum(data, function(d) {
        return parseInt(d.motherFrequency + d.fatherFrequency);
      });
      return total;
    }

    function getMaxFather(data) {
      var max = d3.max(data, function(d) {
        return d.fatherFrequency;
      });
      return max;
    }

    function getMaxMother(data) {
      var max = d3.max(data, function(d) {
        return d.motherFrequency;
      });
      return max;
    }

    function getMaxFrequencyOutOfParents(data) {
      var maxFather = getMaxFather(data);
      var maxMother = getMaxMother(data);

      return d3.max([maxFather, maxMother]);
    }

    // Public API here
    return {
      toFullPercentage: function(value, total) {
        return toFullPercentage(value, total);
      },
      toPercentage: function(value, total) {
        return toPercentage(value, total);
      },
      getTotal: function(data) {
        return getTotal(data);
      },
      getMaxFather: function(data) {
        return getMaxFather(data);
      },
      getMaxMother: function(data) {
        return getMaxMother(data);
      },
      getMaxFrequencyOutOfParents: function(data) {
        return getMaxFrequencyOutOfParents(data);
      }
    };
  });

