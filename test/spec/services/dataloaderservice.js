'use strict';

describe('Service: dataLoaderService', function () {

  // load the service's module
  beforeEach(module('pisaVisualisationApp'));

  // instantiate service
  var dataLoaderService;
  beforeEach(inject(function (_dataLoaderService_) {
    dataLoaderService = _dataLoaderService_;
  }));

  it('should do something', function () {
    expect(!!dataLoaderService).toBe(true);
  });

});
