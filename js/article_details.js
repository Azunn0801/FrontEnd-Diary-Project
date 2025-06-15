(function () {
    const articles = JSON.parse(localStorage.getItem('articles')) || [];
    const selectedId = parseInt(localStorage.getItem('selectedArticleId'), 10);
    const post = articles.find(a => a.id === selectedId);
    if (!post) return;

    const imageEl = document.getElementById('post-image');
    const titleEl = document.getElementById('post-title');
    const contentEl = document.getElementById('post-content');
    const dateEl = document.getElementById('post-date');
    const categoryEl = document.getElementById('post-category');
    const likesEl = document.getElementById('post-likes');
    const commentsCountEl = document.getElementById('post-comments-count');
    const commentsContainer = document.getElementById('comments-container');
    const toggleCommentsLink = document.getElementById('toggle-comments');
    const newCommentText = document.getElementById('newCommentText');
    const postCommentBtn = document.getElementById('postCommentBtn');
    const postIdEl = document.getElementById('postId');

    imageEl.src = post.image || 'https://placehold.co/600x400';
    titleEl.textContent = post.title;
    contentEl.textContent = post.content;
    dateEl.textContent = post.date;
    categoryEl.textContent = post.category;
    categoryEl.classList.add(post.category === 'Nấu ăn' ? 'bg-success' : 'bg-secondary');
    likesEl.innerHTML = `${post.likes || 0} Like <i class="bi bi-hand-thumbs-up"></i>`;
    if (postIdEl) postIdEl.textContent = post.id;

    const commentKey = `comments_${post.id}`;
    let comments = JSON.parse(localStorage.getItem(commentKey)) || [];

    function saveComments() {
        localStorage.setItem(commentKey, JSON.stringify(comments));
    }

    function renderComments() {
        commentsContainer.innerHTML = '';
        commentsCountEl.innerHTML = `${comments.length} Replies <i class="bi bi-chat"></i>`;
        comments.forEach((c, i) => {
            const div = document.createElement('div');
            div.className = 'comment d-flex';
            div.innerHTML = `
              <img src="${c.avatar || '../assets/images/user.png'}" alt="User" class="rounded-circle me-3" width="40" height="40">
              <div class="comment-body w-100">
                <i class="bi bi-trash delete-btn" data-index="${i}"></i>
                <p>${c.text}</p>
                <div class="stats-small text-muted">
                  <span>${c.likes || 0} <i class="bi bi-hand-thumbs-up"></i></span>
                </div>
              </div>
            `;
            commentsContainer.appendChild(div);
        });

        commentsContainer.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const delIndex = parseInt(btn.getAttribute('data-index'), 10);
                comments.splice(delIndex, 1);
                saveComments();
                renderComments();
            });
        });
    }

    toggleCommentsLink.addEventListener('click', e => {
        e.preventDefault();
        const show = commentsContainer.style.display === 'none';
        commentsContainer.style.display = show ? 'block' : 'none';
        toggleCommentsLink.innerHTML = show
            ? 'Hide comments <i class="bi bi-chevron-up"></i>'
            : 'View all comments <i class="bi bi-chevron-down"></i>';
        if (show) renderComments();
    });

    postCommentBtn.addEventListener('click', () => {
        const text = newCommentText.value.trim();
        if (!text) return;
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        const avatar = currentUser.avatar || '../assets/images/user.png';
        const newComment = { text, avatar, likes: 0 };
        comments.push(newComment);
        saveComments();
        newCommentText.value = '';
        if (commentsContainer.style.display === 'block') {
            renderComments();
        }
        commentsCountEl.innerHTML = `${comments.length} Replies <i class="bi bi-chat"></i>`;
    });
})();
