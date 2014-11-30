'use strict';

var User = require('../user/user.model');
var Post = require('../post/post.model');
var Place = require('../place/place.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
var request = require('request');

//getInstagramPhotos makes an api call to Instagram for a user who has already authorized
//the travelPhotos app to access their photos. Whenever a user signs into travelPhotos
//through Instagram, they get an access token that is stored in the database along with
//their instagram id number
exports.getInstagramPhotos = function(req, res, next) {
    var user = req.user;
    if (req.params.nextMaxId) {
      var url = "https://api.instagram.com/v1/users/" + user.instagram.data.id + 
                 "/media/recent/?access_token=" + user.accessToken + "&max_id=" + req.params.nextMaxId;
    }
    else {
      var url = "https://api.instagram.com/v1/users/" + user.instagram.data.id + 
                 "/media/recent/?access_token=" + user.accessToken + "&count=10";
    } 
    request.get(url, function(err, response, body) {
        res.send(body);
    });
};

//populateUserAndFriendList is a helper function called by 4 of the user.controller
//functions. It populates a user's array of friends, then iterates through the array
//and compares the last time each friend posted against the last time the user checked
//their posts, to determine if the friend has one or more unchecked posts. While
//iterating, it also builds the friendList array, with friends in the correct order.
//If populateUserAndFriendList was called by updateFriendsOrder, before building the 
//friendList array it will first adjust each friend's orderNumber according to user
//input. A new friendList array is then created using the filter method, with any 
//null elements filtered out. Depending on where the populateUserAndFriendList function
//was called from, friendList may be sent back to the client at this point, but if called
//from updateFriendsOrder, the updated user document must first be saved. If called from
//sideBarInfo, a list of all signed-up users is generated.
var populateUserAndFriendList = function(res, updatedUser, users, newFriendsOrder) {
      
      User.populate(updatedUser, { path: 'friends.friend' , model: "User"}, 
          
          function (err, updatedUser) {
          
            var friendList = [];
            updatedUser.friends.forEach(function(aFriend){
      
              if (newFriendsOrder) {
                aFriend.orderNumber = newFriendsOrder[aFriend.friend.name];
              }
      
              var uncheckedPost = false;  
      
              if (aFriend.friend.lastTimePosted > aFriend.lastTimeChecked) {
                uncheckedPost = true;
              }

              //friends are properly ordered by adding them to the friendList
              //array at the index corresponding to their orderNumber. 
              //If one or more friends have been removed since the last time
              //updateFriendsOrder was called, there will be one or more indices
              //in the friendList array which are not assigned to an element,
              //and will therefore be null
              friendList[aFriend.orderNumber] = {name: aFriend.friend.name, 
                                               uncheckedPost: uncheckedPost};
            });
            
            friendList = friendList.filter(function(el){
              return el !== null;
            }); 
            
            if (users) {
              var userList = [];
            
              users.forEach(function(aUser){
                userList.push(aUser.name);
              });
            
              res.send({"username": updatedUser.name, userFriends: friendList, 
                        "users": userList}).end();
            }
            
            else if (newFriendsOrder) {          
              updatedUser.save(function(err, user){
                res.send({userFriends: friendList});
              });          
            }
            
            else {
              res.send({userFriends: friendList});
            }
      });
};

//addPost creates a new Post document, then adds the id of the new post
//to the current user's posts array. The user's lastTimePosted is also
//updated, then the updated User document is saved and the posts array
//is populated and returned to the client
exports.addPost = function(req, res, next) {
  Post.create({user: req.user._id, imageId: req.body.imageId, 
              instagramLink: req.body.instagramLink, 
              imageLink: req.body.imageLink, 
              caption: req.body.caption}, 
    function(err, post) {
      if (err) return next(err);
      if (!post) return res.send(401);
      req.user.posts.push(post._id);
      req.user.lastTimePosted = Date.now();
      req.user.save(function(err, user) {
        if (err) return next(err);
        if (!user) return res.send(401);
        User.populate(user, { path: 'posts' , model: "Post"},
          function (err, user) {
            if (err) return next(err);
            if (!user) return res.send(401);
            res.send(user.posts).end();
          });
      });
    })
};

//getPosts populates one user's posts array and sends it to the client. This can be the 
//client's posts array, or the posts array of a friend whose posts they've requested. 
//If a friend's posts have been requested, req.params.friendName will be defined and the 
//friend's document will be retrieved before the posts are populated
exports.getPosts = function(req, res, next) {
  
  var me = req.user;
  var myId = req.user._id;
  
  if (req.params.friendName) {

    User.findOne({name: req.params.friendName}, '-salt -hashedPassword', function(err, user) {
      if (err) return next(err);
      if (!user) return res.json(401);
      User.populate(user, { path: "posts" , model: "Post"}, function (err, user) {
         //if retrieving a friend's posts, also retrieve current user's document, 
         //iterate through friends' id's, find the friend, and update lastTimeChecked   
          me.friends.forEach(function(aFriend) {
            if (String(aFriend.friend) === String(user._id)) {
              aFriend.lastTimeChecked = Date.now();
            }
          });
          me.save(function(err, updatedUser) {
              res.send({posts: user.posts}).end();
          });
      });
    });
  }

  else {

    User.populate(me, { path: "posts" , model: "Post"}, function (err, user) {
      res.send({posts: user.posts}).end();
    });
  }

};

//removePost removes a single post from a user's posts array, and
//removes that post's document from the Post collection. The user's
//lastTimePosted variable is also re-assigned, in case the user's
//most recent post has been deleted, or if they have deleted all 
//of their posts
exports.removePost = function(req, res, next) {
  var postId = req.body.postId;
    req.user.posts.remove(postId);
    req.user.save(function(err, user) {
      if (err) return next(err);
      if (!user) return res.send(401);
      Post.remove({_id : postId}, function(err, numberRemoved) {
        if (err) return next(err);
        if (!numberRemoved) return res.send(401);
        User.populate(user, { path: 'posts' , model: "Post"}, 
          function (err, user) {
             if (err) return next(err);
             if (!user) return res.send(401);
             if (user.posts.length > 0) {
               user.lastTimePosted = user.posts[user.posts.length - 1].date;
             }
             else {
               user.lastTimePosted = null;
             }
             user.save(function(err, updatedUser) {
               if (err) return next(err);
               if (!updatedUser) return res.send(401);
               res.send(user.posts).end();
             });
        });
      });
  });    
};

//addPlace creates a new document in the Place collection, and
//adds the id of that document to the user's places array. It then
//populates the places array, and returns the populated array to the user
exports.addPlace = function(req, res, next) {
  Place.create({user: req.user._id, 
                location: req.body.location,
                text: req.body.text,
                latitude: req.body.latitude,
                longitude: req.body.longitude
                }, 
    function(err, place) {
      if (err) return next(err);
      if (!place) return res.send(401);
      req.user.places.push(place._id);
      req.user.save(function(err, user) {
        if (err) return next(err);
        if (!user) return res.send(401);
        User.populate(user, { path: 'places' , model: "Place"}, 
          function (err, user) {
            if (err) return next(err);
            if (!user) return res.send(401);
            res.send(user.places).end();
          });
      });
    })
};

//getPlaces populates a user's places array, then returns the 
//populated array to the user
exports.getPlaces = function(req, res, next) {
  User.populate(req.user, { path: 'places' , model: "Place"}, 
      function (err, user) {
        if (err) return next(err);
        if (!user) return res.send(401);
        res.send({placesToGo: user.places});
    });
};

//removePlace removes a place id from a user's places array, and also removes
//that place's document from the Place collection. It then returns a 
//populated places array to the user 
exports.removePlace = function(req, res, next) {
  var placeId = req.body.placeId;
  req.user.places.remove(placeId);
  req.user.save(function(err, user) {
    if (err) return next(err);
    if (!user) return res.send(401);
    Place.remove({_id : placeId}, function(err, numberRemoved) {
      if (err) return next(err);
      if (!numberRemoved) return res.send(401);
      User.populate(user, { path: 'places' , model: "Place"}, 
        function (err, user) {
          if (err) return next(err);
          if (!user) return res.send(401);
          res.send(user.places).end();
      });
    });
  });
};

//updateFriendsOrder calls populateUserAndFriendList, passing references to 
//the user's document and req.body.friendsOrder
exports.updateFriendsOrder = function (req, res, next) {
  populateUserAndFriendList(res, req.user, null, req.body.friendsOrder);
};

//addFriend finds the document of the friend being added (in order to find that friend's id),
//and adds an object to the current user's friends array. It then saves the updated user 
//document, and calls populateUserAndFriendList, passing the reference to the 
//updatedUser document
exports.addFriend = function (req, res, next) {
  User.findOne({name: req.body.friend},  '-salt -hashedPassword', function (err, friend) {
    if (err) return next(err);
    if (!friend) return res.send(401);
    var len = req.user.friends.length;
    req.user.friends.push({friend: friend._id, orderNumber: len,lastTimeChecked: ""});
    req.user.save(function(err, updatedUser){
      if (err) return next(err);
      if (!updatedUser) return res.send(401);
      populateUserAndFriendList(res, updatedUser, null, null);
    });
  });
};

//sideBarInfo finds all users' documents, and passes references to the current user's
//document and an array of all users' documents to populateUserAndFriendList
exports.sideBarInfo = function(req, res, next) {
  User.find({}, '-salt -hashedPassword', function (err, users) {
    if (err) return next(err);
    if (!users) return res.send(401);
    populateUserAndFriendList(res, req.user, users, null);
  });
};

//removeFriend finds the document of the friend being removed (in order
//to find their id), then iterates through the current user's array of friend 
//objects, creating a new array of friend objects (newFriendsArr) that does not 
//include the removed friend. It then assigns the user's friends field to newFriendsArr 
//and calls populateUserAndFriendList, passing a reference to the updatedUser document
exports.removeFriend = function (req, res, next) {
  var friendName = req.body.friendName;
  User.findOne({name: friendName},  '-salt -hashedPassword', function (err, friend) {
    if (err) return next(err);
    if (!friend) return res.send(401);
    var newFriendsArr = req.user.friends.filter(function(aFriend) {
      return String(aFriend.friend) !== String(friend._id);
    });
    req.user.friends = newFriendsArr;
    req.user.save(function(err, updatedUser) {
      if (err) return next(err);
      if (!updatedUser) return res.send(401);
      populateUserAndFriendList(res, updatedUser, null, null);
    });
  });
};
