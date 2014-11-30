'use strict';

angular.module('travelPhotosApp')
  .controller('FriendpostsCtrl', 
	function ($scope, $stateParams, postingService,
              placeService, googleMapsService, $http) {
    var ctrl = this;
    
    this.errorOccurred = false;

    this.userPosts = [];
    postingService.retrieveFriendPosts($http, ctrl, 
      $stateParams.friendName);

    this.displayNum; //set in postingService
    this.increaseDisplayNum = function() {
      if (ctrl.displayNum <= ctrl.userPosts.length - 3) {
    	ctrl.displayNum += 3;
      }
      else {
    	ctrl.displayNum = ctrl.userPosts.length;
      }
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

    this.addLocation = function(longitude, latitude) {

      var place = {
          location: "visited by " + $stateParams.friendName,
          text: null, 
          latitude: latitude,
          longitude: longitude
      };

      placeService.addPlace(place, $http, ctrl, 
                       googleMapsService, $scope, false);

     };
}); 
