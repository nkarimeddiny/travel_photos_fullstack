'use strict';

angular.module('travelPhotosApp')
  .controller('FriendpostsCtrl', 
  	  function ($scope, $stateParams, postingService, $http) {
        var ctrl = this;
        this.userPosts = [];
        postingService.retrieveFriendPosts($http, ctrl, $stateParams.friendName);
    
        this.displayNum = 1;
        this.increaseDisplayNum = function() {
        	ctrl.displayNum += 1;
        }
        
        //length of returnArray determines how many posts
        //will be displayed (because of ng-repeat attritbute)
        this.returnArray = function(num) {
          var arr = []; 
          for (var i = 0; i < num; i++) {
            arr.push(i);
          }
         return arr;
         };
}); 
