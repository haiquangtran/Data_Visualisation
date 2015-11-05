'use strict';

describe('Controller: ParentCtrl', function () {

  // load the controller's module
  beforeEach(module('pisaVisualisationApp'));

  var Vis4Ctrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    Vis4Ctrl = $controller('Vis4Ctrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(Vis4Ctrl.awesomeThings.length).toBe(3);
  });
});
