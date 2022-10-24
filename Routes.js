const router = require('express').Router();
const authController = require('./Controller/auth-controller');
const activateController = require('./Controller/activate-controller')


router.post('/api/send-otp',authController.sendOtp)
router.post('/api/verify-otp',authController.verifyOtp)
router.post('/api/activate',activateController.activate)


module.exports = router;