document.addEventListener('DOMContentLoaded', function () {
    // Khởi tạo dữ liệu người dùng từ LocalStorage hoặc dữ liệu mẫu ban đầu
    let users;
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
        users = JSON.parse(storedUsers);
    } else {
        users = [
            { name: 'Olivia Rhye', username: 'olivia', email: 'olivia@untitledui.com', status: 'Hoạt động', avatar: 'profile.jpg' },
            { name: 'John Doe', username: 'johndoe', email: 'john@example.com', status: 'Hoạt động', avatar: 'profile2.jpg' },
            { name: 'Jane Smith', username: 'janesmith', email: 'jane@example.com', status: 'Bị khóa', avatar: 'profile3.jpg' },
            { name: 'Alice Johnson', username: 'alicej', email: 'alice@example.com', status: 'Hoạt động', avatar: 'profile4.jpg' },
            { name: 'Bob Williams', username: 'bobw', email: 'bob@example.com', status: 'Hoạt động', avatar: 'profile5.jpg' },
            { name: 'Charlie Brown', username: 'charlieb', email: 'charlie@example.com', status: 'Bị khóa', avatar: 'profile6.jpg' }
        ];
        localStorage.setItem('users', JSON.stringify(users));
    }

    const userTableBody = document.querySelector('.user-table-section table tbody');

    // Hàm hiển thị (render) bảng người dùng
    function renderUsers() {
        userTableBody.innerHTML = '';
        users.forEach((user, index) => {
            const row = document.createElement('tr');
            // Cột tên + ảnh + username
            const nameCell = document.createElement('td');
            nameCell.innerHTML =
                `<img src="../assets/images/user.png" alt="Profile" width="40" height="40" class="rounded-circle profile-picture"> 
                 ${user.name} <span class="text-muted">@${user.username}</span>`;
            // Cột trạng thái
            const statusCell = document.createElement('td');
            statusCell.textContent = user.status;
            // Cột email
            const emailCell = document.createElement('td');
            emailCell.textContent = user.email;
            // Cột hành động (Block/Unblock)
            const actionsCell = document.createElement('td');
            if (user.status === 'Hoạt động') {
                // Nếu đang hoạt động thì hiện nút Block
                const blockBtn = document.createElement('button');
                blockBtn.className = 'btn btn-sm btn-purple block-btn';
                blockBtn.textContent = 'Block';
                actionsCell.appendChild(blockBtn);
            }
            if (user.status === 'Bị khóa') {
                // Nếu đang bị khóa thì hiện nút Unblock
                const unblockBtn = document.createElement('button');
                unblockBtn.className = 'btn btn-sm btn-purple unblock-btn';
                unblockBtn.textContent = 'Unblock';
                actionsCell.appendChild(unblockBtn);
            }
            row.appendChild(nameCell);
            row.appendChild(statusCell);
            row.appendChild(emailCell);
            row.appendChild(actionsCell);
            row.dataset.index = index;  // lưu chỉ số người dùng vào data-index của dòng
            userTableBody.appendChild(row);
        });
    }

    renderUsers();

    // Lắng nghe sự kiện click trên bảng người dùng (sử dụng event delegation)
    userTableBody.addEventListener('click', function (e) {
        const target = e.target;
        if (target.classList.contains('block-btn')) {
            const idx = target.closest('tr').dataset.index;
            if (confirm("Bạn có chắc chắn không?")) {
                // Khóa người dùng
                users[idx].status = 'Bị khóa';
                localStorage.setItem('users', JSON.stringify(users));
                renderUsers();
                showToast("Khóa người dùng thành công!");
            }
        }
        if (target.classList.contains('unblock-btn')) {
            const idx = target.closest('tr').dataset.index;
            if (confirm("Bạn có chắc chắn không?")) {
                // Mở khóa người dùng
                users[idx].status = 'Hoạt động';
                localStorage.setItem('users', JSON.stringify(users));
                renderUsers();
                showToast("Mở khóa người dùng thành công!");
            }
        }
    });

    // Hàm hiển thị toast thông báo (sử dụng Bootstrap Toast)
    function showToast(message) {
        const toastEl = document.createElement('div');
        toastEl.className = 'toast align-items-center text-bg-success border-0';
        toastEl.setAttribute('role', 'alert');
        toastEl.setAttribute('aria-live', 'assertive');
        toastEl.setAttribute('aria-atomic', 'true');
        toastEl.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">${message}</div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" 
                        data-bs-dismiss="toast" aria-label="Close"></button>
            </div>`;
        // Thêm toast vào container (tạo container nếu chưa có)
        let container = document.getElementById('toastContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toastContainer';
            container.className = 'position-fixed bottom-0 end-0 p-3';
            container.style.zIndex = '9999';
            document.body.appendChild(container);
        }
        container.appendChild(toastEl);
        // Khởi tạo và hiển thị toast bằng Bootstrap
        const bsToast = new bootstrap.Toast(toastEl, { delay: 3000 });
        bsToast.show();
        // Khi ẩn thì loại bỏ phần tử toast khỏi DOM để tránh tích tụ
        toastEl.addEventListener('hidden.bs.toast', () => {
            toastEl.remove();
        });
    }
});
