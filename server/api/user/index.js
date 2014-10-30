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
router.get('/myPosts', auth.isAuthenticated(), controller.myPosts);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', controller.create);
router.post('/addFriend', controller.addFriend);
router.post('/addPost', auth.isAuthenticated(), controller.addPost);



// router.post('/posts', function(req, res) {
//   models.User.findOne({ 'name': req.body.username }).populate("posts").exec(function (err, user) {
//       res.send(user.posts).end();
//   });
// });



// router.post('/updateFriendsOrder', function(req, res) {
//    friendsOrder[req.body.username] = req.body.friends;
//    res.send(200).end();
// });

// var friendsOrder = {
// 	Navid: [
// 	 {name: "Joe", uncheckedPost: true, order: 1},
//      {name: "Jane", uncheckedPost: true, order: 2},
//      {name: "Rob", uncheckedPost: false, order: 3}
//      ]};

// var posts = {
// 	Joe : [{ 
//         yearmonthday: 20141001, 
//         month: 10, 
//         day: 1, 
//         caption: "picture of me in Tokyo"
//     }],
//     Jane : [{ 
//         yearmonthday: 20141005, 
//         month: 10, 
//         day: 5, 
//         caption: "picture of me in Seoul"
//     }],
//     Navid : [{ 
//         yearmonthday: 20141010, 
//         month: 10, 
//         day: 10, 
//         caption: "picture of me in London"
//     }],
//     Rob : [{ 
//         yearmonthday: 20141012, 
//         month: 10, 
//         day: 12, 
//         caption: "picture of me in Rio"
//     }]
// };

module.exports = router;
