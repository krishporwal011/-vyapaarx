const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const validate = require('../middleware/validate');
const { registerSchema, loginSchema } = require('../validations/auth.validation');
const { protect } = require('../middleware/auth');

// @POST /api/auth/register
router.post('/register', validate(registerSchema), authController.register);

// @POST /api/auth/login
router.post('/login', validate(loginSchema), authController.login);

// @POST /api/auth/logout
router.post('/logout', authController.logout);

// @GET /api/auth/me
router.get('/me', protect, authController.getMe);

module.exports = router;
