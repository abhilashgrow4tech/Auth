const express = require('express');
const { verifyOTP, updateUserData, verifyOTPAndUpdateUser } = require('../controllers/authController');
const router = express.Router();

// Route to verify OTP and login/register
router.post('/user/verify', verifyOTP);

// Route to update user data after second OTP verification
router.post('/user/update', updateUserData);

// router.post('/user/verifyotp', verifyOTPAndUpdateUser);
router.post('user/verifyotp', verifyOTPAndUpdateUser);

module.exports = router;
