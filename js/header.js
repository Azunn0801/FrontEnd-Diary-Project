document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (user.firstName) {
        const fullName = `${user.firstName} ${user.lastName}`.trim();
        document.getElementById('dropdownName').textContent = fullName;
        document.getElementById('dropdownEmail').textContent = user.email || '';
        if (user.avatar) {
            document.getElementById('headerAvatar').src = user.avatar;
            document.getElementById('dropdownAvatar').src = user.avatar;
        }
    }

    const searchInput = document.getElementById('headerSearch');
    if (searchInput) {
        const doSearch = () => {
            const q = searchInput.value.trim();
            if (q) window.location.href = `./pages/search_results.html?q=${encodeURIComponent(q)}`;
        };
        document.getElementById('searchBtn')?.addEventListener('click', e => {
            e.preventDefault(); doSearch();
        });
        searchInput.addEventListener('keypress', e => {
            if (e.key === 'Enter') { e.preventDefault(); doSearch(); }
        });
    }

    const logoutButtons = document.querySelectorAll('#logoutToggle');
    const logoutModalEl = document.getElementById('confirmLogoutModal');
    const confirmBtn = document.getElementById('btnConfirmLogout');
    const bsModal = logoutModalEl && bootstrap.Modal.getOrCreateInstance(logoutModalEl);

    logoutButtons.forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault();
            bsModal.show();
        });
    });
    confirmBtn?.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        bsModal.hide();
        const path = window.location.pathname;
        if (path.includes('/pages/')) window.location.href = '../index.html';
        else window.location.href = 'index.html';
    });
});
