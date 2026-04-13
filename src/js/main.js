/**
 * Main application logic for Sarkari Result website
 * Handles rendering posts on the homepage and listing pages
 */

// Utility: Escape HTML special characters to prevent XSS
function escapeHtml(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Utility: Parse JSON safely
function safeParseJSON(str) {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
}

// Utility: Format date string
function formatDate(dateStr) {
  if (!dateStr) return "N/A";
  return dateStr;
}

// Utility: Show a "NEW" badge for recent posts
function newBadge(isNew) {
  return isNew
    ? '<span class="badge-new">NEW</span>'
    : "";
}

// Render a post row for homepage section tables
function renderPostRow(post) {
  return `
    <tr>
      <td>
        <a href="post.html?id=${encodeURIComponent(post.$id)}" class="post-link">
          ${escapeHtml(post.title)} ${newBadge(post.is_new)}
        </a>
      </td>
      <td class="post-org">${escapeHtml(post.organization)}</td>
      <td class="post-date">${escapeHtml(formatDate(post.post_date || post.last_date))}</td>
    </tr>
  `;
}

// Render a section table on the homepage
function renderSection(containerId, posts, viewAllHref) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!posts || posts.length === 0) {
    container.innerHTML = '<tr><td colspan="3" class="no-data">No data available. Add posts from the admin panel.</td></tr>';
    return;
  }

  container.innerHTML = posts.map(renderPostRow).join("");

  const viewAll = document.getElementById(`${containerId}-viewall`);
  if (viewAll) viewAll.href = viewAllHref;
}

// Render listing page (jobs.html, results.html, etc.)
function renderListingPage(containerId, posts, total, page, limit, category) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!posts || posts.length === 0) {
    container.innerHTML = '<div class="no-data">No posts found.</div>';
    return;
  }

  container.innerHTML = posts
    .map(
      (post) => `
    <div class="listing-card">
      <h3><a href="post.html?id=${encodeURIComponent(post.$id)}">${escapeHtml(post.title)} ${newBadge(post.is_new)}</a></h3>
      <div class="listing-meta">
        <span><strong>Organization:</strong> ${escapeHtml(post.organization)}</span>
        ${post.post_date ? `<span><strong>Post Date:</strong> ${escapeHtml(post.post_date)}</span>` : ""}
        ${post.last_date ? `<span><strong>Last Date:</strong> ${escapeHtml(post.last_date)}</span>` : ""}
      </div>
      ${post.short_info ? `<p class="short-info">${escapeHtml(post.short_info)}</p>` : ""}
      <a href="post.html?id=${post.$id}" class="btn-detail">View Details &raquo;</a>
    </div>
  `
    )
    .join("");

  // Pagination
  renderPagination("pagination", total, page, limit, category);
}

// Render pagination controls
function renderPagination(containerId, total, page, limit, category) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) {
    container.innerHTML = "";
    return;
  }

  // Encode category for safe use in URL query parameters
  const safeCategory = encodeURIComponent(category);

  let html = '<div class="pagination">';
  if (page > 1) {
    html += `<a href="?category=${safeCategory}&page=${page - 1}" class="page-btn">&laquo; Previous</a>`;
  }
  for (let i = Math.max(1, page - 2); i <= Math.min(totalPages, page + 2); i++) {
    html += `<a href="?category=${safeCategory}&page=${i}" class="page-btn ${i === page ? "active" : ""}">${i}</a>`;
  }
  if (page < totalPages) {
    html += `<a href="?category=${safeCategory}&page=${page + 1}" class="page-btn">Next &raquo;</a>`;
  }
  html += "</div>";
  container.innerHTML = html;
}

// Utility: Sanitize a URL to only allow http/https schemes
function sanitizeUrl(url) {
  if (!url) return "#";
  const trimmed = String(url).trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return "#";
}

