const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const SECRET = process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // 取得 Bearer 之後的 token

  if (!token) return res.status(401).json({ message: '未提供 token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
    req.user = decoded; // 把 user 資訊（含 id、role）存進 req.user
    next();
  } catch (err) {
    return res.status(403).json({ message: '無效的 token' });
  }
};

module.exports = authenticateToken;
