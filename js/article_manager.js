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
]

let articles = JSON.parse(localStorage.getItem("articles"))
if(!articles)   {
    articles = entries
    localStorage.setItem("articles", JSON.stringify(articles))
}

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
    const articleModalEl = document.getElementById('addArticleModal');
    const modalTitleEl = document.getElementById('addArticleModalLabel');
    const modalSaveBtn = document.getElementById('saveArticleBtn');
    let editingIndex = null; 

    function renderArticles() {
        articlesTableBody.innerHTML = '';
        articles.forEach((article, index) => {
            const row = document.createElement('tr');
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
            const optPublic = document.createElement('option');
            optPublic.value = 'Public';
            optPublic.textContent = 'Public';
            const optPrivate = document.createElement('option');
            optPrivate.value = 'Private';
            optPrivate.textContent = 'Private';
            if (article.status === 'Public') {
                optPublic.selected = true;
            } else {
                optPrivate.selected = true;
            }
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

            row.dataset.index = index;
            articlesTableBody.appendChild(row);
        });
    }

    renderArticles();

    // Sự kiện khi Modal ẩn (đóng) -> reset form và trạng thái
    articleModalEl.addEventListener('hidden.bs.modal', () => {
        document.querySelector('#addArticleModal form').reset();
        modalTitleEl.textContent = '📝 Add New Article';
        modalSaveBtn.textContent = 'Add';
        editingIndex = null;
    });

    // Xử lý khi nhấn nút "Add/Cập nhật" trong Modal (thêm mới hoặc lưu chỉnh sửa)
    modalSaveBtn.addEventListener('click', function () {
        // Lấy dữ liệu từ form trong modal
        const title = document.getElementById('title').value.trim();
        const category = document.getElementById('categories').value.trim();
        const content = document.getElementById('content').value.trim();
        const statusRadio = document.querySelector('input[name="status"]:checked');
        const statusValue = statusRadio ? statusRadio.value : 'public';
        const status = statusValue.toLowerCase() === 'private' ? 'Private' : 'Public';
        // Kiểm tra bắt buộc tiêu đề và nội dung
        if (title === '' || content === '') {
            alert("Vui lòng nhập tiêu đề và nội dung bài viết");
            return;
        }
        // Tạo đối tượng bài viết mới (sẽ dùng cho cả thêm và sửa)
        const newArticle = {
            title: title,
            category: category,
            content: content,
            status: status,
            image: ''
        };
        const fileInput = document.getElementById('fileUpload');
        if (fileInput.files.length > 0) {
            // Nếu có file ảnh được chọn, đọc file và lưu dưới dạng Base64
            const file = fileInput.files[0];
            const reader = new FileReader();
            reader.onload = function (e) {
                newArticle.image = e.target.result;
                saveArticle(newArticle);
            };
            reader.readAsDataURL(file);
        } else {
            // Nếu không chọn ảnh mới:
            if (editingIndex !== null) {
                // trường hợp đang chỉnh sửa: giữ nguyên ảnh cũ
                newArticle.image = articles[editingIndex].image;
            } else {
                // trường hợp thêm mới: có thể đặt ảnh mặc định nếu cần, hiện tại để chuỗi rỗng
                newArticle.image = '';
            }
            saveArticle(newArticle);
        }
    });

    // Hàm lưu bài viết (dùng chung cho thêm mới và cập nhật)
    function saveArticle(articleData) {
        if (editingIndex !== null) {
            // Lưu thay đổi cho bài viết đang sửa
            articles[editingIndex] = articleData;
            localStorage.setItem('articles', JSON.stringify(articles));
            renderArticles();
            bootstrap.Modal.getInstance(articleModalEl).hide();  // đóng modal
            showToast("Cập nhật bài viết thành công!");
        } else {
            // Thêm bài viết mới
            articles.push(articleData);
            localStorage.setItem('articles', JSON.stringify(articles));
            renderArticles();
            bootstrap.Modal.getInstance(articleModalEl).hide();  // đóng modal
            showToast("Thêm bài viết thành công!");
        }
    }

    // Xử lý sự kiện Sửa, Xóa trên bảng danh sách bài viết
    articlesTableBody.addEventListener('click', function (e) {
        const target = e.target;
        const idx = target.closest('tr')?.dataset.index;
        if (idx == null) return;
        if (target.classList.contains('edit-article')) {
            // Chỉnh sửa bài viết
            if (confirm("Bạn có chắc chắn không?")) {
                editingIndex = Number(idx);
                const article = articles[editingIndex];
                // Điền thông tin bài viết vào form modal
                document.getElementById('title').value = article.title;
                document.getElementById('categories').value = article.category;
                document.getElementById('content').value = article.content;
                if (article.status === 'Public') {
                    document.getElementById('public').checked = true;
                } else {
                    document.getElementById('private').checked = true;
                }
                // Đổi tiêu đề và nút của modal thành chế độ cập nhật
                modalTitleEl.textContent = '📝 Cập nhật bài viết';
                modalSaveBtn.textContent = 'Cập nhật';
                // Hiển thị modal (dùng Bootstrap Modal)
                const modalInstance = bootstrap.Modal.getOrCreateInstance(articleModalEl);
                modalInstance.show();
            }
        }
        if (target.classList.contains('delete-article')) {
            // Xóa bài viết
            if (confirm("Bạn có chắc chắn không?")) {
                articles.splice(idx, 1);  // xóa bài viết khỏi mảng
                localStorage.setItem('articles', JSON.stringify(articles));
                renderArticles();
                showToast("Xóa bài viết thành công!");
            }
        }
    });

    // Xử lý khi thay đổi trạng thái Public/Private từ dropdown
    articlesTableBody.addEventListener('change', function (e) {
        const target = e.target;
        if (target.classList.contains('status-select')) {
            const idx = target.dataset.index;
            const newStatus = target.value;
            if (confirm("Bạn có chắc chắn không?")) {
                articles[idx].status = newStatus;
                localStorage.setItem('articles', JSON.stringify(articles));
                renderArticles();
                showToast("Cập nhật trạng thái bài viết thành công!");
            } else {
                // Nếu người dùng cancel xác nhận, hoàn nguyên select về giá trị cũ
                target.value = articles[idx].status;
            }
        }
    });

    // Hàm hiển thị toast (giống như các phần trên)
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
        toastEl.addEventListener('hidden.bs.toast', () => {
            toastEl.remove();
        });
    }
});
