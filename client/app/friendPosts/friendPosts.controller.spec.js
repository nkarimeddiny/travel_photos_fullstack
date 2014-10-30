'use strict';

describe('Controller: FriendpostsCtrl', function () {

  // load the controller's module
  beforeEach(module('travelPhotosApp'));

  var FriendpostsCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FriendpostsCtrl = $controller('FriendpostsCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
