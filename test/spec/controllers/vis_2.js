'use strict';

describe('Controller: Vis2Ctrl', function () {

  // load the controller's module
  beforeEach(module('pisaVisualisationApp'));

  var Vis2Ctrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    Vis2Ctrl = $controller('Vis2Ctrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(Vis2Ctrl.awesomeThings.length).toBe(3);
  });
});
