'use strict';

var express = require('express');
var controller = require('./user.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

//router.get('/', auth.hasRole('admin'), controller.index);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/me', auth.isAuthenticated(), controller.me);
//router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', controller.create);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.get('/sideBarInfo', auth.isAuthenticated(), controller.sideBarInfo);
router.post('/getPosts', auth.isAuthenticated(), controller.getPosts);
router.post('/addFriend', auth.isAuthenticated(), controller.addFriend);
router.post('/removeFriend', auth.isAuthenticated(), controller.removeFriend);
router.post('/addPost', auth.isAuthenticated(), controller.addPost);
router.post('/addPlace', auth.isAuthenticated(), controller.addPlace);
router.get('/retrievePlaces', auth.isAuthenticated(), controller.retrievePlaces);
router.post('/removePlace', auth.isAuthenticated(), controller.removePlace);
router.post('/updateFriendsOrder', auth.isAuthenticated(), controller.updateFriendsOrder);
router.post('/removePost', auth.isAuthenticated(), controller.removePost);
router.get('/accessInstagram', auth.isAuthenticated(), controller.getInstagramPhotos);

module.exports = router;
