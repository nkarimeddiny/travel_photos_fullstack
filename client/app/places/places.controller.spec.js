'use strict';

describe('Controller: PlacesCtrl', function () {

  // load the controller's module
  beforeEach(module('travelPhotosApp'));

  var PlacesCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PlacesCtrl = $controller('PlacesCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
