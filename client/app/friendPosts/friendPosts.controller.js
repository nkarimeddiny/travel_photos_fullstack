'use strict';

angular.module('travelPhotosApp')
  .controller('FriendpostsCtrl', function ($scope) {
    $scope.message = 'Hello';
  });

var app = angular.module('travelPhotosApp');

app.controller('FriendPostsCtrl', function ($scope, $routeParams, postingService, $http) {
    var ctrl = this;
    this.friendName = $routeParams.orderId;
    console.log(app);
    postingService.retrievePosts(this.friendName, $http, ctrl);
    
}); 
