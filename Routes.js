const router = require('express').Router();
const authController = require('./Controller/auth-controller');
const activateController = require('./Controller/activate-controller');
const authMiddleware = require('./Middleware/auth-middleware');
const roomsController = require('./Controller/rooms-controller')


router.post('/api/send-otp',authController.sendOtp)
router.post('/api/verify-otp',authController.verifyOtp)
router.post('/api/activate',authMiddleware,activateController.activate)
router.get('/api/refresh',authController.refresh)
router.post('/api/logout',authMiddleware,authController.logout)
router.post('/api/room',authMiddleware,roomsController.create)
router.get('/api/room',authMiddleware,roomsController.index)

module.exports = router;