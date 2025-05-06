(function () {
    const user = localStorage.getItem('currentUser');
    if (!user) {
        window.location.href = './login.html';
    }
})();

const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};

    const headerAvatar = document.getElementById('headerAvatar');
    const dropdownAvatar = document.getElementById('dropdownAvatar');
    const dropdownName = document.getElementById('dropdownName');
    const dropdownEmail = document.getElementById('dropdownEmail');

    if (currentUser.avatar) {
      headerAvatar.src = currentUser.avatar;
      dropdownAvatar.src = currentUser.avatar;
    }
    dropdownName.textContent = `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim();
    dropdownEmail.textContent = currentUser.email || '';

    const logoutLink = document.getElementById('logoutLink');
    const logoutModalEl = document.getElementById('logoutModal');
    const confirmLogout = document.getElementById('confirmLogoutBtn');
    if (logoutModalEl) {
      const bsLogoutModal = bootstrap.Modal.getOrCreateInstance(logoutModalEl);
      logoutLink.addEventListener('click', e => {
        e.preventDefault();
        bsLogoutModal.show();
      });
      confirmLogout.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        bsLogoutModal.hide();
        location.reload();
      });
    } else {
      logoutLink.addEventListener('click', e => {
        e.preventDefault();
        if (confirm('Are you sure you want to log out?')) {
          localStorage.removeItem('currentUser');
          location.reload();
        }
      });
    }