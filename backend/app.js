// app.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const leaveRoutes = require('./routes/leaveRoutes');

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); // ✅ 解析 JSON 請求的核心

app.use('/api/auth', authRoutes);
app.use('/api/leave', leaveRoutes);

app.listen(port, () => {
  console.log(`後端伺服器啟動：http://localhost:${port}`);
});
