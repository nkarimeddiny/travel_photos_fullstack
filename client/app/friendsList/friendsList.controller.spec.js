'use strict';

describe('Controller: FriendslistCtrl', function () {

  // load the controller's module
  beforeEach(module('travelPhotosApp'));

  var FriendslistCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FriendslistCtrl = $controller('FriendslistCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
