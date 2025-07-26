document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token'); // 從登入後儲存的 token 取得
    if (!token) {
        alert('請先登入');
        window.location.href = 'login.html';
        return;
    }
    try {
        const res = await fetch('http://localhost:3000/api/leave/all', {
        headers: {
            'Authorization': 'Bearer ' + token
        }
        });

    const data = await res.json();

    if (res.ok) {
        const tbody = document.getElementById('leaveTableBody');
        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.username}</td>
                <td>${item.date}</td>
                <td>${item.reason}</td>
                <td class="status">${item.status}</td>
                <td class="actions"></td>
                `;
            tbody.appendChild(row);

            const statusCell = row.querySelector('.status');
            const actionsCell = row.querySelector('.actions');

            if (item.status === 'pending') {
                const approveBtn = document.createElement('button');
                approveBtn.innerText = '✅ 批准';
                approveBtn.addEventListener('click', () => handleReview(item.id, 'approved', statusCell, approveBtn, rejectBtn));

                const rejectBtn = document.createElement('button');
                rejectBtn.innerText = '❌ 拒絕';
                rejectBtn.addEventListener('click', () => handleReview(item.id, 'rejected', statusCell, approveBtn, rejectBtn));

                actionsCell.appendChild(approveBtn);
                actionsCell.appendChild(rejectBtn);
            } else {
                actionsCell.innerText = '已審核';
            }
        });
    } else {
      alert('無法取得請假資料：' + data.message);
    }
  } catch (err) {
    alert('錯誤：' + err.message);
  }
});

async function handleReview(leaveId, decision, statusCell, approveBtn, rejectBtn) {
  const token = localStorage.getItem('token');

  try {
    const res = await fetch('http://localhost:3000/api/leave/approve', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ leaveId, decision })
    });

    const result = await res.json();
    alert(result.message || '操作成功');
    /*window.location.reload(); // 重新載入畫面 */

    if (res.ok) {
      statusCell.innerText = decision;     // ✅ 更新狀態文字
      approveBtn.disabled = true;          // ✅ 禁用按鈕
      rejectBtn.disabled = true;
    }
  } catch (err) {
    alert('審核失敗：' + err.message);
  }
}