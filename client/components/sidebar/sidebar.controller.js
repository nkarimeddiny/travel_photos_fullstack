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
      ctrl.myFriendsList.forEach(function(friend, index){
          ctrl.friendsOrderObject[friend] = index + 1;
      });
      $http.post("http://localhost:9000/api/users/updateFriendsOrder", {friendsOrder : ctrl.friendsOrderObject})
             .success( function(data) {
                 console.log(data);
                 console.log(data.userFriends);
                 ctrl.myFriendsList = data.userFriends; 
     });
    } 
  };
  
  var friendSearch = $("#friendSearch");

  $(".ui-widget").on("click", ".ui-menu-item", function(event){
      ctrl.addFriend($(event.target).text());
  });

  friendSearch.keydown(function(event) {
     if (event.keyCode === 13) {
       event.preventDefault();
     }
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

  $http.post("http://localhost:9000/api/users/removeFriend", {
                friendName: friendName
                })
             .success( function(data) {
                ctrl.myFriendsList = data.userFriends; 
               }); 
    };           

   this.addFriend = function() {

      $http.post("http://localhost:9000/api/users/addFriend", {
                friend: addFriendForm.friend.value
                })
             .success( function(data) {
                console.log(data.userFriends);
                ctrl.myFriendsList = data.userFriends; 
               }); 
    };
    this.goToLink = function(param) {
          $state.go("friendPosts", {friendName: param}); 
    };
   });

app.factory("friendsListService", function() {
    return {
      updateFriendsOrder : function(username, $http, $scope) {
          $http.post("http://localhost:3000/updateFriendsOrder", {username: username, friends: $scope.friends}).success(function(data){
              console.log(data);
             });
          },
      getFriendsOrder : function(username, $http, ctrl, $scope) {
          $http.post("http://localhost:3000/getFriendsOrder", {username: username}).success(function(data){
              $scope.friends = data;
             });
          }
      }
    });
