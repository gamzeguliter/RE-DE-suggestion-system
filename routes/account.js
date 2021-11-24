const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middleware/authentication');
const accountController = require('../controllers/account');
const csrf = require('../middleware/csrf');

//////// ROUTES //////
router.get('/login',csrf, accountController.getLogin);  ///navigasyon barda Login butonuna basınca

router.post('/login'  ,csrf, accountController.postLogin); 

router.get('/register',csrf, accountController.getRegister); ///navigasyon barda  Register butonuna basınca

router.post('/register',csrf,accountController.postRegister);

router.get('/logout', csrf, isAuthenticated, accountController.getLogout); /// navigasyon barda Logout butonuna basınca

module.exports = router;