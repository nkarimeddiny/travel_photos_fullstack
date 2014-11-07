'use strict';

describe('Service: placeService', function () {

  // load the service's module
  beforeEach(module('travelPhotosApp'));

  // instantiate service
  var placeService;
  beforeEach(inject(function (_placeService_) {
    placeService = _placeService_;
  }));

  it('should do something', function () {
    expect(!!placeService).toBe(true);
  });

});
