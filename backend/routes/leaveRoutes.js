// routes/leaveRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../middleware/auth'); // 引入驗證 middleware

router.post('/apply', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id; // ✅ 現在可以用 token 拿到登入者 id
    const { date, reason} = req.body;

    if (!date || !reason) {
      return res.status(400).json({ message: '請假日期與原因不得為空' });
    }

    await db.execute(
      'INSERT INTO leaves (user_id, date, reason, status) VALUES (?, ?, ?, ?)',
      [userId, date, reason, 'pending']
    );

    res.json({ message: '請假申請成功！' });
  } catch (err) {
    res.status(500).json({ message: '請假失敗', error: err.message });
  }
});

//老闆查看所請假狀態API
router.get('/all', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT l.id, u.username, l.date, l.reason, l.status
      FROM leaves l
      JOIN users u ON l.user_id = u.id
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: '讀取請假單失敗', error: err.message });
  }
  /*try {
    if (req.user.role !== 'boss') {
      return res.status(403).json({ message: '只有老闆可以查看所有請假資料' });
    }

    const [leaves] = await db.execute(`
      SELECT leaves.id, users.username, leaves.date, leaves.reason
      FROM leaves
      JOIN users ON leaves.user_id = users.id
      ORDER BY leaves.date DESC
    `);

    res.json(leaves);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }*/
});

// 老闆審核請假單
router.post('/approve', authenticateToken, async (req, res) => {
  const { leaveId, decision } = req.body;

  if (req.user.role !== 'boss') {
    return res.status(403).json({ message: '只有老闆可以審核請假單' });
  }

  if (!['approved', 'rejected'].includes(decision)) {
    return res.status(400).json({ message: '決定只能是 approved 或 rejected' });
  }

  try {
    // 更新請假單的狀態
    await db.execute('UPDATE leaves SET status = ? WHERE id = ?', [decision, leaveId]);
    res.json({ message: `請假單已${decision === 'approved' ? '批准' : '拒絕'}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//員工查看請假狀態
router.get('/my', authenticateToken, async (req, res) => {
  const userId = req.user.id; // 從 token 拿使用者 ID

  try {
    const [rows] = await db.execute(
      'SELECT id, date, reason, status FROM leaves WHERE user_id = ? ORDER BY date DESC',
      [userId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: '取得請假紀錄失敗', error: err.message });
  }
});


module.exports = router;
