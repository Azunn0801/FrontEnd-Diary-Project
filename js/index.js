let users = JSON.parse(localStorage.getItem("users")) || [
  { firstName: "Olivia", lastName: "Rhye", username: "olivia", email: "olivia@untitledui.com", status: "Hoạt động", avatar: "../assets/images/olivia.jpg", password: "password123" },
  { firstName: "Phoenix", lastName: "Baker", username: "phoenix", email: "phoenix@untitledui.com", status: "Hoạt động", avatar: "../assets/images/phoenix.jpg", password: "password456" },
  { firstName: "Lana", lastName: "Steiner", username: "lana", email: "lana@untitledui.com", status: "Hoạt động", avatar: "../assets/images/lana.jpg", password: "password789" },
  { firstName: "Demi", lastName: "Wilkinson", username: "demi", email: "demi@untitledui.com", status: "Hoạt động", avatar: "../assets/images/demi.jpg", password: "passwordABC" },
  { firstName: "Candice", lastName: "Wu", username: "candice", email: "candice@untitledui.com", status: "Hoạt động", avatar: "../assets/images/candice.jpg", password: "passwordDEF" },
  { firstName: "Natali", lastName: "Craig", username: "natali", email: "natali@untitledui.com", status: "Hoạt động", avatar: "../assets/images/natali.jpg", password: "passwordGHI" },
  { firstName: "Drew", lastName: "Cano", username: "drew", email: "drew@untitledui.com", status: "Hoạt động", avatar: "../assets/images/drew.jpg", password: "passwordJKL" },
  { firstName: "Orlando", lastName: "Diggs", username: "orlando", email: "orlando@untitledui.com", status: "Hoạt động", avatar: "../assets/images/orlando.jpg", password: "passwordMNO" },
  { firstName: "Andi", lastName: "Lane", username: "andi", email: "andi@untitledui.com", status: "Hoạt động", avatar: "../assets/images/andi.jpg", password: "passwordPQR" },
  { firstName: "Kate", lastName: "Morrison", username: "kate", email: "kate@untitledui.com", status: "Hoạt động", avatar: "../assets/images/kate.jpg", password: "passwordSTU" }
];
const posts = JSON.parse(localStorage.getItem('articles')) || [];
const categories = JSON.parse(localStorage.getItem('categories')) || [
  "Nấu ăn",
  "IT",
  "Work & Career",
  "Emotion & Feeling",
  "Personal Thoughts",
  "Daily Journal"
];
const postsPerPage = 4;
let currentPage = 1;
let currentCategory = 'All';

