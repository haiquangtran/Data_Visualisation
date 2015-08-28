'use strict';

/**
 * @ngdoc overview
 * @name pisaVisualisationApp
 * @description
 * # pisaVisualisationApp
 *
 * Main module of the application.
 */
angular.
  module('pisaVisualisationApp', [
    'd3'
  ]);

angular
  .module('pisaVisualisationApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
