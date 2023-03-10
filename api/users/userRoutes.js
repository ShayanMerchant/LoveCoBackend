const express = require('express');
const auth = require('../../middleware/auth');
const router = express.Router();
const user = require('./userController');

router.get('/me', auth,  user.byId);

router.post('/signUp' , user.signUp);

router.post('/signIn', user.signIn);

router.post('/userImage/:id' , user.userImage);

router.put('/updateUser/:id', user.updateUser);

router.post('/userPasswordResetLink' , user.userPasswordResetLink);

router.post('/userPasswordReset/:id', user.userPasswordReset);

module.exports = router;