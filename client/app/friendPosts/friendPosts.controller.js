'use strict';

angular.module('travelPhotosApp')
  .controller('FriendpostsCtrl', 
  	  function ($scope, $stateParams, postingService, $http) {
    var ctrl = this;
    this.userPosts = {}
    postingService.retrievePosts($http, ctrl, $stateParams.friendName);
}); 
