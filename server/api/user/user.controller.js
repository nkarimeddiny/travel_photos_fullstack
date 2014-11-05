'use strict';

var User = require('./user.model');
var Post = require('../post/post.model');
var Place = require('../place/place.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
//require socket io
var request = require('request');

var validationError = function(res, err) {
  return res.json(422, err);
};

exports.getInstagramPhotos = function(req, res, next) {
    var userId = req.user._id;
    User.findById(userId,  '-salt -hashedPassword', function (err, user) { 
        request.get("https://api.instagram.com/v1/users/" + user.instagram.data.id + "/media/recent/?access_token=" + user.accessToken + "&count=10",
          function(err, response, body) {
            res.send(body);
          });
    });
};

exports.addPost = function(req, res, next) {
    var userId = req.user._id;
    User.findById(userId,  '-salt -hashedPassword', function (err, user) {
        Post.create({user: user._id, imageLink: req.body.imageLink, caption: req.body.caption}, function(err, post) {
                user.posts.push(post._id);
                user.lastTimePosted = Date.now();
                user.save(function(err, user) {
                  User.populate(user, { path: 'posts' , model: "Post"}, function (err, user) {
                      res.send(user.posts).end();
                  });
                });

        })
    });
};

exports.addPlace = function(req, res, next) {
    var userId = req.user._id;
    User.findById(userId,  '-salt -hashedPassword', function (err, user) {
        Place.create({user: user._id, 
                      location: req.body.location,
                      text: req.body.text,
                      latitude: req.body.latitude,
                      longitude: req.body.longitude
                     }, function(err, place) {
                user.places.push(place._id);
                user.save(function(err, user) {
                  User.populate(user, { path: 'places' , model: "Place"}, function (err, user) {
                      res.send(user.places).end();
                  });
                });

        })
    });
};

exports.retrievePlaces = function(req, res, next) {
    var userId = req.user._id;
    User.findById(userId,  '-salt -hashedPassword', function (err, user) {
      if (err) return next(err);
      if (!user) return res.json(401);
      User.populate(user, { path: 'places' , model: "Place"}, 
          function (err, user) {
              res.send({placesToGo: user.places});
      });
    });
};

exports.removePlace = function(req, res, next) {
    var userId = req.user._id;
    var placeId = req.body.placeId;
    User.findById(userId,  '-salt -hashedPassword', function (err, user) {
        user.places.remove(placeId);
        user.save(function(err, user) {
          Place.remove({_id : placeId}, function(err, numberRemoved) {
            User.populate(user, { path: 'places' , model: "Place"}, 
                function (err, user) {
                  res.send(user.places).end();
            });
          });
        });
    });
};

exports.removePost = function(req, res, next) {
    var userId = req.user._id;
    var postId = req.body.postId;
    User.findById(userId,  '-salt -hashedPassword', function (err, user) {
        user.posts.remove(postId);
        user.save(function(err, user) {
        Post.remove({_id : postId}, function(err, numberRemoved) {
          User.populate(user, { path: 'posts' , model: "Post"}, 
             function (err, user) {
               if (user.posts.length > 0) {
                 user.lastTimePosted = user.posts[user.posts.length - 1].date;
               }
               else {
                 user.lastTimePosted = null;
               }
               user.save(function(updatedUser) {
                 res.send(user.posts).end();
               });
          });
       });

    });
   });     
};


var populateUserAndFriendList = function(res, updatedUser, users, newFriendsOrder) {
      User.populate(updatedUser, { path: 'friends.friend' , model: "User"}, function (err, updatedUser) {
         var friendList = [];
         updatedUser.friends.forEach(function(aFriend){
           if (newFriendsOrder) {
             aFriend.orderNumber = newFriendsOrder[aFriend.friend.name];
           }
           var uncheckedPost = false;  
           if (aFriend.friend.lastTimePosted > aFriend.lastTimeChecked) {
             uncheckedPost = true;
           }
           friendList[aFriend.orderNumber] = {name: aFriend.friend.name, 
                                             uncheckedPost: uncheckedPost};
         });
         if (users) {
           var userList = [];
           users.forEach(function(aUser){
             userList.push(aUser.name);
          });
           res.send({"username": updatedUser.name, userFriends: friendList.slice(1), "users": userList}).end();
         }
         else if (newFriendsOrder) {
            updatedUser.save(function(err, user){
               res.send({userFriends: friendList.slice(1)});
            });
         }
         else {
           res.send({userFriends: friendList.slice(1)});
          }
       });
};

exports.updateFriendsOrder = function (req, res, next) {
  //get this user's ID:
  var userId = req.user._id;
  User.findOne({
    _id: userId
  }, '-salt -hashedPassword', function(err, user) { // don't ever give out the password or salt
    if (err) return next(err);
    if (!user) return res.json(401);
       populateUserAndFriendList(res, user, null, req.body.friendsOrder);
});
};


exports.addFriend = function (req, res, next) {
  var userId = req.user._id;
  User.findById(userId, '-salt -hashedPassword', function (err, user) {
    if (err) return next(err);
    if (!user) return res.send(401);
    //get friend's ID:
    User.findOne({name: req.body.friend},  '-salt -hashedPassword', function (err, friend) {
       var len = user.friends.length;
       user.friends.push({friend: friend._id, orderNumber: len + 1,lastTimeChecked: ""});
       user.save(function(err, updatedUser){
         populateUserAndFriendList(res, updatedUser, null, null);
    });
  });
});
}

exports.removeFriend = function (req, res, next) {
  var userId = req.user._id;
  var friendName = req.body.friendName;
   User.findOne({name: friendName},  '-salt -hashedPassword', function (err, friend) {
      User.findById(userId,  '-salt -hashedPassword', function (err, user) {
        if (err) return next(err);
        if (!user) return res.send(401);
        var newFriendsArr = user.friends.filter(function(aFriend){
            return String(aFriend.friend) !== String(friend._id);
        });
        user.friends = newFriendsArr;
        user.save(function(err, updatedUser){
           populateUserAndFriendList(res, updatedUser, null, null);
        });
      });
   });
};

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function(req, res) {
  User.find({}, '-salt -hashedPassword', function (err, users) {
    if(err) return res.send(500, err);
    res.json(200, users);
  });
};

/**
 * Creates a new user
 */
exports.create = function (req, res, next) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.role = 'user';
  newUser.save(function(err, user) {
    if (err) return validationError(res, err);
    var token = jwt.sign({_id: user._id }, config.secrets.session, { expiresInMinutes: 60*5 });
    res.json({ token: token });
  });
};

