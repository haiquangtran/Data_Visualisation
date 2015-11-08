'use strict';

/**
 * @ngdoc function
 * @name pisaVisualisationApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the pisaVisualisationApp
 */
//angular.module('pisaVisualisationApp',  ['duScroll'])
//  .controller('MainCtrl', function ($scope, $location, $anchorScroll, $document) {
//    //var container = angular.element(document.getElementById('container'));
//    //var section2 = angular.element(document.getElementById('parents'));
//    //
//    //$scope.toTheTop = function() {
//    //  container.scrollTop(0, 5000);
//    //}
//    //
//    //$scope.toSection2 = function() {
//    //  container.scrollTo(section2, 0, 1000);
//    //}
//
//    )
//  });
angular.module('pisaVisualisationApp', ['duScroll']).
  controller('MainCtrl', function($scope, $document){
    $scope.toTheTop = function() {
      $document.scrollTopAnimated(0, 5000).then(function() {
        console && console.log('You just scrolled to the top!');
      });
    }
    var section3 = angular.element(document.getElementById('section-3'));
    $scope.toSection3 = function() {
      $document.scrollToElementAnimated(section3);
    }
  }
).value('duScrollOffset', 30);
