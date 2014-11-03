'use strict';

var app = angular.module('travelPhotosApp');

app.controller('FriendslistCtrl', function ($scope, $state, $http, $location, friendsListService) {
   $scope.message = 'Hello';
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

    friendsListService.initializeSidebar(friendSearch, ctrl, $http);

    this.removeFriend = function(friendName) {
       friendsListService.removeFriend(friendName, ctrl, $http);
    }

    this.addFriend = friendsListService.addFriend;

});

// app.factory("friendsListService", function() {
//     return {
//       addFriend : function(friend, ctrl, $http) {
//           $http.post("api/users/addFriend", {
//                 friend: friend
//                 })
//              .success( function(data) {
//                 console.log(data.userFriends);
//                 ctrl.myFriendsList = data.userFriends; 
//                }); 
//           },
//       removeFriend : function(friendName, ctrl, $http) {
//           $http.post("api/users/removeFriend", {
//                 friendName: friendName
//                 })
//              .success( function(data) {
//                 ctrl.myFriendsList = data.userFriends; 
//                }); 
//           },
//       updateFriendsOrder : function(ctrl, $http) {
//           ctrl.myFriendsList.forEach(function(friend, index){
//              ctrl.friendsOrderObject[friend.name] = index + 1;
//           });
//          $http.post("api/users/updateFriendsOrder", {friendsOrder : ctrl.friendsOrderObject})
//              .success( function(data) {
//                  console.log(data);
//                  console.log(data.userFriends);
//                  ctrl.myFriendsList = data.userFriends; 
//         });
//       },
//       initializeSidebar: function(friendSearch, ctrl, $http) {
//            $http.get("api/users/sideBarInfo")
//              .success( function(data) {
//               console.log(data);
//                   ctrl.thisUserName = data.username;
//                   ctrl.myFriendsList = data.userFriends; 
//                   ctrl.signedUpUsers = data.users

//                   friendSearch.autocomplete({
//                    minLength: 3,
//                    source: ctrl.signedUpUsers,
//                    position: { my: "left top", at: "left bottom" },
//                    appendTo: ".ui-widget"
//                  });
//              });
//       }
//     }
//   });
