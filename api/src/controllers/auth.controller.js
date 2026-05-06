const { asyncHandler } = require('../middleware/errorHandler');
const authService = require('../services/auth.service');

const sendTokenResponse = (user, token, statusCode, res) => {
  const options = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  };

  res.status(statusCode).cookie('jwt', token, options).json({
    success: true,
    data: {
      _id: user.id, // using id for Prisma compatibility
      id: user.id,
      name: user.name,
      email: user.email,
      businessName: user.businessName,
      role: user.role,
    },
  });
};

const register = asyncHandler(async (req, res) => {
  const { user, token } = await authService.registerUser(req.body);
  sendTokenResponse(user, token, 201, res);
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, token } = await authService.loginUser(email, password);
  sendTokenResponse(user, token, 200, res);
});

const logout = asyncHandler(async (req, res) => {
  res.cookie('jwt', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: {},
  });
});

const getMe = asyncHandler(async (req, res) => {
  // req.user is set by the protect middleware
  res.json({
    success: true,
    data: req.user,
  });
});

module.exports = {
  register,
  login,
  logout,
  getMe,
};
