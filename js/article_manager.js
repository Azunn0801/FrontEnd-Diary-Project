const entries = [
    {
        "id": 1,
        "name": "Nhật ký học tập"
    },
    {
        "id": 2,
        "name": "Nhật ký mục tiêu và kế hoạch"
    },
    {
        "id": 3,
        "name": "Nhật ký trải nghiệm- học qua đời sống"
    }
];

let articles = JSON.parse(localStorage.getItem("articles"));
if (!articles) {
    articles = entries;
    localStorage.setItem('articles', JSON.stringify(articles));
}

const articlesPerPage = 5;
let currentPage = 1;

document.addEventListener('DOMContentLoaded', function () {
    let articles;
    const storedArticles = localStorage.getItem('articles');
    if (storedArticles) {
        articles = JSON.parse(storedArticles);
    } else {
        articles = [
            {
                title: "Học nấu cá sốt cà chua",
                category: "Nấu ăn",
                content: "tôi đã học được cách nấu ăn...",
                status: "Public",
                image: "../assets/images/thumbnail1.jpg"
            },
            {
                title: "Bí kíp viết CV ngành IT",
                category: "IT",
                content: "Chia sẻ cách viết CV ấn tượng...",
                status: "Private",
                image: "../assets/images/thumbnail2.jpg"
            }
        ];
        localStorage.setItem('articles', JSON.stringify(articles));
    }

    const articlesTableBody = document.querySelector('.posts-container table tbody');
    const paginationContainer = document.querySelector('.pagination');
    const articleModalEl = document.getElementById('addArticleModal');
    const modalTitleEl = document.getElementById('addArticleModalLabel');
    const modalSaveBtn = document.getElementById('saveArticleBtn');
    let editingIndex = null;

    function renderArticles() {
        articlesTableBody.innerHTML = '';
        const startIndex = (currentPage - 1) * articlesPerPage;
        const endIndex = startIndex + articlesPerPage;
        const paginatedArticles = articles.slice(startIndex, endIndex);
        paginatedArticles.forEach((article, offset) => {
            const index = startIndex + offset;
            const row = document.createElement('tr');
            row.dataset.index = index;

            const imgTh = document.createElement('th');
            imgTh.setAttribute('scope', 'row');
            const imgElem = document.createElement('img');
            imgElem.src = article.image || '';
            imgElem.width = 100;
            imgElem.height = 70;
            imgTh.appendChild(imgElem);
            row.appendChild(imgTh);

            const titleTd = document.createElement('td');
            titleTd.textContent = article.title;
            row.appendChild(titleTd);

            const categoryTd = document.createElement('td');
            categoryTd.textContent = article.category;
            row.appendChild(categoryTd);

            const contentTd = document.createElement('td');
            contentTd.textContent = article.content;
            row.appendChild(contentTd);

            const statusTd = document.createElement('td');
            statusTd.className = 'status';
            statusTd.textContent = article.status;
            row.appendChild(statusTd);

            const statusSelectTd = document.createElement('td');
            const select = document.createElement('select');
            select.className = 'form-select status-select';
            const optPublic = document.createElement('option'); optPublic.value = 'Public'; optPublic.textContent = 'Public';
            const optPrivate = document.createElement('option'); optPrivate.value = 'Private'; optPrivate.textContent = 'Private';
            if (article.status === 'Public') optPublic.selected = true;
            else optPrivate.selected = true;
            select.appendChild(optPublic);
            select.appendChild(optPrivate);
            select.dataset.index = index;
            statusSelectTd.appendChild(select);
            row.appendChild(statusSelectTd);

            const actionsTd = document.createElement('td');
            const editBtn = document.createElement('button');
            editBtn.className = 'btn btn-warning edit-article';
            editBtn.textContent = 'Sửa';
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn btn-danger delete-article';
            deleteBtn.textContent = 'Xóa';
            actionsTd.appendChild(editBtn);
            actionsTd.appendChild(deleteBtn);
            row.appendChild(actionsTd);

            articlesTableBody.appendChild(row);
        });
    }

    function renderPagination() {
        paginationContainer.innerHTML = '';
        const totalPages = Math.ceil(articles.length / articlesPerPage);

        const prevLi = document.createElement('li');
        prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
        const prevLink = document.createElement('a');
        prevLink.className = 'page-link'; prevLink.href = '#'; prevLink.textContent = 'Previous';
        prevLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentPage > 1) {
                currentPage--;
                renderArticles();
                renderPagination();
            }
        });
        prevLi.appendChild(prevLink); paginationContainer.appendChild(prevLi);

        for (let i = 1; i <= totalPages; i++) {
            const li = document.createElement('li');
            li.className = `page-item ${i === currentPage ? 'active' : ''}`;
            const link = document.createElement('a'); link.className = 'page-link'; link.href = '#'; link.textContent = i;
            link.addEventListener('click', (e) => { e.preventDefault(); currentPage = i; renderArticles(); renderPagination(); });
            li.appendChild(link); paginationContainer.appendChild(li);
        }

        const nextLi = document.createElement('li');
        nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
        const nextLink = document.createElement('a'); nextLink.className = 'page-link'; nextLink.href = '#'; nextLink.textContent = 'Next';
        nextLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentPage < totalPages) {
                currentPage++;
                renderArticles();
                renderPagination();
            }
        });
        nextLi.appendChild(nextLink); paginationContainer.appendChild(nextLi);
    }

    renderArticles();
    renderPagination();

    articleModalEl.addEventListener('hidden.bs.modal', () => {
        document.querySelector('#addArticleModal form').reset();
        modalTitleEl.textContent = '📝 Add New Article';
        modalSaveBtn.textContent = 'Add';
        editingIndex = null;
    });

    modalSaveBtn.addEventListener('click', function () {
        const title = document.getElementById('title').value.trim();
        const category = document.getElementById('categories').value.trim();
        const content = document.getElementById('content').value.trim();
        const statusRadio = document.querySelector('input[name="status"]:checked');
        const statusValue = statusRadio ? statusRadio.value : 'public';
        const status = statusValue.toLowerCase() === 'private' ? 'Private' : 'Public';
        if (title === '' || content === '') { alert("Vui lòng nhập tiêu đề và nội dung bài viết"); return; }
        const newArticle = { title, category, content, status, image: '' };
        const fileInput = document.getElementById('fileUpload');
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0]; const reader = new FileReader();
            reader.onload = function (e) { newArticle.image = e.target.result; saveArticle(newArticle); };
            reader.readAsDataURL(file);
        } else {
            newArticle.image = editingIndex !== null ? articles[editingIndex].image : '';
            saveArticle(newArticle);
        }
    });

    function saveArticle(articleData) {
        if (editingIndex !== null) articles[editingIndex] = articleData;
        else articles.push(articleData);
        localStorage.setItem('articles', JSON.stringify(articles));
        const totalPages = Math.ceil(articles.length / articlesPerPage);
        if (currentPage > totalPages) currentPage = totalPages;
        renderArticles();
        renderPagination();
        bootstrap.Modal.getInstance(articleModalEl).hide();
        showToast(editingIndex !== null ? "Cập nhật bài viết thành công!" : "Thêm bài viết thành công!");
    }

    document.querySelector('.posts-container table tbody').addEventListener('click', function (e) {
        const target = e.target; const row = target.closest('tr'); if (!row) return;
        const idx = Number(row.dataset.index);
        if (target.classList.contains('edit-article')) {
            editingIndex = idx;
            const article = articles[idx];
            document.getElementById('title').value = article.title;
            document.getElementById('categories').value = article.category;
            document.getElementById('content').value = article.content;
            if (article.status === 'Public') document.getElementById('public').checked = true;
            else document.getElementById('private').checked = true;
            modalTitleEl.textContent = '📝 Cập nhật bài viết'; modalSaveBtn.textContent = 'Cập nhật';
            bootstrap.Modal.getOrCreateInstance(articleModalEl).show();
        }
        if (target.classList.contains('delete-article')) {
            if (confirm("Bạn có chắc chắn không?")) {
                articles.splice(idx, 1);
                localStorage.setItem('articles', JSON.stringify(articles));
                const totalPages = Math.ceil(articles.length / articlesPerPage);
                if (currentPage > totalPages) currentPage = totalPages;
                renderArticles(); renderPagination(); showToast("Xóa bài viết thành công!");
            }
        }
    });

    document.querySelector('.posts-container table tbody').addEventListener('change', function (e) {
        const target = e.target;
        if (target.classList.contains('status-select')) {
            const idx = Number(target.dataset.index);
            const newStatus = target.value;
            if (confirm("Bạn có chắc chắn không?")) {
                articles[idx].status = newStatus;
                localStorage.setItem('articles', JSON.stringify(articles));
                renderArticles(); renderPagination(); showToast("Cập nhật trạng thái bài viết thành công!");
            } else {
                target.value = articles[idx].status;
            }
        }
    });

    function showToast(message) {
        const toastEl = document.createElement('div');
        toastEl.className = 'toast align-items-center text-bg-success border-0';
        toastEl.setAttribute('role', 'alert'); toastEl.setAttribute('aria-live', 'assertive'); toastEl.setAttribute('aria-atomic', 'true');
        toastEl.innerHTML = `
            <div class=\"d-flex\">\n                <div class=\"toast-body\">${message}</div>\n                <button type=\"button\" class=\"btn-close btn-close-white me-2 m-auto\" data-bs-dismiss=\"toast\" aria-label=\"Close\"></button>\n            </div>`;
        let container = document.getElementById('toastContainer');
        if (!container) { container = document.createElement('div'); container.id = 'toastContainer'; container.className = 'position-fixed bottom-0 end-0 p-3'; container.style.zIndex = '9999'; document.body.appendChild(container); }
        container.appendChild(toastEl);
        const bsToast = new bootstrap.Toast(toastEl, { delay: 3000 }); bsToast.show();
        toastEl.addEventListener('hidden.bs.toast', () => { toastEl.remove(); });
    }
});
