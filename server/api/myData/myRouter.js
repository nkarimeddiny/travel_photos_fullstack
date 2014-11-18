'use strict';

var express = require('express');
var controller = require('./myData.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');
var router = express.Router();

/*
NOTE: These routes start with api/user.
*/

router.get('/sideBarInfo', auth.isAuthenticated(), controller.sideBarInfo);
router.get('/places', auth.isAuthenticated(), controller.getPlaces);
router.get('/accessInstagram', auth.isAuthenticated(), controller.getInstagramPhotos);
router.get('/accessInstagram/:nextMaxId', auth.isAuthenticated(), controller.getInstagramPhotos);
router.get('/posts', auth.isAuthenticated(), controller.getPosts);
router.get('/posts/:friendName', auth.isAuthenticated(), controller.getPosts);

router.post('/friend', auth.isAuthenticated(), controller.addFriend);
router.post('/post', auth.isAuthenticated(), controller.addPost);
router.post('/place', auth.isAuthenticated(), controller.addPlace);

router.post('/removePlace', auth.isAuthenticated(), controller.removePlace);
router.post('/removeFriend', auth.isAuthenticated(), controller.removeFriend);
router.post('/updateFriendsOrder', auth.isAuthenticated(), controller.updateFriendsOrder);
router.post('/removePost', auth.isAuthenticated(), controller.removePost);


module.exports = router;