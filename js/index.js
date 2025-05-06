let users = JSON.parse(localStorage.getItem("users")) || [];

const posts = JSON.parse(localStorage.getItem('articles')) || [];
const categories = JSON.parse(localStorage.getItem('categories')) || [
  "Nấu ăn", "IT", "Work & Career",
  "Emotion & Feeling", "Personal Thoughts", "Daily Journal"
];

const postsPerPage = 4;
let currentPage = 1;
let currentCategory = 'All';
let searchVal = '';

document.addEventListener('DOMContentLoaded', () => {
  const recentRow = document.querySelector('.recent-posts .row');
  const allRow = document.querySelector('.all-posts .row');
  const paginationUl = document.querySelector('.pagination');
  const catContainer = document.querySelector('h2.mb-4 small');
  const searchInput = document.getElementById('headerSearch');
  const searchBtn = document.getElementById('searchBtn');
  const recentSection = document.querySelector('.recent-posts');


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

  const doSearch = () => {
    searchVal = searchInput.value.trim().toLowerCase();
    currentPage = 1;
    if (searchVal) {
      recentSection.style.display = 'none';
    } else {
      recentSection.style.display = 'block';
    }
    renderAllPosts();
    renderPagination();
  };
  searchBtn.addEventListener('click', e => {
    e.preventDefault();
    doSearch();
  });
  searchInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      doSearch();
    }
  });
  searchInput.addEventListener('input', () => {
    if (searchInput.value.trim() === '') {
      searchVal = '';
      currentPage = 1;
      recentSection.style.display = 'block';
      renderAllPosts();
      renderPagination();
    }
  });

  renderAllPosts();
  renderPagination();

  document.body.addEventListener('click', e => {
    if (e.target.classList.contains('read-more')) {
      window.location.href = './pages/article_details.html';
    }
  });
});

function getFilteredPosts() {
  let filtered = posts;

  if (currentCategory !== 'All') {
    filtered = filtered.filter(p => p.category === currentCategory);
  }
  if (searchVal) {
    filtered = filtered.filter(p =>
      p.title.toLowerCase().includes(searchVal) ||
      p.content.toLowerCase().includes(searchVal)
    );
  }
  return filtered;
}

function renderAllPosts() {
  const allRow = document.querySelector('.all-posts .row');
  const paginationUl = document.querySelector('.pagination');
  allRow.innerHTML = '';

  const filtered = getFilteredPosts();
  if (filtered.length === 0) {
    allRow.innerHTML = `
      <div class="col-12 text-center py-5">
        No article found
      </div>`;
    paginationUl.style.display = 'none';
    return;
  }
  paginationUl.style.display = 'flex';

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
  const paginationUl = document.querySelector('.pagination');
  paginationUl.innerHTML = '';

  const filtered = getFilteredPosts();
  const totalPages = Math.ceil(filtered.length / postsPerPage);

  const makeBtn = (label, disabled, onClick) => {
    const li = document.createElement('li');
    li.className = `page-item${disabled ? ' disabled' : ''}`;
    const a = document.createElement('a');
    a.className = 'page-link';
    a.href = '#';
    a.textContent = label;
    if (!disabled) {
      a.addEventListener('click', e => {
        e.preventDefault();
        onClick();
        renderAllPosts();
        renderPagination();
      });
    }
    li.appendChild(a);
    return li;
  };

  paginationUl.appendChild(
    makeBtn('Previous', currentPage === 1, () => { currentPage--; })
  );
  for (let i = 1; i <= totalPages; i++) {
    paginationUl.appendChild(
      makeBtn(i, false, () => { currentPage = i; })
    );
  }
  paginationUl.appendChild(
    makeBtn('Next', currentPage === totalPages, () => { currentPage++; })
  );
}

function renderCard(post) {
  return `
    <div class="card h-100">
      <img src="${post.image || 'https://placehold.co/600x400'}"
           class="card-img-top"
           style="object-fit:cover; height:200px"
           alt="${post.title}">
      <div class="card-body d-flex flex-column">
        <p class="card-text text-muted small mb-1">${post.date || ''}</p>
        <h5 class="card-title mb-2">${post.title}</h5>
        <p class="card-text flex-grow-1">${post.content}</p>
        <div class="mt-3 d-flex justify-content-between align-items-center">
          <a href="#" class="btn btn-primary read-more">Read more</a>
          <span class="badge bg-${post.category === 'Nấu ăn' ? 'success' : 'secondary'
    }">${post.category}</span>
        </div>
      </div>
    </div>`;
}
