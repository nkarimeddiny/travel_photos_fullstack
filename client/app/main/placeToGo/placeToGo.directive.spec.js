'use strict';

describe('Directive: placeToGo', function () {

  // load the directive's module and view
  beforeEach(module('travelPhotosApp'));
  beforeEach(module('app/main/placeToGo/placeToGo.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<place-to-go></place-to-go>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the placeToGo directive');
  }));
});