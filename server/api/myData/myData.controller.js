'use strict';

var User = require('../user/user.model');
var Post = require('../post/post.model');
var Place = require('../place/place.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');

//getInstagramPhotos makes an api call to Instagram for a user who has already authorized
//the travelPhotos app to access their photos. Whenever a user signs into travelPhotos
//through Instagram, they get an access token that is stored in the database along with
//their instagram id number
exports.getInstagramPhotos = function(req, res, next) {
    var user = req.user;
    var photos = user.instagramCall(req.params.nextMaxId)
      .then(function(photos) {
        res.status(200).send(photos);
      })
      .then(function(error) {
        res.status(500).send("error");
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
              caption: req.body.caption,
              longitude: req.body.longitude,
              latitude: req.body.latitude}, 
    function(err, post) {
      if (err) return next(err);
      if (!post) return res.status(500).send("error");

      req.user.posts.push(post._id);
      req.user.lastTimePosted = Date.now();

      req.user.save(function(err, user) {
        if (err) return next(err);
        if (!user) return res.status(500).send("error");

        User.populate(user, { path: 'posts' , model: "Post"},
          function (err, user) {
            if (err) return next(err);
            if (!user) return res.status(500).send("error");
            res.status(200).send(user.posts);
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
      if (!user) return res.status(500).send("error");

      User.populate(user, { path: "posts" , model: "Post"}, function (err, user) {
        if (err) return next(err);
        if (!user) return res.status(500).send("error");

        me.updateLastTimeChecked(user);

        me.save(function(err, updatedUser) {
          if (err) return next(err);
          if (!updatedUser) return res.status(500).send("error");
          res.status(200).send({posts: user.posts}).end();
        });
      });
    });
  }

  else {

    User.populate(me, { path: "posts" , model: "Post"}, function (err, user) {
      if (err) return next(err);
      if (!user) return res.status(500).send("error");
      res.status(200).send({posts: user.posts}).end();
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
    if (!user) return res.status(500).send("error");
    
    Post.remove({_id : postId}, function(err, numberRemoved) {
      if (err) return next(err);
      if (!numberRemoved) return res.status(500).send("error");
      
      User.populate(user, { path: 'posts' , model: "Post"}, populateCallback);
      
      function populateCallback(err, user) {
         if (err) return next(err);
         if (!user) return res.status(500).send("error");
         
         user.changeLastTimePosted();

         user.save(function(err, updatedUser) {
           if (err) return next(err);
           if (!updatedUser) return res.status(500).send("error");
           res.status(200).send(user.posts).end();
         });
      };

    });
  });    
};

//addPlace creates a new document in the Place collection, and
//adds the id of that document to the user's places array. It then
//populates the places array, and returns the populated array to the user
exports.addPlace = function(req, res, next) {
  Place.create({user: req.user._id, 
                location: req.body.placeObj.location,
                text: req.body.placeObj.text,
                latitude: req.body.placeObj.latitude,
                longitude: req.body.placeObj.longitude,
                instagramLink: req.body.link
                }, 
    function(err, place) {
      if (err) return next(err);
      if (!place) return res.status(500).send("error");
      req.user.places.push(place._id);
      
      req.user.save(function(err, user) {
        if (err) return next(err);
        if (!user) return res.status(500).send("error");
        
        User.populate(user, { path: 'places' , model: "Place"}, 
          function (err, user) {
            if (err) return next(err);
            if (!user) return res.status(500).send("error");
            res.status(200).send(user.places).end();
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
        if (!user) return res.status(500).send("error");
        res.status(200).send({placesToGo: user.places});
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
    if (!user) return res.status(500).send("error");
  
    Place.remove({_id : placeId}, function(err, numberRemoved) {
      if (err) return next(err);
      if (!numberRemoved) return res.status(500).send("error");
  
      User.populate(user, { path: 'places' , model: "Place"}, 
        function (err, user) {
          if (err) return next(err);
          if (!user) return res.status(500).send("error");
          res.status(200).send(user.places).end();
      });
    });
  });
};

exports.updateFriendsOrder = function (req, res, next) {

  User.populate(req.user, { path: 'friends.friend' , model: "User"}, 
      
    function (err, updatedUser) {
      if (err) return next(err);
      if (!updatedUser) return res.status(500).send("error");

      var friendList = updatedUser.makeFriendList(req.body.friendsOrder);
            
      updatedUser.save(function(err, user){
        if (err) return next(err);
        if (!user) return res.status(500).send("error");
        res.status(200).send({userFriends: friendList});
      });          
        
  });

};


exports.addFriend = function (req, res, next) {

  var user = req.user;

  User.findOne({name: req.body.friend},  '-salt -hashedPassword', function (err, friend) {
    if (err) return next(err);
    if (!friend) return res.status(500).send("error");

    user.updateFriendsArr(friend);

    user.save(function(err, updatedUser){
      if (err) return next(err);
      if (!updatedUser) return res.status(500).send("error");

      User.populate(updatedUser, { path: 'friends.friend' , model: "User"}, 
          
        function (err, updatedUser) {
          if (err) return next(err);
          if (!updatedUser) return res.status(500).send("error");
                      
          var friendList = updatedUser.makeFriendList();
                    
          res.status(200).send({userFriends: friendList});
        
        });

  });
 });
}  

exports.sideBarInfo = function(req, res, next) {
  User.find({}, '-salt -hashedPassword', function (err, users) {
    if (err) return next(err);
    if (!users) return res.status(500).send("error");

      User.populate(req.user, { path: 'friends.friend' , model: "User"}, 
      
        function (err, updatedUser) {
          if (err) return next(err);
          if (!updatedUser) return res.status(500).send("error");
          
          var friendList = updatedUser.makeFriendList();
          
          var userList = User.makeUserList(users);

          res.status(200).send({"username": updatedUser.name, userFriends: friendList, 
                      "users": userList}).end();
       });
  });
};

//removeFriend finds the document of the friend being removed (in order
//to find their id), then iterates through the current user's array of friend 
//objects, creating a new array of friend objects (newFriendsArr) that does not 
//include the removed friend
exports.removeFriend = function (req, res, next) {
  var friendName = req.body.friendName;
  var user = req.user;

  User.findOne({name: friendName},  '-salt -hashedPassword', function (err, friend) {
    if (err) return next(err);
    if (!friend) return res.status(500).send("error");

    user.friends = user.makeNewFriendsArr(friend);
    
    user.save(function(err, updatedUser) {
      if (err) return next(err);
      if (!updatedUser) return res.status(500).send("error");

      User.populate(updatedUser, { path: 'friends.friend' , model: "User"}, 
          
        function (err, updatedUser) {
          if (err) return next(err);
          if (!updatedUser) return res.status(500).send("error");
          
          var friendList = updatedUser.makeFriendList();
          
          res.status(200).send({userFriends: friendList});
        });
  });
 });
}
