'use strict';

/**
 * @ngdoc overview
 * @name pisaVisualisationApp
 * @description
 * # pisaVisualisationApp
 *
 * Main module of the application.
 */

var app = angular
  .module('pisaVisualisationApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/vis_1', {
        templateUrl: 'views/vis_1.html',
        controller: 'Vis1Ctrl',
        controllerAs: 'vis1'
      })
      .when('/children', {
        templateUrl: 'views/children.html',
        controller: 'ChildrenCtrl',
        controllerAs: 'childrenCtrl'
      })
      .when('/vis_3', {
        templateUrl: 'views/vis_3.html',
        controller: 'Vis3Ctrl',
        controllerAs: 'vis3'
      })
      .when('/parents', {
        templateUrl: 'views/parents.html',
        controller: 'ParentsCtrl',
        controllerAs: 'parentsCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

app.run(function($rootScope, $location, $anchorScroll) {
  //when the route is changed scroll to the proper element.
  $rootScope.$on('$routeChangeSuccess', function(newRoute, oldRoute) {
    if($location.hash()) $anchorScroll();
  });
});
