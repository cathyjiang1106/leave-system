document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  document.getElementById('welcome').innerText = `登入中：${username}`;

  if (!token) {
    alert('請先登入');
    location.href = 'login.html';
    return;
  }

  try {
    const res = await fetch('http://localhost:3000/api/leave/my', {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });

    const data = await res.json();

    if (res.ok) {
      const tbody = document.getElementById('myLeaveTableBody');
      if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3">目前沒有請假紀錄</td></tr>';
        return;
      }
      data.forEach(item => {
        const row = document.createElement('tr');
        let statusText = '❓ 未審核';
        if (item.status === 'approved') statusText = '✅ 已批准';
        else if (item.status === 'rejected') statusText = '❌ 已拒絕';

        row.innerHTML = `
          <td>${item.date}</td>
          <td>${item.reason}</td>
          <td>${translateStatus(item.status)}</td>
        `;
        tbody.appendChild(row);
      });
    } else {
      alert('取得紀錄失敗：' + data.message);
    }
  } catch (err) {
    alert('錯誤：' + err.message);
  }
});

function translateStatus(status) {
  switch (status) {
    case 'pending': return '審核中';
    case 'approved': return '已核准';
    case 'rejected': return '已拒絕';
    default: return '未知狀態';
  }
}