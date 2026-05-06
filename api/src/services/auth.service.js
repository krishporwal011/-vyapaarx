const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../utils/prisma');
const AppError = require('../utils/AppError');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const registerUser = async (userData) => {
  const { name, email, password, businessName } = userData;

  const userExists = await prisma.user.findUnique({ where: { email } });
  if (userExists) {
    throw new AppError('User already exists', 400);
  }

  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      businessName,
    },
  });

  const token = generateToken(user.id);
  return { user, token };
};

const loginUser = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });
  
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = generateToken(user.id);
  return { user, token };
};

module.exports = {
  registerUser,
  loginUser,
};
