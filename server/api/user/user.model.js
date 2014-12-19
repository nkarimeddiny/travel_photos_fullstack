'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var authTypes = ['github', 'twitter', 'facebook', 'instagram', 'google'];
var request = require('request');

var User;

var UserSchema = new Schema({
  name: String,
  email: { type: String, lowercase: true },
  role: {
    type: String,
    default: 'user'
  },
  hashedPassword: String,
  provider: String,
  salt: String,
  instagram: {},
  accessToken: String,
  github: {},
  places: [{type: Schema.Types.ObjectId, ref: "Place"}],
  posts: [{type: Schema.Types.ObjectId, ref: "Post"}],
  friends: [{
      friend: {type: Schema.Types.ObjectId, ref: "User"},
      //compare lastTimeChecked to friend's lastTimePosted
      //to determine whether there is a new post
      lastTimeChecked: { type: Date },
      orderNumber: Number
  }],
  lastTimePosted: { type: Date }
});

/**
 * Virtuals
 */
UserSchema
  .virtual('password')
  .set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function() {
    return this._password;
  });

// Public profile information
UserSchema
  .virtual('profile')
  .get(function() {
    return {
      'name': this.name,
      'role': this.role
    };
  });

// Non-sensitive info we'll be putting in the token
UserSchema
  .virtual('token')
  .get(function() {
    return {
      '_id': this._id,
      'role': this.role
    };
  });

/**
 * Validations
 */

// Validate empty email
UserSchema
  .path('email')
  .validate(function(email) {
    if (authTypes.indexOf(this.provider) !== -1) return true;
    return email.length;
  }, 'Email cannot be blank');

// Validate empty password
UserSchema
  .path('hashedPassword')
  .validate(function(hashedPassword) {
    if (authTypes.indexOf(this.provider) !== -1) return true;
    return hashedPassword.length;
  }, 'Password cannot be blank');

// Validate email is not taken
UserSchema
  .path('email')
  .validate(function(value, respond) {
    var self = this;
    this.constructor.findOne({email: value}, function(err, user) {
      if(err) throw err;
      if(user) {
        if(self.id === user.id) return respond(true);
        return respond(false);
      }
      respond(true);
    });
}, 'The specified email address is already in use.');

// Validate username is not taken
UserSchema
  .path('name')
  .validate(function(value, respond) {
    var self = this;
    this.constructor.findOne({name: value}, function(err, user) {
      if(err) throw err;
      if(user) {
        if(self.id === user.id) return respond(true);
        return respond(false);
      }
      respond(true);
    });
}, 'The specified username is already in use.');  

var validatePresenceOf = function(value) {
  return value && value.length;
};

/**
 * Pre-save hook
 */
UserSchema
  .pre('save', function(next) {
    if (!this.isNew) return next();

    if (!validatePresenceOf(this.hashedPassword) && authTypes.indexOf(this.provider) === -1)
      next(new Error('Invalid password'));
    else
      next();
  });

/**
 * Methods
 */
UserSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword;
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */
  makeSalt: function() {
    return crypto.randomBytes(16).toString('base64');
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */
  encryptPassword: function(password) {
    if (!password || !this.salt) return '';
    var salt = new Buffer(this.salt, 'base64');
    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
  }
};


//makeFriendList iterates through the array of a user's friends and compares the 
//last time each friend posted against the last time the user checked
//their posts, to determine if the friend has one or more unchecked posts. While
//iterating, it also builds the friendList array, with friends in the correct order.
//If populateUserAndFriendList was called by updateFriendsOrder, before building the 
//friendList array it will first adjust each friend's orderNumber according to user
//input. 
UserSchema.methods.makeFriendList = function(newFriendsOrder) {
  var friendList = [];
  this.friends.forEach(function(aFriend){

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
  
  return friendList;
}

UserSchema.methods.makeNewFriendsArr = function(friend) {

  return this.friends.filter(function(aFriend) {
    return String(aFriend.friend) !== String(friend._id);
  });

}

UserSchema.methods.updateFriendsArr = function(friend) {

  var len = this.friends.length;
  this.friends.push({friend: friend._id, orderNumber: len,lastTimeChecked: ""});
  
  return this.friends;
}

UserSchema.methods.changeLastTimePosted = function() {

  if (this.posts.length > 0) {
    this.lastTimePosted = this.posts[this.posts.length - 1].date;
  }
  else {
    this.lastTimePosted = null;
  }

  return this.lastTimePosted;

}

UserSchema.methods.updateLastTimeChecked = function(user) {
  
  this.friends.forEach(function(aFriend) {
    if (String(aFriend.friend) === String(user._id)) {
      aFriend.lastTimeChecked = Date.now();
    }
  });

  return this;

}


UserSchema.methods.instagramCall = function(nextMaxId) {
  
  if (nextMaxId) {
    var url = "https://api.instagram.com/v1/users/" + this.instagram.data.id + 
            "/media/recent/?access_token=" + this.accessToken + "&max_id=" + 
            nextMaxId;
  }
  else {
    var url = "https://api.instagram.com/v1/users/" + this.instagram.data.id + 
              "/media/recent/?access_token=" + this.accessToken + "&count=10"; 
  }

  request.get(url, function(err, response, body) {
    if (err) {
      return "error";
    }
    else {
      console.log("body: ", body)
      return body;
    }
  });

};

UserSchema.statics.makeUserList = function(users) {

  var userList = [];
            
  users.forEach(function(aUser){
    userList.push(aUser.name);
  });

  return userList;
};

module.exports = mongoose.model('User', UserSchema);
