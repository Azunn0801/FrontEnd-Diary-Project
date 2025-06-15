(function () {
    const requiresAuth = document.getElementById('logoutToggle') || document.getElementById('dashboardForm');
    if (requiresAuth) {
        const user = localStorage.getItem('currentUser');
        if (!user) {
            window.location.href = `../pages/login.html`;
        }
    }
})();

const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

const headerAvatar = document.getElementById('headerAvatar');
const dropdownAvatar = document.getElementById('dropdownAvatar');
const dropdownName = document.getElementById('dropdownName');
const dropdownEmail = document.getElementById('dropdownEmail');

if (headerAvatar && currentUser.avatar) {
    headerAvatar.src = currentUser.avatar;
}
if (dropdownAvatar && currentUser.avatar) {
    dropdownAvatar.src = currentUser.avatar;
}
if (dropdownName) {
    dropdownName.textContent = `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim();
}
if (dropdownEmail) {
    dropdownEmail.textContent = currentUser.email || '';
}

const logoutLink = document.getElementById('logoutToggle');
const logoutModalEl = document.getElementById('logoutModal');
const confirmLogout = document.getElementById('confirmLogoutBtn');

if (logoutLink) {
    if (logoutModalEl && confirmLogout) {
        const bsLogoutModal = bootstrap.Modal.getOrCreateInstance(logoutModalEl);
        logoutLink.addEventListener('click', e => {
            e.preventDefault();
            bsLogoutModal.show();
        });
        confirmLogout.addEventListener('click', () => {
            localStorage.removeItem('currentUser');
            localStorage.removeItem('currentUserId');
            bsLogoutModal.hide();
            window.location.href = `../index.html`;
        });
    } else {
        logoutLink.addEventListener('click', e => {
            e.preventDefault();
            if (confirm('Are you sure want to log out?')) {
                localStorage.removeItem('currentUser');
                localStorage.removeItem('currentUserId');
                window.location.href = `../index.html`;
            }
        });
    }
}