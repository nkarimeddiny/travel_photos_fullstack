'use strict';

var User = require('./user.model');
var Post = require('../post/post.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');

var validationError = function(res, err) {
  return res.json(422, err);
};

exports.addPost = function(req, res, next) {
    var userId = req.user._id;
    User.findById(userId, function (err, user) {
        Post.create({user: user._id, caption: req.body.caption}, function(err, post) {
                user.posts.push(post._id);
                user.save(function(err, user) {
                  User.populate(user, { path: 'posts' , model: "Post"}, function (err, user) {
                      res.send(user.posts).end();
                  });
                });

        })
    });
};

exports.updateFriendsOrder = function (req, res, next) {
  //get this user's ID:
  var userId = req.body.user;
  User.findById(userId, function (err, user) {
    if (err) return next(err);
    if (!user) return res.send(401);
       User.populate(user, { path: 'friends.friend' , model: "User"}, function (err, user) {
          var friendList = [];
          user.friends.forEach(function(aFriend){
            aFriend.orderNumber = req.body.friendsOrder[aFriend.name];
            friendList[aFriend.orderNumber] = aFriend.friend.name;
        });
        res.send({userFriends: friendList}).end();
      });

  });
};

exports.addFriend = function (req, res, next) {
  var userId = req.body.user;

  //get this user's ID:
  User.findById(userId, function (err, user) {
    if (err) return next(err);
    if (!user) return res.send(401);
    //get friend's ID:
    User.findOne({name: req.body.friend}, function (err, friend) {
      console.log("friend: " + friend);
      console.log("friendId " + friend._id);
       var len = user.friends.length;
       user.friends.push({friend: friend._id, orderNumber: len + 1,lastTimeChecked: ""});
       user.save(function(err, updatedUser){
         res.send(updatedUser);
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

  User.findById(userId, function (err, user) {
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
  User.findByIdAndRemove(req.params.id, function(err, user) {
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

  User.findById(userId, function (err, user) {
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
exports.myPosts = function(req, res, next) {
  var userId = req.user._id;
  User.findOne({
    _id: userId
  }, '-salt -hashedPassword', function(err, user) { // don't ever give out the password or salt
    if (err) return next(err);
    if (!user) return res.json(401);
      User.populate(user, { path: "posts" , model: "Post"}, function (err, user) {
        res.send(user.posts).end();
      });
  });
};



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
    User.find({}, '-salt -hashedPassword', function (err, users) {
      if(err) return res.send(500, err);
      User.populate(user, { path: 'friends.friend' , model: "User"}, function (err, user) {
        var userList = [];
        var friendList = [];
        users.forEach(function(aUser){
           userList.push(aUser.name);
        });
        user.friends.forEach(function(aFriend){
           friendList[aFriend.orderNumber] = aFriend.friend.name;
        });
        res.send({"username": user.name, "userId": user._id, userFriends: friendList, "users": userList}).end();
      });
    });
  });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};
