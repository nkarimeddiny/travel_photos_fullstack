'use strict';

angular.module('travelPhotosApp')
  .controller('FriendpostsCtrl', 
  	  function ($scope, $stateParams, postingService, $http) {
        var ctrl = this;
        this.userPosts = {}
        postingService.retrieveFriendPosts($http, ctrl, $stateParams.friendName);
    
        // this.displayNum = 3;
        // this.increaseDisplayNum = function() {
        // 	ctrl.displayNum += 3;
        // }
}); 
