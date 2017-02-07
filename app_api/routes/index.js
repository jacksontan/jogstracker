var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({
  secret: 'MY_SECRET',
  userProperty: 'payload'
});

var ctrlProfile = require('../controllers/profile');
var ctrlJogs = require('../controllers/jogsController');
var ctrlAuth = require('../controllers/authentication');
var ctrlUserlist = require('../controllers/userlist');

// profile
router.get('/profile', auth, ctrlProfile.profileRead);

//userlist
router.get('/userlist', auth, ctrlUserlist.userlistRead);
router.put('/userlist', auth, ctrlUserlist.updateUser);

//jogs
router.get('/jogs', auth, ctrlJogs.getOwnJogs);
router.get('/jogs/accountType/:accountType', auth, ctrlJogs.getJogsByAccountType);
router.post('/jogs', auth, ctrlJogs.createJog);
router.delete('/jogs/:id', auth, ctrlJogs.deleteJog);
router.put('/jogs', auth, ctrlJogs.updateJog);

router.get('/jogs/reports', auth, ctrlJogs.getWeeklyJogReport);

// authentication
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);
router.post('/changepassword', ctrlAuth.changepassword);

router.get('/logout', function(req, res) {
  req.logout();
  res.status(200).json({
    status: 'Bye!'
  });
});
module.exports = router;
