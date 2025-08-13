// Token çözme fonksiyonu
function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');

  if (loginForm) {
    loginForm.addEventListener('submit', async e => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      try {
        const token = await login(email, password);
        localStorage.setItem('token', token);
        localStorage.setItem('userEmail', email);  // E-posta bilgisini kaydediyoruz

        const payload = parseJwt(token);
        console.log("JWT payload:", payload); // Debug için

        if (payload && payload.roles && payload.roles.includes("ROLE_ADMIN")) {
          showMessage('Admin girişi başarılı! Yönlendiriliyorsunuz...', 'success');
          window.location.href = 'admin.html';
        } else {
          showMessage('Giriş başarılı! Yönlendiriliyorsunuz...', 'success');
          window.location.href = 'index.html';
        }

      } catch (err) {
        showMessage('Giriş başarısız!', 'error');
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', async e => {
      e.preventDefault();
      const username = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      try {
        await register(username, email, password);
        showMessage('Kayıt başarılı! Giriş yapabilirsiniz.', 'success');
        window.location.href = 'login.html';
      } catch (err) {
        showMessage('Kayıt başarısız!', 'error');
      }
    });
  }
});
