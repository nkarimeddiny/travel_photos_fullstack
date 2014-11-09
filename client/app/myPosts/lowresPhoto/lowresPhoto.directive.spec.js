'use strict';

describe('Directive: lowresPhoto', function () {

  // load the directive's module and view
  beforeEach(module('travelPhotosApp'));
  beforeEach(module('app/myPosts/lowresPhoto/lowresPhoto.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<lowres-photo></lowres-photo>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the lowresPhoto directive');
  }));
});