'use strict';

describe('Service: accessInstagram', function () {

  // load the service's module
  beforeEach(module('travelPhotosApp'));

  // instantiate service
  var accessInstagram;
  beforeEach(inject(function (_accessInstagram_) {
    accessInstagram = _accessInstagram_;
  }));

  it('should do something', function () {
    expect(!!accessInstagram).toBe(true);
  });

});