document.addEventListener('DOMContentLoaded', () => {
  const recentRow = document.querySelector('.recent-posts .row');
  const allRow = document.querySelector('.all-posts .row');
  const paginationUl = document.querySelector('.pagination');
  const catContainer = document.querySelector('h2.mb-4 small');

  catContainer.innerHTML = '';
  const makeLink = (text, cat) => {
    const a = document.createElement('a');
    a.href = '#';
    a.textContent = text;
    a.dataset.cat = cat;
    a.className = 'me-2 text-body text-decoration-none' + (cat === currentCategory ? ' active' : '');
    return a;
  };
  catContainer.appendChild(makeLink('All blog posts', 'All'));
  categories.forEach(cat => catContainer.appendChild(makeLink(cat, cat)));

  catContainer.addEventListener('click', e => {
    if (e.target.tagName === 'A') {
      e.preventDefault();
      currentCategory = e.target.dataset.cat;
      currentPage = 1;
      catContainer.querySelectorAll('a').forEach(a => a.classList.remove('active'));
      e.target.classList.add('active');
      renderAllPosts();
      renderPagination();
    }
  });

  recentRow.innerHTML = '';
  posts.slice(0, 2).forEach(post => {
    const col = document.createElement('div');
    col.className = 'col-md-6 mb-4';
    col.innerHTML = renderCard(post);
    recentRow.appendChild(col);
  });

  function getFilteredPosts() {
    return currentCategory === 'All'
      ? posts
      : posts.filter(p => p.category === currentCategory);
  }

  function renderAllPosts() {
    allRow.innerHTML = '';
    const filtered = getFilteredPosts();
    const start = (currentPage - 1) * postsPerPage;
    const pageItems = filtered.slice(start, start + postsPerPage);
    pageItems.forEach(post => {
      const col = document.createElement('div');
      col.className = 'col-md-6 mb-4';
      col.innerHTML = renderCard(post);
      allRow.appendChild(col);
    });
  }

  function renderPagination() {
    paginationUl.innerHTML = '';
    const filtered = getFilteredPosts();
    const totalPages = Math.ceil(filtered.length / postsPerPage);

    const navBtn = (text, disabled) => {
      const li = document.createElement('li');
      li.className = `page-item${disabled ? ' disabled' : ''}`;
      const a = document.createElement('a');
      a.className = 'page-link';
      a.href = '#';
      a.textContent = text;
      li.appendChild(a);
      return li;
    };

    paginationUl.appendChild(navBtn('Previous', currentPage === 1));
    for (let i = 1; i <= Math.ceil(filtered.length / postsPerPage); i++) {
      const li = document.createElement('li');
      li.className = `page-item${i === currentPage ? ' active' : ''}`;
      const a = document.createElement('a');
      a.className = 'page-link';
      a.href = '#';
      a.textContent = i;
      li.appendChild(a);
      paginationUl.appendChild(li);
    }
    paginationUl.appendChild(navBtn('Next', currentPage === totalPages));
  }

  renderAllPosts();
  renderPagination();

  paginationUl.addEventListener('click', e => {
    e.preventDefault();
    const text = e.target.textContent;
    const filtered = getFilteredPosts();
    const totalPages = Math.ceil(filtered.length / postsPerPage);
    if (text === 'Previous' && currentPage > 1) currentPage--;
    else if (text === 'Next' && currentPage < totalPages) currentPage++;
    else if (!isNaN(parseInt(text))) currentPage = parseInt(text);
    renderAllPosts();
    renderPagination();
  });

  document.body.addEventListener('click', e => {
    if (e.target.classList.contains('read-more')) {
      window.location.href = './pages/article_details.html';
    }
  });

});

function renderCard(post) {
  return `
    <div class="card">
      <img src="${post.image || 'https://placehold.co/600x400'}"
           width="600" height="400"
           style="object-fit: cover;"
           class="card-img-top"
           alt="${post.title}">
      <div class="card-body">
        <p class="card-text text-muted small">Date: ${post.date}</p>
        <h5 class="card-title">${post.title}</h5>
        <p class="card-text">${post.content}</p>
        <a href="#" class="btn btn-primary read-more">Read more</a>
        <span class="badge bg-${post.category === 'Nấu ăn' ? 'success' : 'secondary'}">${post.category}</span>
      </div>
    </div>

  `;
}

document.addEventListener('DOMContentLoaded', () => {
  const authButtons = document.getElementById('auth-buttons');
  const userAvatar  = document.getElementById('user-avatar');
  const avatarImg   = document.getElementById('userAvatarImg');
  const logoutLink  = document.getElementById('logoutLink');

  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (currentUser && currentUser.avatar) {
    authButtons.style.display = 'none';
    avatarImg.src = currentUser.avatar;
    userAvatar.style.display  = 'block';
  } else {
    authButtons.style.display = 'block';
    userAvatar.style.display  = 'none';
  }

  logoutLink.addEventListener('click', e => {
    e.preventDefault();
    localStorage.removeItem('currentUser');
    location.reload();
  });
});


document.addEventListener('DOMContentLoaded', () => {

  const logoutLink      = document.getElementById('logoutLink');
  const confirmLogout  = document.getElementById('confirmLogoutBtn');
  const logoutModalEl  = document.getElementById('logoutModal');
  const bsLogoutModal  = bootstrap.Modal.getOrCreateInstance(logoutModalEl);

  logoutLink.addEventListener('click', e => {
    e.preventDefault();
    bsLogoutModal.show();
  });

  confirmLogout.addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    bsLogoutModal.hide();
    location.reload();
  });
});




