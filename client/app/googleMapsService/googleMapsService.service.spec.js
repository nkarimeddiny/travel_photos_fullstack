'use strict';

describe('Service: googleMapsService', function () {

  // load the service's module
  beforeEach(module('travelPhotosApp'));

  // instantiate service
  var googleMapsService;
  beforeEach(inject(function (_googleMapsService_) {
    googleMapsService = _googleMapsService_;
  }));

  it('should do something', function () {
    expect(!!googleMapsService).toBe(true);
  });

});
