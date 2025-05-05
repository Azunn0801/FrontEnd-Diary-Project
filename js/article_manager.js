function getFormattedDate(d = new Date()) {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

const entries = [
    { id: 1, title: "Nhật ký học tập", category: "", content: "", status: "Public", image: "" },
    { id: 2, title: "Nhật ký mục tiêu và kế hoạch", category: "", content: "", status: "Public", image: "" },
    { id: 3, title: "Nhật ký trải nghiệm - học qua đời sống", category: "", content: "", status: "Public", image: "" }
];

let articles = JSON.parse(localStorage.getItem('articles'));
if (!articles) {
    articles = entries;
    localStorage.setItem('articles', JSON.stringify(articles));
}

const articlesPerPage = 5;
let currentPage = 1;

document.addEventListener('DOMContentLoaded', () => {
    const categories = JSON.parse(localStorage.getItem('entries')) || [];
    const select = document.getElementById('categories');
    select.innerHTML = '';
    categories.forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat;
        opt.textContent = cat;
        select.appendChild(opt);
    });

    articles = JSON.parse(localStorage.getItem('articles'));
    localStorage.setItem('articles', JSON.stringify(articles));

    const tbody = document.querySelector('.posts-container tbody');
    const pagination = document.querySelector('.pagination');
    const modalEl = document.getElementById('addArticleModal');
    const modalTitle = document.getElementById('addArticleModalLabel');
    const saveBtn = document.getElementById('saveArticleBtn');
    const form = modalEl.querySelector('form');
    const fileInput = document.getElementById('fileUpload');
    const addBtn = document.querySelector('.add-button');
    const previewImg = document.getElementById('previewImage');
    let editingIndex = null;

    fileInput.addEventListener('change', e => {
        if (e.target.files[0] && previewImg) {
            const reader = new FileReader();
            reader.onload = ev => {
                previewImg.src = ev.target.result;
                previewImg.style.display = 'block';
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    });

    addBtn.addEventListener('click', () => {
        editingIndex = null;
        form.reset();
        previewImg && (previewImg.style.display = 'none');
        modalTitle.textContent = '📝 Add New Article';
        saveBtn.textContent = 'Add';
    });

    modalEl.addEventListener('hidden.bs.modal', () => {
        form.reset();
        previewImg && (previewImg.style.display = 'none');
        editingIndex = null;
        modalTitle.textContent = '📝 Add New Article';
        saveBtn.textContent = 'Add';
    });

    function renderTable() {
        tbody.innerHTML = '';
        const start = (currentPage - 1) * articlesPerPage;
        const pageItems = articles.slice(start, start + articlesPerPage);

        pageItems.forEach((art, i) => {
            const idx = start + i;
            const tr = document.createElement('tr');
            tr.dataset.index = idx;

            const imgTh = document.createElement('th');
            imgTh.scope = 'row';
            const img = document.createElement('img');
            img.src = art.image || '../assets/images/user.png';
            img.width = 100;
            img.height = 70;
            img.className = 'rounded';
            imgTh.appendChild(img);
            tr.appendChild(imgTh);

            ['title', 'category', 'content', 'status'].forEach(key => {
                const td = document.createElement('td');
                td.textContent = art[key];
                if (key === 'status') td.className = 'status';
                tr.appendChild(td);
            });

            const editTd = document.createElement('td');
            const sel = document.createElement('select');
            sel.className = 'form-select status-select';
            sel.dataset.index = idx;
            ['Public', 'Private'].forEach(s => {
                const op = document.createElement('option');
                op.value = s;
                op.textContent = s;
                s === art.status && (op.selected = true);
                sel.appendChild(op);
            });
            editTd.appendChild(sel);
            tr.appendChild(editTd);

            const actTd = document.createElement('td');
            const btnE = document.createElement('button');
            btnE.className = 'btn btn-warning edit-article me-2';
            btnE.textContent = 'Sửa';
            const btnD = document.createElement('button');
            btnD.className = 'btn btn-danger delete-article';
            btnD.textContent = 'Xóa';
            actTd.append(btnE, btnD);
            tr.appendChild(actTd);

            tbody.appendChild(tr);
        });
    }

    function renderPagination() {
        pagination.innerHTML = '';
        const totalPages = Math.ceil(articles.length / articlesPerPage);
        const makeBtn = (text, disabled, onClick) => {
            const li = document.createElement('li');
            li.className = `page-item${disabled ? ' disabled' : ''}`;
            const a = document.createElement('a');
            a.className = 'page-link';
            a.href = '#';
            a.textContent = text;
            !disabled && a.addEventListener('click', e => { e.preventDefault(); onClick(); });
            li.appendChild(a);
            return li;
        };
        pagination.appendChild(makeBtn('Previous', currentPage === 1, () => { currentPage--; render(); }));
        for (let i = 1; i <= totalPages; i++) {
            const li = document.createElement('li');
            li.className = `page-item${i === currentPage ? ' active' : ''}`;
            const a = document.createElement('a');
            a.className = 'page-link';
            a.href = '#';
            a.textContent = i;
            a.addEventListener('click', e => { e.preventDefault(); currentPage = i; render(); });
            li.appendChild(a);
            pagination.appendChild(li);
        }
        pagination.appendChild(makeBtn('Next', currentPage === totalPages, () => { currentPage++; render(); }));
    }

    function render() {
        renderTable();
        renderPagination();
    }
    render();

    tbody.addEventListener('click', e => {
        const tr = e.target.closest('tr');
        if (!tr) return;
        const idx = +tr.dataset.index;
        if (e.target.classList.contains('edit-article')) {
            editingIndex = idx;
            const art = articles[idx];
            modalTitle.textContent = '📝 Cập nhật bài viết';
            saveBtn.textContent = 'Cập nhật';
            form.reset();
            document.getElementById('title').value = art.title;
            document.getElementById('categories').value = art.category;
            document.getElementById('content').value = art.content;
            document.getElementById(art.status.toLowerCase()).checked = true;
            previewImg && (previewImg.src = art.image) && (previewImg.style.display = 'block');
            bootstrap.Modal.getOrCreateInstance(modalEl).show();
        }
        if (e.target.classList.contains('delete-article')) {
            if (confirm('Bạn có chắc chắn muốn xóa?')) {
                articles.splice(idx, 1);
                localStorage.setItem('articles', JSON.stringify(articles));
                currentPage = Math.min(currentPage, Math.ceil(articles.length / articlesPerPage));
                render();
            }
        }
    });

    tbody.addEventListener('change', e => {
        if (e.target.classList.contains('status-select')) {
            const idx = +e.target.dataset.index;
            const ns = e.target.value;
            if (confirm('Bạn có chắc chắn muốn thay đổi trạng thái?')) {
                articles[idx].status = ns;
                localStorage.setItem('articles', JSON.stringify(articles));
                render();
            } else {
                e.target.value = articles[idx].status;
            }
        }
    });

    saveBtn.addEventListener('click', () => {
        const title = document.getElementById('title').value.trim();
        const category = document.getElementById('categories').value;
        const content = document.getElementById('content').value.trim();
        const statusRadio = document.querySelector('input[name="status"]:checked');
        const status = statusRadio ? statusRadio.value.charAt(0).toUpperCase() + statusRadio.value.slice(1) : 'Public';
        if (!title || !content) { alert('Vui lòng nhập tiêu đề và nội dung'); return; }
        const data = { title, category, content, status, image: '' };
        if (fileInput.files[0]) {
            const reader = new FileReader();
            reader.onload = ev => { data.image = ev.target.result; finishSave(data); };
            reader.readAsDataURL(fileInput.files[0]);
        } else {
            editingIndex !== null && (data.image = articles[editingIndex].image);
            finishSave(data);
        }
    });

    function finishSave(data) {
        if (editingIndex !== null) {
            articles[editingIndex] = data;
        } else {
            articles.push(data);
        }
        localStorage.setItem('articles', JSON.stringify(articles));
        currentPage = Math.min(currentPage, Math.ceil(articles.length / articlesPerPage));
        bootstrap.Modal.getInstance(modalEl).hide();
        render();
        editingIndex = null;
    }
});
