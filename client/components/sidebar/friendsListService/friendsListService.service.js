'use strict';

angular.module('travelPhotosApp')
  .factory("friendsListService", function() {
    return {
     
      //addFriend method is called by sidebar controller
      //when the user clicks on a name in the list produced
      //by autocomplete of friendSearch. It takes the name
      //of a friend, which it sends to the server, and 
      //then assigns myFriendsList to data.userFriends,
      //which is an array containing an object for each
      //of the user's friends 
      addFriend : function(friend, ctrl, $http) {
          $http.post("api/users/addFriend", {
              friend: friend
           })
             .success( function(data) {
                ctrl.myFriendsList = data.userFriends; 
           }); 
      },

      //removeFriend method is called by sidebar controller
      //when the user clicks on the remove button next 
      //to a friend's name. It takes the name
      //of a friend, which it sends to the server, and 
      //then assigns myFriendsList to data.userFriends,
      //which is an array containing an object for each
      //of the user's friends 
      removeFriend : function(friendName, ctrl, $http) {
          $http.post("api/users/removeFriend", {
                friendName: friendName
           })
             .success( function(data) {
                ctrl.myFriendsList = data.userFriends;
           }); 
      },

      //updateFriendsOrder method is called by sidebar controller
      //whenever a user has just re-sorted their list of friends,
      //therefore triggering a "stop" event. It takes myFriendsList,
      //which is rearranged after sorting, and iterates through
      //the array, populating friendsOrderObject with the name of each
      //friend, and their new order number. It then sends the 
      //friendsOrderObject to the server, and in the callback function 
      //assigns myFriendsList to data.userFriends, which is an array 
      //containing an object for each of the user's friends.
      updateFriendsOrder : function(ctrl, $http) {
          ctrl.myFriendsList.forEach(function(friend, index){
             ctrl.friendsOrderObject[friend.name] = index;
          });
         $http.post("api/users/updateFriendsOrder", 
                    {friendsOrder : ctrl.friendsOrderObject})
             .success( function(data) {
                 ctrl.myFriendsList = data.userFriends; 
         });
      },

      //initializeSidebar method is called by sidebar controller
      //whenever sidebar.html template is loaded. It takes
      //the variable assigned to a DOM element which will be used
      //for searching for friends, and in the callback function 
      //assigns myFriendsList to data.userFriends,
      //which is an array containing an object for each
      //of the user's friends. It also assigns signedUpUsers
      //to data.users, which is an array containing the names
      //of people who have signed up for the app, and initializes
      //the autocomplete functionality for friendSearch
      initializeSidebar: function(friendSearch, ctrl, $http) {
           $http.get("api/users/sideBarInfo")
             .success( function(data) {
                  ctrl.myFriendsList = data.userFriends; 
                  ctrl.signedUpUsers = data.users;

                  friendSearch.autocomplete({
                    minLength: 2,
                    source: ctrl.signedUpUsers,
                    position: { my: "left top", at: "left bottom" },
                    appendTo: ".ui-widget"
                  });
            });
      }
    };
  });
