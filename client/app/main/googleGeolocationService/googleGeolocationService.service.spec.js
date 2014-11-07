'use strict';

describe('Service: googleGeolocationService', function () {

  // load the service's module
  beforeEach(module('travelPhotosApp'));

  // instantiate service
  var googleGeolocationService;
  beforeEach(inject(function (_googleGeolocationService_) {
    googleGeolocationService = _googleGeolocationService_;
  }));

  it('should do something', function () {
    expect(!!googleGeolocationService).toBe(true);
  });

});
