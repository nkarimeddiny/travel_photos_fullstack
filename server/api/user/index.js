'use strict';

var express = require('express');
var controller = require('./user.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/me', auth.isAuthenticated(), controller.me);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.post('/getPosts', auth.isAuthenticated(), controller.getPosts);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', controller.create);
router.post('/addFriend', controller.addFriend);
router.post('/addPost', auth.isAuthenticated(), controller.addPost);
router.post('/updateFriendsOrder', auth.isAuthenticated(), controller.updateFriendsOrder);
router.post('/removePost', auth.isAuthenticated(), controller.removePost);

module.exports = router;
