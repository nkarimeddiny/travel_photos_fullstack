'use strict';

angular.module('travelPhotosApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }];

    console.log(Auth);
    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    console.log($scope.isLoggedIn());
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });