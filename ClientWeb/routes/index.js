var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('log_in', { title: 'Log in' });
});
router.get('/sign_in', function(req, res, next) {
    res.render('sign_in', { title: 'Sign in !' });
});
router.get('/irc', function(req, res, next) {
    res.render('irc', { title: 'Chat IRC' });
});

module.exports = router;
