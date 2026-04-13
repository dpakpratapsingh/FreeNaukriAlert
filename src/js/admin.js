/**
 * Admin Panel JavaScript
 * Handles authentication and CRUD operations for posts
 */

let currentUser = null;

// DOM ready
document.addEventListener("DOMContentLoaded", async () => {
  initAppwrite();

  currentUser = await getCurrentUser();

  const loginSection = document.getElementById("login-section");
  const adminSection = document.getElementById("admin-section");

  if (currentUser) {
    if (loginSection) loginSection.style.display = "none";
    if (adminSection) adminSection.style.display = "block";
    document.getElementById("admin-username").textContent = currentUser.name || currentUser.email;
    loadAdminPosts();
  } else {
    if (loginSection) loginSection.style.display = "block";
    if (adminSection) adminSection.style.display = "none";
  }

  // Login form
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("login-email").value;
      const password = document.getElementById("login-password").value;
      const errorEl = document.getElementById("login-error");
      try {
        await adminLogin(email, password);
        window.location.reload();
      } catch (err) {
        errorEl.textContent = "Login failed: " + (err.message || "Invalid credentials");
        errorEl.style.display = "block";
      }
    });
  }

  // Logout button
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      await adminLogout();
      window.location.reload();
    });
  }

  // Post form
  const postForm = document.getElementById("post-form");
  if (postForm) {
    postForm.addEventListener("submit", handlePostFormSubmit);
  }

  // Cancel edit button
  const cancelBtn = document.getElementById("cancel-edit");
  if (cancelBtn) {
    cancelBtn.addEventListener("click", resetPostForm);
  }
});

// Load posts in admin table
async function loadAdminPosts(category = "") {
  const tbody = document.getElementById("admin-posts-body");
  if (!tbody) return;

  tbody.innerHTML = '<tr><td colspan="5">Loading...</td></tr>';

  try {
    let queries = [
      Appwrite.Query.orderDesc("$createdAt"),
      Appwrite.Query.limit(50),
    ];
    if (category) {
      queries.push(Appwrite.Query.equal("category", category));
    }
    const result = await databases.listDocuments(DATABASE_ID, COLLECTION_POSTS, queries);

    if (result.documents.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5">No posts found.</td></tr>';
      return;
    }

    tbody.innerHTML = result.documents
      .map(
        (post) => `
      <tr>
        <td>${post.title}</td>
        <td>${getCategoryLabel(post.category)}</td>
        <td>${post.organization}</td>
        <td>${post.last_date || post.post_date || "N/A"}</td>
        <td>
          <button class="btn-edit" onclick="editPost('${post.$id}')">Edit</button>
          <button class="btn-delete" onclick="confirmDeletePost('${post.$id}')">Delete</button>
        </td>
      </tr>
    `
      )
      .join("");
  } catch (err) {
    const errorRow = document.createElement("tr");
    const errorCell = document.createElement("td");
    errorCell.setAttribute("colspan", "5");
    errorCell.textContent = "Error loading posts: " + (err.message || "Unknown error");
    errorRow.appendChild(errorCell);
    tbody.innerHTML = "";
    tbody.appendChild(errorRow);
  }
}

// Handle post form submission (create or update)
async function handlePostFormSubmit(e) {
  e.preventDefault();

  const submitBtn = document.getElementById("submit-post-btn");
  const msgEl = document.getElementById("form-message");
  submitBtn.disabled = true;
  msgEl.textContent = "";

  const editId = document.getElementById("edit-post-id").value;

  // Build important_dates JSON
  const importantDatesRaw = document.getElementById("important-dates").value;
  const applicationFeeRaw = document.getElementById("application-fee").value;
  const ageLimitRaw = document.getElementById("age-limit").value;
  const vacancyDetailsRaw = document.getElementById("vacancy-details").value;
  const importantLinksRaw = document.getElementById("important-links").value;

  const data = {
    title: document.getElementById("post-title").value.trim(),
    category: document.getElementById("post-category").value,
    organization: document.getElementById("post-org").value.trim(),
    short_info: document.getElementById("post-short-info").value.trim(),
    post_date: document.getElementById("post-date").value.trim(),
    last_date: document.getElementById("last-date").value.trim(),
    is_new: document.getElementById("post-is-new").checked,
    status: document.getElementById("post-status").value,
    important_dates: importantDatesRaw,
    application_fee: applicationFeeRaw,
    age_limit: ageLimitRaw,
    vacancy_details: vacancyDetailsRaw,
    important_links: importantLinksRaw,
  };

  try {
    if (editId) {
      await updatePost(editId, data);
      msgEl.textContent = "Post updated successfully!";
      msgEl.className = "msg-success";
    } else {
      await createPost(data);
      msgEl.textContent = "Post created successfully!";
      msgEl.className = "msg-success";
    }
    resetPostForm();
    loadAdminPosts();
  } catch (err) {
    msgEl.textContent = "Error: " + (err.message || "Failed to save post");
    msgEl.className = "msg-error";
  } finally {
    submitBtn.disabled = false;
  }
}

// Populate form for editing an existing post
async function editPost(documentId) {
  const post = await getPostById(documentId);
  if (!post) return;

  document.getElementById("edit-post-id").value = post.$id;
  document.getElementById("post-title").value = post.title;
  document.getElementById("post-category").value = post.category;
  document.getElementById("post-org").value = post.organization;
  document.getElementById("post-short-info").value = post.short_info || "";
  document.getElementById("post-date").value = post.post_date || "";
  document.getElementById("last-date").value = post.last_date || "";
  document.getElementById("post-is-new").checked = post.is_new || false;
  document.getElementById("post-status").value = post.status || "active";
  document.getElementById("important-dates").value = post.important_dates || "";
  document.getElementById("application-fee").value = post.application_fee || "";
  document.getElementById("age-limit").value = post.age_limit || "";
  document.getElementById("vacancy-details").value = post.vacancy_details || "";
  document.getElementById("important-links").value = post.important_links || "";

  document.getElementById("form-title").textContent = "Edit Post";
  document.getElementById("submit-post-btn").textContent = "Update Post";
  document.getElementById("cancel-edit").style.display = "inline-block";
  document.getElementById("post-form-section").scrollIntoView({ behavior: "smooth" });
}

// Confirm and delete a post
async function confirmDeletePost(documentId) {
  if (!confirm("Are you sure you want to delete this post? This cannot be undone.")) return;
  try {
    await deletePost(documentId);
    loadAdminPosts();
  } catch (err) {
    alert("Error deleting post: " + err.message);
  }
}

// Reset the post form to its initial state
function resetPostForm() {
  document.getElementById("post-form").reset();
  document.getElementById("edit-post-id").value = "";
  document.getElementById("form-title").textContent = "Add New Post";
  document.getElementById("submit-post-btn").textContent = "Publish Post";
  document.getElementById("cancel-edit").style.display = "none";
  document.getElementById("form-message").textContent = "";
}

// Filter posts by category in admin panel
function filterAdminByCategory() {
  const cat = document.getElementById("filter-category").value;
  loadAdminPosts(cat);
}
