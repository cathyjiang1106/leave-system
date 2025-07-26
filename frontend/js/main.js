document.getElementById('leaveForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const userId = this.userId.value;
  const date = this.date.value;
  const reason = this.reason.value;

  try {
    const res = await fetch('http://localhost:3000/api/leave/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, date, reason })
    });
    const result = await res.json();
    alert(result.message || '成功送出');
  } catch (err) {
    alert('送出失敗：' + err.message);
  }
});
