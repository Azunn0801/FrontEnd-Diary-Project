document.addEventListener('DOMContentLoaded', () => {
    const stored = localStorage.getItem('currentUser');
    if (!stored) {
        window.location.href = 'login.html';
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

    nameDisplay.value = `${user.firstName || ''} ${user.lastName || ''}`.trim();
    usernameInput.value = user.username || '';
    emailDisplay.value = user.email || '';
    if (user.avatar) {
        avatarPreview.src = user.avatar;
    }

    avatarInput.addEventListener('change', e => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => avatarPreview.src = reader.result;
        reader.readAsDataURL(file);
    });

    form.addEventListener('submit', e => {
        e.preventDefault();
        warningElem.textContent = '';

        const newUsername = usernameInput.value.trim();
        if (!newUsername) {
            warningElem.textContent = 'Tên đăng nhập không được để trống.';
            return;
        }

        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const oldUsername = user.username;
        if (newUsername !== oldUsername && users.some(u => u.username === newUsername)) {
            warningElem.textContent = 'Tên đăng nhập đã tồn tại.';
            return;
        }

        user.username = newUsername;
        if (avatarInput.files[0]) {
            user.avatar = avatarPreview.src;
        }
        const newPwd = passwordInput.value.trim();
        if (newPwd) {
            if (newPwd.length < 6) {
                warningElem.textContent = 'Mật khẩu mới phải có ít nhất 6 ký tự.';
                return;
            }
            user.password = newPwd;
        }

        localStorage.setItem('currentUser', JSON.stringify(user));
        const idx = users.findIndex(u => u.username === oldUsername);
        if (idx > -1) {
            users[idx] = user;
            localStorage.setItem('users', JSON.stringify(users));
        }

        alert('Cập nhật thành công!');
        passwordInput.value = '';
    });
});
