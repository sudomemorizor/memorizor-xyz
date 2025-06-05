document.addEventListener('DOMContentLoaded', () => {
  const postsPerPage = 3;
  const blogList = document.getElementById('blog-list');
  const pagination = document.getElementById('pagination');
  const searchInput = document.getElementById('search');
  const tagFilter = document.getElementById('tag-filter');

  let currentPage = parseInt(new URLSearchParams(window.location.search).get('page')) || 1;
  let filteredPosts = [...blogPosts];

  const allTags = new Set();
  blogPosts.forEach(post => post.tags.forEach(tag => allTags.add(tag)));
  allTags.forEach(tag => {
    const opt = document.createElement('option');
    opt.value = tag;
    opt.textContent = tag;
    tagFilter.appendChild(opt);
  });

  function renderPosts() {
    blogList.innerHTML = '';
    const start = (currentPage - 1) * postsPerPage;
    const end = start + postsPerPage;
    const postsToShow = filteredPosts.slice(start, end);

    postsToShow.forEach(post => {
      const card = document.createElement('article');
      card.className = 'blog-card';
      card.innerHTML = `
        <a href="${post.url}">
          <h3 class="blog-title">${post.title}</h3>
          <p class="blog-date">${post.date}</p>
          <p class="blog-excerpt">${post.excerpt}</p>
        </a>
        <div class="blog-tags">
          ${post.tags.map(tag => `<span class="tag">#${tag}</span>`).join(' ')}
        </div>
      `;
      blogList.appendChild(card);
    });

    renderPagination();
  }

  function renderPagination() {
    pagination.innerHTML = '';
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

    if (currentPage > 1) {
      const firstBtn = document.createElement('a');
      firstBtn.textContent = '« First';
      firstBtn.href = `?page=1`;
      firstBtn.className = 'page-btn';
      pagination.appendChild(firstBtn);
    }

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement('a');
      btn.textContent = i;
      btn.href = `?page=${i}`;
      btn.className = 'page-btn';
      if (i === currentPage) btn.classList.add('active');
      pagination.appendChild(btn);
    }

    if (currentPage < totalPages) {
      const lastBtn = document.createElement('a');
      lastBtn.textContent = 'Last »';
      lastBtn.href = `?page=${totalPages}`;
      lastBtn.className = 'page-btn';
      pagination.appendChild(lastBtn);
    }
  }

  function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedTag = tagFilter.value;

    filteredPosts = blogPosts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm) || post.excerpt.toLowerCase().includes(searchTerm);
      const matchesTag = selectedTag === '' || post.tags.includes(selectedTag);
      return matchesSearch && matchesTag;
    });

    currentPage = 1;
    updateURL();
    renderPosts();
  }

  function updateURL() {
    const url = new URL(window.location);
    url.searchParams.set('page', currentPage);
    history.replaceState(null, '', url);
  }

  searchInput.addEventListener('input', applyFilters);
  tagFilter.addEventListener('change', applyFilters);

  renderPosts();
});
