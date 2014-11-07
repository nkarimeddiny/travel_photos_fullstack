'use strict';

describe('Service: postingService', function () {

  // load the service's module
  beforeEach(module('travelPhotosApp'));

  // instantiate service
  var postingService;
  beforeEach(inject(function (_postingService_) {
    postingService = _postingService_;
  }));

  it('should do something', function () {
    expect(!!postingService).toBe(true);
  });

});
