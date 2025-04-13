const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../models/User');

// Helper function to generate JWT
function generateToken(user) {
  const payload = { id: user._id, name: user.name };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
  return token;
}

// Middleware to protect routes
function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.sendStatus(401);
  const token = authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    // Attach user to request if needed (fetch from DB)
    User.findById(decoded.id).select('-password').exec((err, user) => {
      if (err || !user) return res.sendStatus(403);
      req.user = user;
      next();
    });
  });
}

// Sign up
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: '모든 필드를 입력하세요.' });
    }
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: '이미 사용중인 이메일입니다.' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashed });
    const token = generateToken(newUser);
    return res.json({ token, user: { _id: newUser._id, name: newUser.name, email: newUser.email } });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: '서버 에러' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }
    if (!user.password) {
      return res.status(400).json({ message: '소셜 로그인 계정입니다. 카카오 로그인을 이용하세요.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }
    const token = generateToken(user);
    return res.json({ token, user: { _id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: '서버 에러' });
  }
});

// Kakao OAuth simulate
router.get('/kakao/callback', async (req, res) => {
  try {
    // Simulate retrieving Kakao user info (in real case, use Kakao API with auth code)
    const kakaoId = 'kakao-demo-id';
    let user = await User.findOne({ kakaoId });
    if (!user) {
      // Create a dummy kakao user if not exists
      user = await User.create({
        name: '카카오사용자',
        email: `kakao_${Date.now()}@example.com`,
        kakaoId
      });
    }
    const token = generateToken(user);
    return res.json({ token, user: { _id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error('Kakao login error:', err);
    res.status(500).json({ message: '카카오 로그인 실패' });
  }
});

// Get current user info
router.get('/me', authMiddleware, (req, res) => {
  return res.json({ _id: req.user._id, name: req.user.name, email: req.user.email });
});

module.exports = router;
