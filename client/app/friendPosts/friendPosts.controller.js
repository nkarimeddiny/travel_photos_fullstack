'use strict';

angular.module('travelPhotosApp')
  .controller('FriendpostsCtrl', function ($scope, $stateParams, postingService, $http) {
    $scope.message = 'Hello';
    var ctrl = this;
    ctrl.userPosts = {}
    postingService.retrievePosts($http, ctrl, $stateParams.friendName);
    
}); 
