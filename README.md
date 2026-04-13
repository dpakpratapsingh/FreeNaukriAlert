# FreeNaukriAlert – Sarkari Result Website on Appwrite

A full-featured **Sarkari Result** website replica built with plain HTML/CSS/JavaScript on the frontend and **[Appwrite](https://appwrite.io)** as the backend (database + authentication).

## 🌟 Features

- **Homepage** with multiple categorized sections (Latest Jobs, Results, Admit Cards, Answer Keys, Syllabus, Admission)
- **Listing pages** for each category with pagination
- **Post detail pages** with structured sections: Important Dates, Application Fee, Age Limit, Vacancy Details, and Important Links
- **Live search** across all posts
- **Scrolling news ticker** on the homepage
- **Admin panel** for authenticated create/edit/delete of posts
- **Responsive design** optimized for mobile and desktop
- Fully powered by **Appwrite** (database + auth) — no custom server needed

## 📂 Project Structure

```
FreeNaukriAlert/
├── src/
│   ├── index.html              # Homepage
│   ├── css/
│   │   └── style.css           # All styles
│   ├── js/
│   │   ├── appwrite.js         # Appwrite SDK setup & API functions
│   │   ├── main.js             # Frontend rendering logic
│   │   └── admin.js            # Admin panel logic
│   ├── pages/
│   │   ├── listing.html        # Category listing page
│   │   └── post.html           # Post detail page
│   └── admin/
│       └── index.html          # Admin panel (login + CRUD)
├── appwrite/
│   ├── appwrite.json           # Appwrite schema reference
│   └── setup.js                # Automated setup script
├── package.json
└── README.md
```

## 🚀 Quick Start

### 1. Create an Appwrite Project

1. Sign up at [cloud.appwrite.io](https://cloud.appwrite.io) (free) or [self-host Appwrite](https://appwrite.io/docs/self-hosting).
2. Create a new **Project** and note your **Project ID**.
3. Go to **Settings → API Keys** and create an API key with full database permissions (for the setup script).

### 2. Run the Setup Script

The setup script automatically creates the database, collections, attributes, indexes, and sample data.

```bash
# Install dependencies
npm install

# Run setup with your Appwrite credentials
APPWRITE_PROJECT_ID=your_project_id \
APPWRITE_API_KEY=your_api_key \
npm run setup
```

> **Self-hosted Appwrite?** Also set `APPWRITE_ENDPOINT=https://your-appwrite-domain/v1`

### 3. Configure the Frontend

Open `src/js/appwrite.js` and update:

```js
const APPWRITE_ENDPOINT = "https://cloud.appwrite.io/v1"; // or your self-hosted URL
const APPWRITE_PROJECT_ID = "YOUR_PROJECT_ID";             // ← replace this
```

### 4. Add Your Domain to Appwrite

In your Appwrite project console:
- Go to **Settings → Platforms**
- Add a **Web** platform with your domain (e.g., `localhost` for local development)

### 5. Serve the Website

```bash
npm run serve
# Opens at http://localhost:3000
```

Or simply open `src/index.html` directly in your browser.

## 🔐 Admin Panel

Visit `/src/admin/index.html` (or `http://localhost:3000/admin/`) to manage content.

- **Login** using your Appwrite project account credentials
- **Add posts** with all fields: title, category, organization, dates, fees, vacancies, links
- **Edit / Delete** existing posts
- **Filter** posts by category

> To create an admin user, go to your Appwrite project console → **Auth → Users** → Add User.

## 📋 Post Categories

| Category | Description |
|---|---|
| `latest_jobs` | Government job notifications |
| `latest_results` | Exam result declarations |
| `admit_card` | Admit card / hall ticket releases |
| `answer_key` | Answer key publications |
| `syllabus` | Syllabus and exam patterns |
| `admission` | College/university admission notifications |
| `certificate_verification` | Document verification notices |

## 🗄️ Database Schema

**Collection: `posts`**

| Field | Type | Description |
|---|---|---|
| `title` | String(500) | Post title |
| `category` | String(50) | Category slug |
| `organization` | String(300) | Organization name |
| `short_info` | String(1000) | Brief description |
| `important_dates` | String(5000) | JSON key-value pairs |
| `application_fee` | String(2000) | JSON key-value pairs |
| `age_limit` | String(1000) | JSON key-value pairs |
| `vacancy_details` | String(5000) | JSON key-value pairs |
| `important_links` | String(5000) | JSON `{"label": "url"}` pairs |
| `post_date` | String(20) | Date posted |
| `last_date` | String(20) | Application deadline |
| `is_new` | Boolean | Show "NEW" badge |
| `status` | String(20) | `active` or `inactive` |

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (no framework)
- **Backend**: [Appwrite](https://appwrite.io) (BaaS)
  - Databases (NoSQL documents)
  - Authentication (email/password)
- **Appwrite Web SDK**: loaded via CDN
- **Setup script**: Node.js + `node-appwrite`

## 📱 Screenshots

The website replicates the classic Sarkari Result layout:
- Red gradient header with site title and navigation
- Tabular post listings with "NEW" badges for recent posts
- Scrolling ticker for latest updates
- Sidebar with quick links and recent posts
- Detailed post pages with structured information tables

## 🔧 Customization

- **Site name/branding**: Edit the `<title>` and `.site-title` in `src/index.html`
- **Colors**: Modify CSS variables in `src/css/style.css` (look for `#cc0000` for the primary red)
- **Categories**: Add new categories in `CATEGORIES` object in `src/js/appwrite.js` and update the navigation menus

## 📜 Disclaimer

This project is for educational purposes only. It is not affiliated with any government organization. Always verify information from official government websites.

