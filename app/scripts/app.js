'use strict';

/**
 * @ngdoc overview
 * @name pisaVisualisationApp
 * @description
 * # pisaVisualisationApp
 *
 * Main module of the application.
 */

angular
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
      .when('/vis_2', {
        templateUrl: 'views/vis_2.html',
        controller: 'Vis2Ctrl',
        controllerAs: 'vis2'
      })
      .when('/vis_3', {
        templateUrl: 'views/vis_3.html',
        controller: 'Vis3Ctrl',
        controllerAs: 'vis3'
      })
      .when('/vis_4', {
        templateUrl: 'views/vis_4.html',
        controller: 'Vis4Ctrl',
        controllerAs: 'vis4'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
