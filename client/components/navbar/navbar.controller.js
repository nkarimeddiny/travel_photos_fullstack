'use strict';

angular.module('travelPhotosApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth, friendsListService, $state) {

    $scope.showMobileNavbar = false;
    $scope.isLoggedIn = Auth.isLoggedIn;
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