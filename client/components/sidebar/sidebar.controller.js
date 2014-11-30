'use strict';

var app = angular.module('travelPhotosApp');

app.controller('FriendslistCtrl', 
  function ($scope, $state, $http, friendsListService, $rootScope) {
   var ctrl = this;

   this.errorOccurred = false;

   this.myFriendsList = [];
   this.signedUpUsers = [];
   this.friendsOrderObject = {};

   this.removeFriend = function(friendName) {
      friendsListService.removeFriend(friendName, ctrl, $http);
   }

   this.addFriend = friendsListService.addFriend;

///////////////////////////////////////////////////
//for angular/jquery-ui sortable:
   this.sortableOptions = {
      'ui-floating': true,
      stop: function( event, ui ) {
        friendsListService.updateFriendsOrder(ctrl, $http);
      } 
   };
///////////////////////////////////////////////////////   

    var friendSearch = $("#friendSearch");
    
    friendsListService.initializeSidebar(friendSearch, ctrl, $http);


/////////////////////////////////////////////
//when the search form is used, the user can click on a friend's
//name, and the addFriend method is called:

    $(".ui-widget").on("click", ".ui-menu-item", function(event){
      ctrl.addFriend($(event.target).text(), ctrl, $http);
    });

/////////////////////////////////////////////    

});
