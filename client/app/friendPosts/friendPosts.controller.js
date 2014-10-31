'use strict';

angular.module('travelPhotosApp')
  .controller('FriendpostsCtrl', function ($scope) {
    $scope.message = 'Hello';
  });

var app = angular.module('travelPhotosApp');

app.controller('FriendPostsCtrl', function ($stateParams, $scope, postingService, $http) {
    var ctrl = this;
    postingService.retrievePosts($http, ctrl, $stateParams.friendName);
    
}); 
