'use strict';

describe('Controller: Vis3Ctrl', function () {

  // load the controller's module
  beforeEach(module('pisaVisualisationApp'));

  var Vis3Ctrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    Vis3Ctrl = $controller('Vis3Ctrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(Vis3Ctrl.awesomeThings.length).toBe(3);
  });
});
