'use strict';

var express = require('express');
var controller = require('../user/user.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');
var router = express.Router();

/*
NOTE: These routes start with api/user.
*/

router.get('/sideBarInfo', auth.isAuthenticated(), controller.sideBarInfo);
//can change to get(/posts)
router.post('/getPosts', auth.isAuthenticated(), controller.getPosts);
router.post('/addFriend', auth.isAuthenticated(), controller.addFriend);
router.post('/removeFriend', auth.isAuthenticated(), controller.removeFriend);
//can change to post(/post)
router.post('/addPost', auth.isAuthenticated(), controller.addPost);
router.post('/addPlace', auth.isAuthenticated(), controller.addPlace);
router.get('/retrievePlaces', auth.isAuthenticated(), controller.retrievePlaces);
router.post('/removePlace', auth.isAuthenticated(), controller.removePlace);
router.post('/updateFriendsOrder', auth.isAuthenticated(), controller.updateFriendsOrder);
router.post('/removePost', auth.isAuthenticated(), controller.removePost);
router.get('/accessInstagram', auth.isAuthenticated(), controller.getInstagramPhotos);

module.exports = router;