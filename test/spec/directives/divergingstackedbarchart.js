'use strict';

describe('Directive: divergingStackedBarChart', function () {

  // load the directive's module
  beforeEach(module('pisaVisualisationApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<diverging-stacked-bar-chart></diverging-stacked-bar-chart>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the divergingStackedBarChart directive');
  }));
});
