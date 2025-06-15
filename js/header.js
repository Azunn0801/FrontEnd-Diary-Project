document.addEventListener('DOMContentLoaded', () => {
    const getPagePath = page => `/${page}`;

    const userMenu = document.querySelector('.nav-item.dropdown');
    const authButtons = document.querySelector('.auth-buttons');
    const dropdownName = document.getElementById('dropdownName');
    const dropdownEmail = document.getElementById('dropdownEmail');
    const headerAvatar = document.getElementById('headerAvatar');
    const dropdownAvatar = document.getElementById('dropdownAvatar');

    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (user.firstName) {
        dropdownName.textContent = `${user.firstName} ${user.lastName || ''}`.trim();
        dropdownEmail.textContent = user.email || '';
        if (user.avatar) {
            headerAvatar.src = user.avatar;
            dropdownAvatar.src = user.avatar;
        }
        if (userMenu) userMenu.style.display = '';
        if (authButtons) authButtons.style.display = 'none';
    } else {
        if (userMenu) userMenu.style.display = 'none';
        if (authButtons) authButtons.style.display = '';
    }

    document.getElementById('profileLink')?.addEventListener('click', e => {
        e.preventDefault();
        window.location.href = getPagePath('/pages/dashboard.html');
    });
    document.getElementById('avatarLink')?.addEventListener('click', e => {
        e.preventDefault();
        window.location.href = '/pages/dashboard.html#avatarInput';
    });
    document.getElementById('passwordLink')?.addEventListener('click', e => {
        e.preventDefault();
        window.location.href = '/pages/dashboard.html#passwordInput';
    });

    const searchInput = document.getElementById('headerSearch');
    const searchBtn = document.getElementById('searchBtn');
    const doSearch = () => {
        const q = searchInput.value.trim();
        if (!q) return;
        window.location.href = `${getPagePath('search_results.html')}?q=${encodeURIComponent(q)}`;
    };
    searchBtn?.addEventListener('click', e => { e.preventDefault(); doSearch(); });
    searchInput?.addEventListener('keypress', e => {
        if (e.key === 'Enter') { e.preventDefault(); doSearch(); }
    });

    const logoutToggles = document.querySelectorAll('.logoutToggle, #logoutToggle');
    const logoutModalEl = document.getElementById('confirmLogoutModal');
    const confirmBtn = document.getElementById('btnConfirmLogout');
    const bsModal = logoutModalEl && bootstrap.Modal.getOrCreateInstance(logoutModalEl);

    logoutToggles.forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault();
            bsModal.show();
        });
    });
    confirmBtn?.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        bsModal.hide();
        window.location.href = getPagePath('/index.html');
    });
});
