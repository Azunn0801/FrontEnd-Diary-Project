document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('logoLink').addEventListener('click', () => {
        window.location.href = './index.html';
    });
    const searchBox = document.getElementById('headerSearch');
    const searchBtn = document.getElementById('searchBtn');
    searchBtn.addEventListener('click', () => {
        const q = searchBox.value.trim();
        if (q) window.location.href = `../pages/search_results.html?q=${encodeURIComponent(q)}`;
    });
    document.getElementById('logoutLink').addEventListener('click', e => {
        e.preventDefault();
        localStorage.removeItem('currentUser');
        window.location.href = '../pages/login.html';
    });

    const stored = localStorage.getItem('currentUser');
    if (!stored) {
        window.location.href = '../pages/login.html';
        return;
    }
    const user = JSON.parse(stored);

    const nameDisplay = document.getElementById('nameDisplay');
    const usernameInput = document.getElementById('usernameInput');
    const emailDisplay = document.getElementById('emailDisplay');
    const avatarPreview = document.getElementById('avatarPreview');
    const avatarInput = document.getElementById('avatarInput');
    const passwordInput = document.getElementById('passwordInput');
    const warningElem = document.getElementById('usernameWarning');
    const form = document.getElementById('dashboardForm');

    nameDisplay.value = user.firstName + ' ' + user.lastName;
    usernameInput.value = user.username;
    emailDisplay.value = user.email;
    if (user.avatar) avatarPreview.src = user.avatar;

    avatarInput.addEventListener('change', e => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => avatarPreview.src = reader.result;
        reader.readAsDataURL(file);
    });

    form.addEventListener('submit', e => {
        e.preventDefault();
        warningElem.textContent = ''
        const newUsername = usernameInput.value.trim()
        if (!newUsername) {
            warningElem.textContent = 'Tên đăng nhập không được để trống.'
            return
        }
        let users = JSON.parse(localStorage.getItem('users')) || []
        const duplicate = users.some(u => u.username === newUsername && u.username !== user.username)
        if (duplicate) {
            warningElem.textContent = 'Tên đăng nhập đã tồn tại.'
            return
        }
        const oldUsername = user.username
        user.username = newUsername
        if (avatarInput.files[0]) user.avatar = avatarPreview.src
        const newPwd = passwordInput.value.trim()
        if (newPwd.length >= 6) user.password = newPwd

        localStorage.setItem('currentUser', JSON.stringify(user))
        const idx = users.findIndex(u => u.username === oldUsername)
        if (idx > -1) users[idx] = user
        localStorage.setItem('users', JSON.stringify(users))

        alert('Cập nhật thành công!')
        passwordInput.value = ''
    });
});