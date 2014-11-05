'use strict';

describe('Service: friendsListService', function () {

  // load the service's module
  beforeEach(module('travelPhotosApp'));

  // instantiate service
  var friendsListService;
  beforeEach(inject(function (_friendsListService_) {
    friendsListService = _friendsListService_;
  }));

  it('should do something', function () {
    expect(!!friendsListService).toBe(true);
  });

});
