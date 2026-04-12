import jwt from 'jsonwebtoken';

// Generate JWT Token
export const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Verify JWT Token
export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

// Create token payload
export const createTokenPayload = (user) => {
  return {
    id: user._id,
    email: user.email,
    role: user.role
  };
};
