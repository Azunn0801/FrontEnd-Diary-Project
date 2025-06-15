document.addEventListener('DOMContentLoaded', function () {
    let allUsers = [];
    try {
        const storedUsers = localStorage.getItem('users');
        if (storedUsers) {
            const parsedUsers = JSON.parse(storedUsers);
            allUsers = Array.isArray(parsedUsers) ? parsedUsers : [];
            // Thêm kiểm tra và giá trị mặc định
            allUsers = allUsers.map(user => ({
                ...user,
                firstName: user.firstName || 'Unknown',
                lastName: user.lastName || '',
                status: user.status || 'Active',
                username: user.username || (user.email ? user.email.split('@')[0] : 'unknown')
            }));
        } else {
            console.warn('Không tìm thấy dữ liệu users trong localStorage');
        }
    } catch (e) {
        console.error('Lỗi phân tích dữ liệu users từ localStorage:', e);
        allUsers = [];
    }
    let shownUsers = [...allUsers];
    const usersPerPage = 5;
    let currentPage = 1;
    let sortField = null;
    let sortAscending = true;

    const tableBody = document.querySelector('.user-table-section table tbody');
    const pager = document.querySelector('.pagination');
    const searchBox = document.querySelector('input[type="search"]');
    const headerCells = document.querySelectorAll('.user-table-section table thead th');

    headerCells.forEach((cell, index) => {
        if (index < 3) {
            cell.style.cursor = 'pointer';
            cell.addEventListener('click', () => onHeaderClick(index));
        }
    });

    function onHeaderClick(colIndex) {
        const columns = ['name', 'status', 'email'];
        const field = columns[colIndex];
        if (sortField === field) sortAscending = !sortAscending;
        else { sortField = field; sortAscending = true; }
        bubbleSort();
        updateSortIcons();
        renderPage();
    }

    function bubbleSort() {
        const n = shownUsers.length;
        for (let i = 0; i < n - 1; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                const a = getValue(shownUsers[j]);
                const b = getValue(shownUsers[j + 1]);
                if (sortAscending ? a > b : a < b) {
                    [shownUsers[j], shownUsers[j + 1]] = [shownUsers[j + 1], shownUsers[j]];
                }
            }
        }
    }

    function getValue(user) {
        if (sortField === 'name') return (user.firstName + ' ' + user.lastName).toLowerCase();
        return user[sortField]?.toLowerCase() || '';
    }

    function updateSortIcons() {
        const columns = ['name', 'status', 'email'];
        headerCells.forEach((cell, i) => {
            const existing = cell.querySelector('.sort-arrow');
            if (existing) cell.removeChild(existing);
            if (sortField === columns[i]) {
                const arrow = document.createElement('span');
                arrow.className = 'sort-arrow ms-1';
                arrow.textContent = sortAscending ? '▲' : '▼';
                cell.appendChild(arrow);
            }
        });
    }

    function renderPage() {
        tableBody.innerHTML = '';
        pager.innerHTML = '';
        const start = (currentPage - 1) * usersPerPage;
        const pageItems = shownUsers.slice(start, start + usersPerPage);
        if (pageItems.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="4" class="text-center">No User found</td></tr>';
            return;
        }
        pageItems.forEach(user => {
            const row = document.createElement('tr');
            const nameCell = makeNameCell(user);
            const statusCell = document.createElement('td'); statusCell.textContent = user.status || 'Active';
            const emailCell = document.createElement('td'); emailCell.textContent = user.email || '';
            const actionCell = makeActionCell(user);
            row.append(nameCell, statusCell, emailCell, actionCell);
            tableBody.appendChild(row);
        });
        renderPager();
    }

    function makeNameCell(user) {
        const firstName = user.firstName || 'Unknown';
        const lastName = user.lastName || '';
        const initials = (firstName[0] + (lastName[0] || '')).toUpperCase();
        let avatar;
        if (user.avatar) {
            avatar = document.createElement('img');
            avatar.src = user.avatar; // Sử dụng đường dẫn avatar từ dữ liệu
            avatar.width = 40; avatar.height = 40;
            avatar.className = 'rounded-circle';
            avatar.onerror = () => {
                const placeholder = document.createElement('div');
                Object.assign(placeholder.style, {
                    width: '40px', height: '40px', background: '#6c757d', color: '#fff', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontWeight: 'bold'
                });
                placeholder.textContent = initials;
                avatar.replaceWith(placeholder);
            };
        } else {
            avatar = document.createElement('div');
            Object.assign(avatar.style, {
                width: '40px', height: '40px', background: '#6c757d', color: '#fff', display: 'flex',
                alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontWeight: 'bold'
            });
            avatar.textContent = initials;
        }
        const cell = document.createElement('td');
        const wrapper = document.createElement('div'); wrapper.className = 'd-flex align-items-center';
        wrapper.appendChild(avatar);
        const info = document.createElement('div'); info.className = 'ms-2';
        const fullName = document.createElement('div'); fullName.textContent = `${firstName} ${lastName}`.trim();
        const userTag = document.createElement('span'); userTag.className = 'text-muted ms-2'; userTag.textContent = `@${user.username || (user.email ? user.email.split('@')[0] : 'unknown')}`;
        info.append(fullName, userTag);
        wrapper.appendChild(info);
        cell.appendChild(wrapper);
        return cell;
    }

    function makeActionCell(user) {
        const cell = document.createElement('td');
        const btn = document.createElement('button');
        btn.className = `btn btn-sm btn-purple ${user.status === 'Active' ? 'block-btn' : 'unblock-btn'}`;
        btn.textContent = user.status === 'Active' ? 'Block' : 'Unblock';
        btn.addEventListener('click', () => toggleStatus(user));
        cell.appendChild(btn);
        return cell;
    }

    function toggleStatus(user) {
        const confirmMsg = user.status === 'Active' ? 'Block user?' : 'Unblock user?';
        if (!confirm(confirmMsg)) return;
        user.status = user.status === 'Active' ? 'Blocked' : 'Active';
        localStorage.setItem('users', JSON.stringify(allUsers));
        shownUsers = [...allUsers];
        renderPage();
        showToast('Thao tác thành công!');
    }

    function renderPager() {
        const totalPages = Math.ceil(shownUsers.length / usersPerPage);
        const makeItem = (label, disabled, onClick) => {
            const li = document.createElement('li'); li.className = `page-item${disabled ? ' disabled' : ''}`;
            const a = document.createElement('a'); a.className = 'page-link'; a.href = '#'; a.textContent = label;
            if (!disabled) a.onclick = e => { e.preventDefault(); onClick(); };
            li.appendChild(a); return li;
        };
        pager.append(makeItem('«', currentPage === 1, () => { currentPage--; renderPage(); }));
        for (let i = 1; i <= totalPages; i++) {
            pager.append(makeItem(i, false, () => { currentPage = i; renderPage(); }));
        }
        pager.append(makeItem('»', currentPage === totalPages, () => { currentPage++; renderPage(); }));
    }

    searchBox.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const term = this.value.trim().toLowerCase();
            shownUsers = term ? allUsers.filter(u =>
                u.firstName.toLowerCase().includes(term) ||
                u.lastName.toLowerCase().includes(term) ||
                u.username.toLowerCase().includes(term) ||
                u.email.toLowerCase().includes(term)
            ) : [...allUsers];
            currentPage = 1;
            renderPage();
        }
    });

    searchBox.addEventListener('input', function () {
        if (this.value.trim() === '') {
            shownUsers = [...allUsers];
            sortField = null;
            updateSortIcons();
            currentPage = 1;
            renderPage();
        }
    });

    renderPage();

    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast align-items-center text-bg-success border-0';
        toast.setAttribute('role', 'alert'); toast.setAttribute('aria-live', 'assertive'); toast.setAttribute('aria-atomic', 'true');
        toast.innerHTML = `<div class="d-flex"><div class="toast-body">${message}</div><button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button></div>`;
        let container = document.getElementById('toastContainer');
        if (!container) {
            container = document.createElement('div'); container.id = 'toastContainer';
            container.className = 'position-fixed bottom-0 end-0 p-3'; container.style.zIndex = '9999';
            document.body.appendChild(container);
        }
        container.appendChild(toast);
        bootstrap.Toast.getOrCreateInstance(toast, { delay: 3000 }).show();
        toast.addEventListener('hidden.bs.toast', () => toast.remove());
    }
});