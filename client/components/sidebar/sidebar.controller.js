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
  ctrl.thisUserId;
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

  $http.get("http://localhost:9000/api/users/me")
             .success( function(data) {
              console.log(data);
                  ctrl.thisUserId = data.userId;
                  ctrl.thisUserName = data.username;
                  ctrl.myFriendsList = data.userFriends; 
                  ctrl.signedUpUsers = data.users
    });
   this.goToLink = function(param) {
      if (param === "myPosts") {
        $state.go("myPosts"); 
      }
      else {
        console.log("param: " + param)
        $state.go("friendPosts", {friendName: param}); 
      }
   };          

   this.addFriend = function() {

      $http.post("http://localhost:9000/api/users/addFriend", {
                user: ctrl.thisUserId,
                friend: addFriendForm.friend.value
                })
             .success( function(data) {
                console.log(data);
               }); 
    }; 
  // friendsListService.getFriendsOrder("Navid",$http, ctrl, $scope);
  
  // this.sortableOptions = {
  //   'ui-floating': true,
  //   stop: function( event, ui ) {
  //      friendsListService.updateFriendsOrder("Navid", $http, $scope);
  //   } 
  // };



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