/**
 * Get a single user
 */
exports.show = function (req, res, next) {
  var userId = req.params.id;

  User.findById(userId,  '-salt -hashedPassword', function (err, user) {
    if (err) return next(err);
    if (!user) return res.send(401);
    res.json(user.profile);
  });
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
  User.findByIdAndRemove(req.params.id,  '-salt -hashedPassword', function(err, user) {
    if(err) return res.send(500, err);
    return res.send(204);
  });
};

/**
 * Change a users password
 */
exports.changePassword = function(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findById(userId,  '-salt -hashedPassword', function (err, user) {
    if(user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function(err) {
        if (err) return validationError(res, err);
        res.send(200);
      });
    } else {
      res.send(403);
    }
  });
};
exports.getPosts = function(req, res, next) {
  var myId = req.user._id;
  if (req.body.friendName){
    var searchCriteria = {name: req.body.friendName};
  }
  else {
    var searchCriteria = {_id: myId};
  }

  User.findOne(searchCriteria //{_id: userId}
  , '-salt -hashedPassword', function(err, user) { // don't ever give out the password or salt
    if (err) return next(err);
    if (!user) return res.json(401);
      User.populate(user, { path: "posts" , model: "Post"}, function (err, user) {
        //if checking a friend's posts, need to retrieve my own model, iterate through
        //friends, find the friend by id, and update lastTimeChecked
        if (req.body.friendName) {
            User.findById(myId,  '-salt -hashedPassword', function (err, me) {
                if (err) return next(err);
                if (!user) return res.send(401);
                me.friends.forEach(function(aFriend){
                  if (String(aFriend.friend) === String(user._id)){
                    aFriend.lastTimeChecked = Date.now();
                  }
                });
                me.save(function(err, updatedUser){
                    res.send({posts: user.posts}).end();
                });
            });
        }
        else{
          res.send({posts: user.posts}).end();
        }
      });
  });
};



/**
 * Get my info
 */
/**
 * Get my info
 */
exports.me = function(req, res, next) {
  var userId = req.user._id;
  User.findOne({
    _id: userId
  }, '-salt -hashedPassword', function(err, user) { // don't ever give out the password or salt
    if (err) return next(err);
    if (!user) return res.json(401);
    res.json(user);
  });
};

exports.sideBarInfo = function(req, res, next) {
  var userId = req.user._id;
  User.findOne({
    _id: userId
  }, '-salt -hashedPassword', function(err, user) { // don't ever give out the password or salt
    if (err) return next(err);
    if (!user) return res.json(401);
    User.find({}, '-salt -hashedPassword', function (err, users) {
      if(err) return res.send(500, err);
      populateUserAndFriendList(res, user, users, null);
    });
  });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};
