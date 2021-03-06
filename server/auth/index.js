'use strict';

var express = require('express');
var passport = require('passport');
var config = require('../config/environment');
var User = require('../api/user/user.model');

// Passport Configuration
require('./local/passport').setup(User, config);
// require('./facebook/passport').setup(User, config);
require('./instagram/passport').setup(User, config);

var router = express.Router();

router.use('/local', require('./local'));
router.use('/instagram', require('./instagram'));
// router.use('/facebook', require('./facebook'));

module.exports = router;