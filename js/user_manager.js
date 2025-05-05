document.addEventListener('DOMContentLoaded', function () {
    let users;
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
        users = JSON.parse(storedUsers);
    } else {
        users = [
            { firstName: 'Olivia', lastName: 'Rhye', username: 'olivia', email: 'olivia@untitledui.com', status: 'Hoạt động', avatar: 'profile.jpg' },
            { firstName: 'John', lastName: 'Doe', username: 'johndoe', email: 'john@example.com', status: 'Hoạt động', avatar: 'profile2.jpg' },
            { firstName: 'Jane', lastName: 'Smith', username: 'janesmith', email: 'jane@example.com', status: 'Bị khóa', avatar: 'profile3.jpg' },
            { firstName: 'Alice', lastName: 'Johnson', username: 'alicej', email: 'alice@example.com', status: 'Hoạt động', avatar: 'profile4.jpg' },
            { firstName: 'Bob', lastName: 'Williams', username: 'bobw', email: 'bob@example.com', status: 'Hoạt động', avatar: 'profile5.jpg' },
            { firstName: 'Charlie', lastName: 'Brown', username: 'charlieb', email: 'charlie@example.com', status: 'Bị khóa', avatar: 'profile6.jpg' }
        ];
        localStorage.setItem('users', JSON.stringify(users));
    }

    const rowsPerPage = 5;
    let currentPage = 1;

    const userTableBody = document.querySelector('.user-table-section table tbody');
    const paginationContainer = document.querySelector('.pagination');

    function renderUsersPage(page = 1) {
        currentPage = page;
        userTableBody.innerHTML = '';

        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const paginatedUsers = users.slice(start, end);

        paginatedUsers.forEach((user, idx) => {
            const row = document.createElement('tr');

            const usernameSpan = user.username ? `<span class="text-muted">@${user.username}</span>` : '';

            const nameCell = document.createElement('td');
            nameCell.innerHTML = `
                <img src="./assets/images/${user.avatar}" alt="Profile" width="40" height="40" class="rounded-circle profile-picture">
                ${user.firstName} ${user.lastName} ${usernameSpan}
            `;

            const statusCell = document.createElement('td');
            statusCell.textContent = user.status;

            const emailCell = document.createElement('td');
            emailCell.textContent = user.email;

            const actionsCell = document.createElement('td');
            if (user.status === 'Hoạt động') {
                const blockBtn = document.createElement('button');
                blockBtn.className = 'btn btn-sm btn-purple block-btn';
                blockBtn.textContent = 'Block';
                actionsCell.appendChild(blockBtn);
            } else {
                const unblockBtn = document.createElement('button');
                unblockBtn.className = 'btn btn-sm btn-purple unblock-btn';
                unblockBtn.textContent = 'Unblock';
                actionsCell.appendChild(unblockBtn);
            }

            row.append(nameCell, statusCell, emailCell, actionsCell);
            row.dataset.index = start + idx;
            userTableBody.appendChild(row);
        });

        renderPagination();
    }

    function renderPagination() {
        const pageCount = Math.ceil(users.length / rowsPerPage);
        paginationContainer.innerHTML = '';

        const prevLi = document.createElement('li');
        prevLi.className = `page-item${currentPage === 1 ? ' disabled' : ''}`;
        prevLi.innerHTML = `<a class="page-link page-link-prev" href="#" aria-label="Previous">&laquo;</a>`;
        prevLi.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentPage > 1) renderUsersPage(currentPage - 1);
        });
        paginationContainer.appendChild(prevLi);

        for (let i = 1; i <= pageCount; i++) {
            const li = document.createElement('li');
            li.className = `page-item${i === currentPage ? ' active' : ''}`;
            li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
            li.addEventListener('click', (e) => {
                e.preventDefault();
                renderUsersPage(i);
            });
            paginationContainer.appendChild(li);
        }

        const nextLi = document.createElement('li');
        nextLi.className = `page-item${currentPage === pageCount ? ' disabled' : ''}`;
        nextLi.innerHTML = `<a class="page-link page-link-next" href="#" aria-label="Next">&raquo;</a>`;
        nextLi.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentPage < pageCount) renderUsersPage(currentPage + 1);
        });
        paginationContainer.appendChild(nextLi);
    }

    userTableBody.addEventListener('click', function (e) {
        const target = e.target;
        if (target.classList.contains('block-btn')) {
            const idx = target.closest('tr').dataset.index;
            if (confirm('Bạn có chắc chắn không?')) {
                users[idx].status = 'Bị khóa';
                localStorage.setItem('users', JSON.stringify(users));
                renderUsersPage(currentPage);
                showToast('Khóa người dùng thành công!');
            }
        }
        if (target.classList.contains('unblock-btn')) {
            const idx = target.closest('tr').dataset.index;
            if (confirm('Bạn có chắc chắn không?')) {
                users[idx].status = 'Hoạt động';
                localStorage.setItem('users', JSON.stringify(users));
                renderUsersPage(currentPage);
                showToast('Mở khóa người dùng thành công!');
            }
        }
    });

    function showToast(message) {
        const toastEl = document.createElement('div');
        toastEl.className = 'toast align-items-center text-bg-success border-0';
        toastEl.setAttribute('role', 'alert');
        toastEl.setAttribute('aria-live', 'assertive');
        toastEl.setAttribute('aria-atomic', 'true');
        toastEl.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">${message}</div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>`;
        let container = document.getElementById('toastContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toastContainer';
            container.className = 'position-fixed bottom-0 end-0 p-3';
            container.style.zIndex = '9999';
            document.body.appendChild(container);
        }
        container.appendChild(toastEl);
        const bsToast = new bootstrap.Toast(toastEl, { delay: 3000 });
        bsToast.show();
        toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
    }

    renderUsersPage(currentPage);
});