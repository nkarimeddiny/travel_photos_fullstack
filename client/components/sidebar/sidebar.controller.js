'use strict';

var app = angular.module('travelPhotosApp');

app.controller('FriendslistCtrl', 
  function ($timeout, friendsListService) {
   var ctrl = this;

   this.errorOccurred = false;

   this.myFriendsList = [];
   this.signedUpUsers = [];
   this.friendsOrderObject = {};

   this.removeFriend = function(friendName) {
      friendsListService.removeFriend(friendName, ctrl);
   }

   this.addFriend = friendsListService.addFriend;

///////////////////////////////////////////////////
//for angular/jquery-ui sortable:
   this.sortableOptions = {
      'ui-floating': true,
      stop: function( event, ui ) {
        friendsListService.updateFriendsOrder(ctrl);
      } 
   };
///////////////////////////////////////////////////////   

    var friendSearch = $("#friendSearch");
    
    //timeout is so initializeSidebar is called after retrieveFriendPosts,
    //and will access updated info for showing or not showing the green dot
    $timeout(friendsListService.initializeSidebar(friendSearch, 
      ctrl), 0)


/////////////////////////////////////////////
//when the search form is used, the user can click on a friend's
//name, and the addFriend method is called:

    $(".ui-widget").on("click", ".ui-menu-item", function(event){
      ctrl.addFriend($(event.target).text(), ctrl);
    });

/////////////////////////////////////////////    

});
