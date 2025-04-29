const entries = [
    { id: 1, name: "Nhật ký học tập" },
    { id: 2, name: "Nhật ký mục tiêu và kế hoạch" },
    { id: 3, name: "Nhật ký trải nghiệm- học qua đời sống" }
];

let articles = JSON.parse(localStorage.getItem("articles"));
if (!articles) {
    articles = entries;
    localStorage.setItem('articles', JSON.stringify(articles));
}

const articlesPerPage = 5;
let currentPage = 1;

document.addEventListener('DOMContentLoaded', () => {
    const stored = localStorage.getItem('articles');
    if (stored) articles = JSON.parse(stored);

    const tbody = document.querySelector('.posts-container table tbody');
    const pagination = document.querySelector('.pagination');
    const modalEl = document.getElementById('addArticleModal');
    const modalTitle = document.getElementById('addArticleModalLabel');
    const saveBtn = document.getElementById('saveArticleBtn');
    const form = modalEl.querySelector('form');
    const fileInput = document.getElementById('fileUpload');
    const addBtn = document.querySelector('.add-button');
    let editingIndex = null;

    const previewImg = document.getElementById('previewImage');
    fileInput.addEventListener('change', e => {
        if (e.target.files && e.target.files[0] && previewImg) {
            const reader = new FileReader();
            reader.onload = ev => previewImg.src = ev.target.result;
            reader.readAsDataURL(e.target.files[0]);
        }
    });

    addBtn.addEventListener('click', () => {
        editingIndex = null;
        form.reset();
        if (previewImg) previewImg.src = '';
        modalTitle.textContent = '📝 Add New Article';
        saveBtn.textContent = 'Add';
    });

    function renderTable() {
        tbody.innerHTML = '';
        const start = (currentPage - 1) * articlesPerPage;
        const pageItems = articles.slice(start, start + articlesPerPage);
        pageItems.forEach((art, i) => {
            const idx = start + i;
            const tr = document.createElement('tr'); tr.dataset.index = idx;

            const th = document.createElement('th'); th.scope = 'row';
            const img = document.createElement('img'); img.src = art.image || '';
            img.width = 100; img.height = 70;
            th.appendChild(img);
            tr.appendChild(th);

            ['title', 'category', 'content', 'status'].forEach(key => {
                const td = document.createElement('td'); td.textContent = art[key];
                if (key === 'status') td.className = 'status';
                tr.appendChild(td);
            });

            const tdSel = document.createElement('td');
            const sel = document.createElement('select'); sel.className = 'form-select status-select';
            ['Public', 'Private'].forEach(s => {
                const o = document.createElement('option'); o.value = s; o.textContent = s;
                if (art.status === s) o.selected = true;
                sel.appendChild(o);
            });
            sel.dataset.index = idx; tdSel.appendChild(sel); tr.appendChild(tdSel);

            const tdAct = document.createElement('td');
            const btnE = document.createElement('button'); btnE.className = 'btn btn-warning edit-article'; btnE.textContent = 'Sửa';
            const btnD = document.createElement('button'); btnD.className = 'btn btn-danger delete-article'; btnD.textContent = 'Xóa';
            tdAct.append(btnE, btnD); tr.appendChild(tdAct);

            tbody.appendChild(tr);
        });
    }

    function renderPagination() {
        pagination.innerHTML = '';
        const totalPages = Math.ceil(articles.length / articlesPerPage);
        const navBtn = (text, disabled, action) => {
            const li = document.createElement('li'); li.className = `page-item ${disabled ? 'disabled' : ''}`;
            const a = document.createElement('a'); a.className = 'page-link'; a.href = '#'; a.textContent = text;
            if (!disabled) a.addEventListener('click', e => { e.preventDefault(); action(); });
            li.appendChild(a); return li;
        };
        pagination.appendChild(navBtn('Previous', currentPage === 1, () => { currentPage--; render(); }));
        for (let i = 1; i <= totalPages; i++) {
            const li = document.createElement('li'); li.className = `page-item ${i === currentPage ? 'active' : ''}`;
            const a = document.createElement('a'); a.className = 'page-link'; a.href = '#'; a.textContent = i;
            a.addEventListener('click', e => { e.preventDefault(); currentPage = i; render(); });
            li.appendChild(a); pagination.appendChild(li);
        }
        pagination.appendChild(navBtn('Next', currentPage === totalPages, () => { currentPage++; render(); }));
    }

    function render() { renderTable(); renderPagination(); }
    render();

    tbody.addEventListener('click', e => {
        const tr = e.target.closest('tr'); if (!tr) return;
        const idx = +tr.dataset.index;
        if (e.target.classList.contains('edit-article')) {
            editingIndex = idx; const art = articles[idx];
            modalTitle.textContent = '📝 Cập nhật bài viết'; saveBtn.textContent = 'Cập nhật';
            form.reset();
            document.getElementById('title').value = art.title;
            document.getElementById('categories').value = art.category;
            document.getElementById('content').value = art.content;
            document.getElementById(art.status === 'Public' ? 'public' : 'private').checked = true;
            if (previewImg) previewImg.src = art.image || '';
            bootstrap.Modal.getOrCreateInstance(modalEl).show();
        }
        if (e.target.classList.contains('delete-article')) {
            if (confirm('Bạn có chắc chắn muốn xóa?')) {
                articles.splice(idx, 1);
                localStorage.setItem('articles', JSON.stringify(articles));
                if (currentPage > Math.ceil(articles.length / articlesPerPage)) currentPage--;
                render(); showToast('Xóa thành công!');
            }
        }
    });

    function finishSave(data) {
        if (editingIndex !== null) articles[editingIndex] = data;
        else articles.push(data);
        localStorage.setItem('articles', JSON.stringify(articles));
        if (currentPage > Math.ceil(articles.length / articlesPerPage)) currentPage = Math.ceil(articles.length / articlesPerPage);
        bootstrap.Modal.getInstance(modalEl).hide();
        render();
        showToast(editingIndex !== null ? 'Cập nhật thành công!' : 'Thêm thành công!');
        editingIndex = null;
    }

    saveBtn.addEventListener('click', () => {
        const title = document.getElementById('title').value.trim();
        const category = document.getElementById('categories').value.trim();
        const content = document.getElementById('content').value.trim();
        const statusRadio = document.querySelector('input[name="status"]:checked');
        const status = statusRadio ? statusRadio.value : 'public';
        if (!title || !content) { alert('Vui lòng nhập tiêu đề và nội dung'); return; }
        const data = { title, category, content, status: status.charAt(0).toUpperCase() + status.slice(1), image: '' };
        if (fileInput.files && fileInput.files[0]) {
            const reader = new FileReader();
            reader.onload = ev => { data.image = ev.target.result; finishSave(data); };
            reader.readAsDataURL(fileInput.files[0]);
        } else {
            if (editingIndex !== null) data.image = articles[editingIndex].image;
            finishSave(data);
        }
    });

    modalEl.addEventListener('hidden.bs.modal', () => {
        form.reset(); if (previewImg) previewImg.src = '';
        editingIndex = null; modalTitle.textContent = '📝 Add New Article'; saveBtn.textContent = 'Add';
    });

    tbody.addEventListener('change', e => {
        if (e.target.classList.contains('status-select')) {
            const idx = +e.target.dataset.index;
            const ns = e.target.value;
            if (confirm('Bạn có chắc chắn muốn thay đổi trạng thái?')) {
                articles[idx].status = ns;
                localStorage.setItem('articles', JSON.stringify(articles));
                render(); showToast('Trạng thái cập nhật!');
            } else e.target.value = articles[idx].status;
        }
    });

    function showToast(msg) {
        const toastEl = document.createElement('div');
        toastEl.className = 'toast align-items-center text-bg-success border-0';
        toastEl.setAttribute('role', 'alert'); toastEl.setAttribute('aria-live', 'assertive'); toastEl.setAttribute('aria-atomic', 'true');
        toastEl.innerHTML = `<div class="d-flex"><div class="toast-body">${msg}</div><button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button></div>`;
        let container = document.getElementById('toastContainer');
        if (!container) { container = document.createElement('div'); container.id = 'toastContainer'; container.className = 'position-fixed bottom-0 end-0 p-3'; container.style.zIndex = '9999'; document.body.appendChild(container); }
        container.appendChild(toastEl); new bootstrap.Toast(toastEl, { delay: 3000 }).show(); toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
    }
});