// Render the post detail page
function renderPostDetail(post) {
  if (!post) {
    document.getElementById("post-detail").innerHTML =
      '<div class="error">Post not found.</div>';
    return;
  }

  document.title = `${escapeHtml(post.title)} - Sarkari Result Alert`;

  const importantDates = safeParseJSON(post.important_dates);
  const applicationFee = safeParseJSON(post.application_fee);
  const ageLimit = safeParseJSON(post.age_limit);
  const vacancyDetails = safeParseJSON(post.vacancy_details);
  const importantLinks = safeParseJSON(post.important_links);

  let html = `
    <div class="post-header">
      <h1>${escapeHtml(post.title)}</h1>
      <div class="post-meta-bar">
        <span class="category-tag">${escapeHtml(getCategoryLabel(post.category))}</span>
        <span class="org-tag">${escapeHtml(post.organization)}</span>
        ${post.post_date ? `<span>Post Date: ${escapeHtml(post.post_date)}</span>` : ""}
      </div>
    </div>
  `;

  if (post.short_info) {
    html += `
      <div class="detail-section">
        <h2>Short Information</h2>
        <p>${escapeHtml(post.short_info)}</p>
      </div>
    `;
  }

  if (importantDates && Object.keys(importantDates).length > 0) {
    html += `
      <div class="detail-section">
        <h2>Important Dates</h2>
        <table class="detail-table">
          <tbody>
            ${Object.entries(importantDates)
              .map(
                ([k, v]) => `<tr><td>${escapeHtml(k)}</td><td>${escapeHtml(v)}</td></tr>`
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  if (applicationFee && Object.keys(applicationFee).length > 0) {
    html += `
      <div class="detail-section">
        <h2>Application Fee</h2>
        <table class="detail-table">
          <tbody>
            ${Object.entries(applicationFee)
              .map(([k, v]) => `<tr><td>${escapeHtml(k)}</td><td>${escapeHtml(v)}</td></tr>`)
              .join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  if (ageLimit && Object.keys(ageLimit).length > 0) {
    html += `
      <div class="detail-section">
        <h2>Age Limit</h2>
        <table class="detail-table">
          <tbody>
            ${Object.entries(ageLimit)
              .map(([k, v]) => `<tr><td>${escapeHtml(k)}</td><td>${escapeHtml(v)}</td></tr>`)
              .join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  if (vacancyDetails && Object.keys(vacancyDetails).length > 0) {
    html += `
      <div class="detail-section">
        <h2>Vacancy Details</h2>
        <table class="detail-table">
          <tbody>
            ${Object.entries(vacancyDetails)
              .map(([k, v]) => `<tr><td>${escapeHtml(k)}</td><td>${escapeHtml(v)}</td></tr>`)
              .join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  if (importantLinks && Object.keys(importantLinks).length > 0) {
    html += `
      <div class="detail-section important-links-section">
        <h2>Important Links</h2>
        <table class="detail-table links-table">
          <tbody>
            ${Object.entries(importantLinks)
              .map(
                ([k, v]) =>
                  `<tr><td>${escapeHtml(k)}</td><td><a href="${escapeHtml(sanitizeUrl(v))}" target="_blank" rel="noopener noreferrer" class="detail-link">${escapeHtml(k)}</a></td></tr>`
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  document.getElementById("post-detail").innerHTML = html;
}

// Get human-readable category label
function getCategoryLabel(category) {
  const labels = {
    latest_jobs: "Latest Jobs",
    latest_results: "Latest Results",
    admit_card: "Admit Card",
    answer_key: "Answer Key",
    syllabus: "Syllabus",
    certificate_verification: "Certificate Verification",
    admission: "Admission",
  };
  return labels[category] || category;
}

// Load homepage sections
async function loadHomepage() {
  const { databases: db } = initAppwrite();
  const sections = [
    { id: "latest-jobs-body", category: CATEGORIES.LATEST_JOBS, href: "pages/listing.html?category=latest_jobs" },
    { id: "latest-results-body", category: CATEGORIES.LATEST_RESULTS, href: "pages/listing.html?category=latest_results" },
    { id: "admit-card-body", category: CATEGORIES.ADMIT_CARD, href: "pages/listing.html?category=admit_card" },
    { id: "answer-key-body", category: CATEGORIES.ANSWER_KEY, href: "pages/listing.html?category=answer_key" },
    { id: "syllabus-body", category: CATEGORIES.SYLLABUS, href: "pages/listing.html?category=syllabus" },
    { id: "admission-body", category: CATEGORIES.ADMISSION, href: "pages/listing.html?category=admission" },
  ];

  await Promise.all(
    sections.map(async (section) => {
      const result = await getPostsByCategory(section.category, 8);
      renderSection(section.id, result.documents, section.href);
    })
  );
}

// Load listing page
async function loadListingPage() {
  const params = new URLSearchParams(window.location.search);
  const category = params.get("category") || CATEGORIES.LATEST_JOBS;
  const page = parseInt(params.get("page") || "1", 10);
  const limit = 15;
  const offset = (page - 1) * limit;

  // Update page title/heading
  const label = getCategoryLabel(category);
  const heading = document.getElementById("listing-heading");
  if (heading) heading.textContent = label;
  const headingMain = document.getElementById("listing-heading-main");
  if (headingMain) headingMain.textContent = label;
  document.title = `${label} - Sarkari Result Alert`;

  const result = await getPostsByCategory(category, limit, offset);
  renderListingPage("listing-container", result.documents, result.total, page, limit, category);
}

// Load post detail page
async function loadPostDetail() {
  const params = new URLSearchParams(window.location.search);
  const postId = params.get("id");
  if (!postId) {
    document.getElementById("post-detail").innerHTML =
      '<div class="error">No post ID specified.</div>';
    return;
  }
  initAppwrite();
  const post = await getPostById(postId);
  renderPostDetail(post);
}

// Search functionality
async function handleSearch(event) {
  event.preventDefault();
  const query = document.getElementById("search-input").value.trim();
  if (!query) return;
  initAppwrite();
  const result = await searchPosts(query);
  renderListingPage(
    "listing-container",
    result.documents,
    result.total,
    1,
    20,
    ""
  );
  const heading = document.getElementById("listing-heading");
  if (heading) heading.textContent = `Search Results for "${query}"`;
}

// Initialize based on current page
document.addEventListener("DOMContentLoaded", () => {
  initAppwrite();
  const page = document.body.dataset.page;
  if (page === "home") loadHomepage();
  else if (page === "listing") loadListingPage();
  else if (page === "post") loadPostDetail();

  // Search form
  const searchForm = document.getElementById("search-form");
  if (searchForm) {
    searchForm.addEventListener("submit", handleSearch);
  }
});
