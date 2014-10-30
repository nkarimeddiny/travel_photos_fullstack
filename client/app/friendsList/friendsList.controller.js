'use strict';

angular.module('travelPhotosApp')
  .controller('FriendslistCtrl', function ($scope) {
    $scope.message = 'Hello';
  });

  

var app = angular.module('travelPhotosApp');

app.controller('FriendsListCtrl', function($scope, $http, friendsListService) {

  var ctrl = this;
  friendsListService.getFriendsOrder("Navid",$http, ctrl, $scope);
  
  this.sortableOptions = {
    'ui-floating': true,
    stop: function( event, ui ) {
       friendsListService.updateFriendsOrder("Navid", $http, $scope);
    } 
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
