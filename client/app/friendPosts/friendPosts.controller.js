'use strict';

angular.module('travelPhotosApp')
  .controller('FriendpostsCtrl', 
  	  function ($scope, $stateParams, postingService, $http) {
    var ctrl = this;
    this.userPosts = {}
    this.lowResImageIds = {};
    postingService.retrievePosts($http, ctrl, $stateParams.friendName);
    
}); 
