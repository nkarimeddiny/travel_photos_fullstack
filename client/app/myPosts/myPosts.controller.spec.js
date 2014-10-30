'use strict';

describe('Controller: MypostsCtrl', function () {

  // load the controller's module
  beforeEach(module('travelPhotosApp'));

  var MypostsCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MypostsCtrl = $controller('MypostsCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
