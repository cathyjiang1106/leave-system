document.getElementById('loginForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const username = this.username.value;
  const password = this.password.value;

  try {
    const res = await fetch('http://127.0.0.1:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const result = await res.json();

    if (res.ok) {
      // 登入成功，儲存 token 與身分
        localStorage.setItem('token', result.token);
        localStorage.setItem('role', result.role);
        localStorage.setItem('username', result.username);

      /*document.getElementById('result').innerText =
        `✅ 歡迎 ${result.username}（身分：${result.role}）`;*/

        if (result.role === 'employee') {
            window.location.href = 'employee/employee_home.html';
        } else if (result.role === 'boss') {
            window.location.href = 'boss.html';
        } else {
            alert('登入成功，但角色錯誤');
        } 
    } else {
      document.getElementById('result').innerText = `❌ 登入失敗：${result.message}`;
    }

  } catch (err) {
    document.getElementById('result').innerText = `⚠️ 發生錯誤：${err.message}`;
  }
});
