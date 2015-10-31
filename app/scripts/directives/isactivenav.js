'use strict';

/**
 * @ngdoc directive
 * @name pisaVisualisationApp.directive:isActiveNav
 * @description
 * # isActiveNav
 */
angular.module('pisaVisualisationApp')
  .directive('isActiveNav',[ '$location', function($location) {
    return {
      restrict: 'A',
      link: function(scope, element) {
        scope.location = $location;
        scope.$watch('location.path()', function(currentPath) {
          if ('#' + currentPath === element[0].attributes['href'].value) {
            element.parent().addClass('active');
          } else {
            element.parent().removeClass('active');
          }
        });
      }
    };
  }]);

