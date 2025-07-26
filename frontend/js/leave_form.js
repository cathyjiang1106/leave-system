document.getElementById('welcome').innerText =
  `嗨，${localStorage.getItem('username')}（角色：${localStorage.getItem('role')}）`;

document.getElementById('leaveForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const date = this.date.value;
  const reason = this.reason.value;
  const token = localStorage.getItem('token'); // ⬅️ 用來驗證身分

  try {
    const res = await fetch('http://localhost:3000/api/leave/apply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // ⬅️ 將 token 傳給後端驗證
      },
      body: JSON.stringify({ date, reason })
    });

    const result = await res.json();

    if (res.ok) {
      document.getElementById('result').innerText = result.message || '✅ 請假申請成功';
    } else {
      document.getElementById('result').innerText = '❌ ' + (result.message || '請假失敗');
    }
  } catch (err) {
    document.getElementById('result').innerText = '⚠️ 發生錯誤：' + err.message;
  }
});
