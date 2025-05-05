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