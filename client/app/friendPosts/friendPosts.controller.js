'use strict';

angular.module('travelPhotosApp')
  .controller('FriendpostsCtrl', 
	function ($stateParams, postingService,
              placeService, googleMapsService) {
    var ctrl = this;
    
    this.errorOccurred = false;
    this.addedPlace = false;

    this.userPosts = [];
    postingService.retrieveFriendPosts(ctrl, 
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

    this.addLocation = function(longitude, latitude, instagramLink) {

      ctrl.addedPlace = false;

      var place = {
          location: "visited by " + $stateParams.friendName,
          text: null, 
          latitude: latitude,
          longitude: longitude
      };

      placeService.addPlace(place, ctrl, 
                       googleMapsService, false, instagramLink);

     };
}); 
