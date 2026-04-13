/**
 * Appwrite Configuration
 * Replace the values below with your actual Appwrite project details.
 *
 * Setup steps:
 * 1. Create a free account at https://appwrite.io or self-host Appwrite
 * 2. Create a new project
 * 3. Copy the Project ID and paste it as APPWRITE_PROJECT_ID
 * 4. Update APPWRITE_ENDPOINT if using self-hosted Appwrite
 * 5. Run the setup script (see README.md) to create the database and collections
 */

const APPWRITE_ENDPOINT = "https://cloud.appwrite.io/v1";
const APPWRITE_PROJECT_ID = "YOUR_PROJECT_ID";
const DATABASE_ID = "sarkari_db";
const COLLECTION_POSTS = "posts";

// Categories
const CATEGORIES = {
  LATEST_JOBS: "latest_jobs",
  LATEST_RESULTS: "latest_results",
  ADMIT_CARD: "admit_card",
  ANSWER_KEY: "answer_key",
  SYLLABUS: "syllabus",
  CERTIFICATE_VERIFICATION: "certificate_verification",
  ADMISSION: "admission",
};

// Initialize Appwrite SDK (loaded via CDN in HTML)
let client;
let databases;
let account;

function initAppwrite() {
  client = new Appwrite.Client();
  client.setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT_ID);
  databases = new Appwrite.Databases(client);
  account = new Appwrite.Account(client);
  return { client, databases, account };
}

/**
 * Fetch posts by category
 * @param {string} category - Category slug
 * @param {number} limit - Number of posts to fetch
 * @param {number} offset - Offset for pagination
 */
async function getPostsByCategory(category, limit = 10, offset = 0) {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_POSTS,
      [
        Appwrite.Query.equal("category", category),
        Appwrite.Query.equal("status", "active"),
        Appwrite.Query.orderDesc("$createdAt"),
        Appwrite.Query.limit(limit),
        Appwrite.Query.offset(offset),
      ]
    );
    return response;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return { documents: [], total: 0 };
  }
}

/**
 * Fetch a single post by its document ID
 * @param {string} documentId - The document ID
 */
async function getPostById(documentId) {
  try {
    const response = await databases.getDocument(
      DATABASE_ID,
      COLLECTION_POSTS,
      documentId
    );
    return response;
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

/**
 * Search posts by title
 * @param {string} query - Search query
 * @param {number} limit - Number of results
 */
async function searchPosts(query, limit = 20) {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_POSTS,
      [
        Appwrite.Query.search("title", query),
        Appwrite.Query.equal("status", "active"),
        Appwrite.Query.orderDesc("$createdAt"),
        Appwrite.Query.limit(limit),
      ]
    );
    return response;
  } catch (error) {
    console.error("Error searching posts:", error);
    return { documents: [], total: 0 };
  }
}

/**
 * Create a new post (requires authentication)
 * @param {object} data - Post data
 */
async function createPost(data) {
  try {
    const response = await databases.createDocument(
      DATABASE_ID,
      COLLECTION_POSTS,
      Appwrite.ID.unique(),
      data
    );
    return response;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
}

/**
 * Update an existing post (requires authentication)
 * @param {string} documentId - Document ID to update
 * @param {object} data - Updated data
 */
async function updatePost(documentId, data) {
  try {
    const response = await databases.updateDocument(
      DATABASE_ID,
      COLLECTION_POSTS,
      documentId,
      data
    );
    return response;
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
}

/**
 * Delete a post (requires authentication)
 * @param {string} documentId - Document ID to delete
 */
async function deletePost(documentId) {
  try {
    await databases.deleteDocument(DATABASE_ID, COLLECTION_POSTS, documentId);
    return true;
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
}

/**
 * Admin: Login with email/password
 */
async function adminLogin(email, password) {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

/**
 * Admin: Logout
 */
async function adminLogout() {
  try {
    await account.deleteSession("current");
    return true;
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
}

/**
 * Admin: Get current session
 */
async function getCurrentUser() {
  try {
    const user = await account.get();
    return user;
  } catch {
    return null;
  }
}
