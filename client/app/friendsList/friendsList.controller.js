'use strict';

angular.module('travelPhotosApp')
  .controller('FriendslistCtrl', function ($scope) {
    $scope.message = 'Hello';
  });

  

var app = angular.module('travelPhotosApp');

app.controller('FriendsListCtrl', function($scope, $http, friendsListService) {
  var ctrl = this;
  ctrl.myFriendsList = [];
  ctrl.sampleVar = "hello"

  $http.get("http://localhost:9000/api/users/me")
             .success( function(data) {
              console.log(data);
               // data.users.forEach(function(aUser) {
               //   ctrl.signedUpUsers.push(aUser);
               //   ctrl.thisUserId = data.userId;
               //   ctrl.thisUserName = data.username;
               // });
               data.userFriends.forEach(function(aFriend){
                 ctrl.myFriendsList.push(aFriend);
               }); 
               console.log(myFriendsList);
    });
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