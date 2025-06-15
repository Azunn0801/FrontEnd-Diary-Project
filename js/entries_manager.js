document.addEventListener('DOMContentLoaded', () => {
    let entries = JSON.parse(localStorage.getItem('entries') || '[]');

    const categoryTableBody = document.querySelector('.category-list tbody');
    const newCategoryInput = document.getElementById('new-category-name');
    const saveBtn = document.getElementById('saveCategoryBtn');

    function renderCategories() {
        categoryTableBody.innerHTML = '';
        entries.forEach((cat, i) => {
            const row = document.createElement('tr');
            row.dataset.index = i;
            row.innerHTML = `
                <td>${i + 1}</td>
                <td>${cat}</td>
                <td>
                    <button class="btn btn-warning btn-sm edit-category">Sửa</button>
                    <button class="btn btn-danger btn-sm delete-category">Xóa</button>
                </td>`;
            categoryTableBody.appendChild(row);
        });
    }

    function initializeEntries() {
        if (entries.length === 0) {
            // Try fetching from ../database/entries.json
            fetch('../database/entries.json')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch entries.json');
                    }
                    return response.json();
                })
                .then(data => {
                    entries = data.length > 0 ? data : ["Nấu ăn", "IT"]; // Use fetched data or default
                    localStorage.setItem('entries', JSON.stringify(entries));
                    renderCategories();
                })
                .catch(error => {
                    console.error('Error fetching entries:', error);
                    // Fallback to default entries if fetch fails
                    entries = ["Nấu ăn", "IT"];
                    localStorage.setItem('entries', JSON.stringify(entries));
                    renderCategories();
                });
        } else {
            renderCategories();
        }
    }

    initializeEntries();

    saveBtn.addEventListener('click', () => {
        const name = newCategoryInput.value.trim();
        if (!name) return;
        entries.push(name);
        localStorage.setItem('entries', JSON.stringify(entries));
        renderCategories();
        newCategoryInput.value = '';
        showToast("Thêm chủ đề thành công!");
    });

    categoryTableBody.addEventListener('click', (e) => {
        const target = e.target;
        const row = target.closest('tr');
        const idx = row?.dataset.index;
        if (idx == null) return;

        if (target.classList.contains('edit-category')) {
            if (confirm("Bạn có chắc chắn không?")) {
                const current = entries[idx];
                const updated = prompt("Nhập tên chủ đề mới:", current)?.trim();
                if (updated && updated !== current) {
                    entries[idx] = updated;
                    localStorage.setItem('entries', JSON.stringify(entries));
                    renderCategories();
                    showToast("Cập nhật chủ đề thành công!");
                }
            }
        }

        if (target.classList.contains('delete-category')) {
            if (confirm("Bạn có chắc chắn không?")) {
                entries.splice(idx, 1);
                localStorage.setItem('entries', JSON.stringify(entries));
                renderCategories();
                showToast("Xóa chủ đề thành công!");
            }
        }
    });

    function showToast(msg) {
        const toastEl = document.createElement('div');
        toastEl.className = 'toast align-items-center text-bg-success border-0';
        toastEl.setAttribute('role', 'alert');
        toastEl.setAttribute('aria-live', 'assertive');
        toastEl.setAttribute('aria-atomic', 'true');
        toastEl.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">${msg}</div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto"
                        data-bs-dismiss="toast"></button>
            </div>`;
        let c = document.getElementById('toastContainer');
        if (!c) {
            c = document.createElement('div');
            c.id = 'toastContainer';
            c.className = 'position-fixed bottom-0 end-0 p-3';
            document.body.appendChild(c);
        }
        c.appendChild(toastEl);
        new bootstrap.Toast(toastEl, { delay: 3000 }).show();
        toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
    }
});