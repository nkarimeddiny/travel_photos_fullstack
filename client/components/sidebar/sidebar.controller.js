'use strict';

angular.module('travelPhotosApp')
  .controller('FriendslistCtrl', function ($scope) {
    $scope.message = 'Hello';
  });

  

var app = angular.module('travelPhotosApp');

app.controller('FriendsListCtrl', function($scope, $state, $http, $location, friendsListService) {

   var ctrl = this;
   ctrl.myFriendsList = [];
   ctrl.signedUpUsers = [];
   ctrl.friendsOrderObject = {};

   ctrl.sortableOptions = {
      'ui-floating': true,
      stop: function( event, ui ) {
        friendsListService.updateFriendsOrder(ctrl, $http);
      } 
   };
  
    var friendSearch = $("#friendSearch");

    $(".ui-widget").on("click", ".ui-menu-item", function(event){
       ctrl.addFriend($(event.target).text(), ctrl, $http);
    });

    $http.get("http://localhost:9000/api/users/me")
             .success( function(data) {
              console.log(data);
                  ctrl.thisUserName = data.username;
                  ctrl.myFriendsList = data.userFriends; 
                  ctrl.signedUpUsers = data.users

                  friendSearch.autocomplete({
                   minLength: 3,
                   source: ctrl.signedUpUsers,
                   position: { my: "left top", at: "left bottom" },
                   appendTo: ".ui-widget"
                 });
             });

    this.removeFriend = function(friendName) {
       friendsListService.removeFriend(friendName, ctrl, $http);
    }

    this.addFriend = friendsListService.addFriend;

    this.goToLink = function(param) {
          $state.go("friendPosts", {friendName: param}); 
    };

});

app.factory("friendsListService", function() {
    return {
      addFriend : function(friend, ctrl, $http) {
          $http.post("http://localhost:9000/api/users/addFriend", {
                friend: friend
                })
             .success( function(data) {
                console.log(data.userFriends);
                ctrl.myFriendsList = data.userFriends; 
               }); 
          },
      removeFriend : function(friendName, ctrl, $http) {
          $http.post("http://localhost:9000/api/users/removeFriend", {
                friendName: friendName
                })
             .success( function(data) {
                ctrl.myFriendsList = data.userFriends; 
               }); 
          },
      updateFriendsOrder : function(ctrl, $http) {
          ctrl.myFriendsList.forEach(function(friend, index){
             ctrl.friendsOrderObject[friend.name] = index + 1;
          });
         $http.post("http://localhost:9000/api/users/updateFriendsOrder", {friendsOrder : ctrl.friendsOrderObject})
             .success( function(data) {
                 console.log(data);
                 console.log(data.userFriends);
                 ctrl.myFriendsList = data.userFriends; 
        });
      }    
      }
    });
