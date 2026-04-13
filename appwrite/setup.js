#!/usr/bin/env node
/**
 * Appwrite Setup Script
 * Run this script once to create the database and collections in your Appwrite project.
 *
 * Prerequisites:
 *   npm install node-appwrite
 *
 * Usage:
 *   APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1 \
 *   APPWRITE_PROJECT_ID=your_project_id \
 *   APPWRITE_API_KEY=your_api_key \
 *   node appwrite/setup.js
 */

const sdk = require("node-appwrite");

const ENDPOINT = process.env.APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1";
const PROJECT_ID = process.env.APPWRITE_PROJECT_ID;
const API_KEY = process.env.APPWRITE_API_KEY;

if (!PROJECT_ID || !API_KEY) {
  console.error(
    "Error: APPWRITE_PROJECT_ID and APPWRITE_API_KEY environment variables are required."
  );
  process.exit(1);
}

const client = new sdk.Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID)
  .setKey(API_KEY);

const databases = new sdk.Databases(client);

const DATABASE_ID = "sarkari_db";
const COLLECTION_POSTS = "posts";

async function setup() {
  console.log("=== Sarkari Result Alert - Appwrite Setup ===\n");

  // 1. Create database
  try {
    await databases.create(DATABASE_ID, "SarkariResultDB");
    console.log("✔ Database created: SarkariResultDB");
  } catch (e) {
    if (e.code === 409) {
      console.log("⚠ Database already exists, skipping...");
    } else {
      throw e;
    }
  }

  // 2. Create posts collection
  try {
    await databases.createCollection(
      DATABASE_ID,
      COLLECTION_POSTS,
      "Posts",
      [
        sdk.Permission.read(sdk.Role.any()),
        sdk.Permission.create(sdk.Role.users()),
        sdk.Permission.update(sdk.Role.users()),
        sdk.Permission.delete(sdk.Role.users()),
      ]
    );
    console.log("✔ Collection created: Posts");
  } catch (e) {
    if (e.code === 409) {
      console.log("⚠ Collection already exists, skipping...");
    } else {
      throw e;
    }
  }

  // 3. Create attributes
  const attributes = [
    { method: "createStringAttribute", args: [DATABASE_ID, COLLECTION_POSTS, "title", 500, true] },
    { method: "createStringAttribute", args: [DATABASE_ID, COLLECTION_POSTS, "category", 50, true] },
    { method: "createStringAttribute", args: [DATABASE_ID, COLLECTION_POSTS, "organization", 300, true] },
    { method: "createStringAttribute", args: [DATABASE_ID, COLLECTION_POSTS, "short_info", 1000, false, ""] },
    { method: "createStringAttribute", args: [DATABASE_ID, COLLECTION_POSTS, "important_dates", 5000, false, ""] },
    { method: "createStringAttribute", args: [DATABASE_ID, COLLECTION_POSTS, "application_fee", 2000, false, ""] },
    { method: "createStringAttribute", args: [DATABASE_ID, COLLECTION_POSTS, "age_limit", 1000, false, ""] },
    { method: "createStringAttribute", args: [DATABASE_ID, COLLECTION_POSTS, "vacancy_details", 5000, false, ""] },
    { method: "createStringAttribute", args: [DATABASE_ID, COLLECTION_POSTS, "important_links", 5000, false, ""] },
    { method: "createStringAttribute", args: [DATABASE_ID, COLLECTION_POSTS, "post_date", 20, false, ""] },
    { method: "createStringAttribute", args: [DATABASE_ID, COLLECTION_POSTS, "last_date", 20, false, ""] },
    { method: "createBooleanAttribute", args: [DATABASE_ID, COLLECTION_POSTS, "is_new", false, false] },
    { method: "createStringAttribute", args: [DATABASE_ID, COLLECTION_POSTS, "status", 20, false, "active"] },
  ];

  for (const attr of attributes) {
    try {
      await databases[attr.method](...attr.args);
      console.log(`✔ Attribute created: ${attr.args[2]}`);
    } catch (e) {
      if (e.code === 409) {
        console.log(`⚠ Attribute already exists: ${attr.args[2]}, skipping...`);
      } else {
        console.error(`✖ Failed to create attribute ${attr.args[2]}:`, e.message);
      }
    }
    // Wait for attribute to be available
    await new Promise((r) => setTimeout(r, 500));
  }

  // 4. Create indexes (wait for attributes to be ready)
  console.log("\nWaiting for attributes to be available...");
  await new Promise((r) => setTimeout(r, 3000));

  const indexes = [
    { key: "category_index", type: "key", attributes: ["category"], orders: ["ASC"] },
    { key: "status_index", type: "key", attributes: ["status"], orders: ["ASC"] },
  ];

  for (const idx of indexes) {
    try {
      await databases.createIndex(
        DATABASE_ID,
        COLLECTION_POSTS,
        idx.key,
        idx.type,
        idx.attributes,
        idx.orders
      );
      console.log(`✔ Index created: ${idx.key}`);
    } catch (e) {
      if (e.code === 409) {
        console.log(`⚠ Index already exists: ${idx.key}, skipping...`);
      } else {
        console.error(`✖ Failed to create index ${idx.key}:`, e.message);
      }
    }
  }

  // 5. Create sample posts
  console.log("\nCreating sample posts...");
  await new Promise((r) => setTimeout(r, 2000));

  const samplePosts = [
    {
      title: "SSC CGL 2024 Combined Graduate Level Recruitment",
      category: "latest_jobs",
      organization: "Staff Selection Commission (SSC)",
      short_info: "SSC CGL 2024 recruitment notification for various Group B and Group C posts. Online applications invited from eligible candidates.",
      post_date: "01/04/2024",
      last_date: "30/04/2024",
      is_new: true,
      status: "active",
      important_dates: JSON.stringify({
        "Application Begin": "01/04/2024",
        "Last Date for Apply Online": "30/04/2024",
        "Fee Payment Last Date": "30/04/2024",
        "Tier-I Exam Date": "June-July 2024",
        "Admit Card Available": "10 Days Before Exam",
      }),
      application_fee: JSON.stringify({
        "General / OBC / EWS": "Rs. 100/-",
        "SC / ST": "No Fee",
        "PH (Divyang)": "No Fee",
        "Female All Category": "No Fee",
        "Payment Mode": "Online (Debit Card / Credit Card / Net Banking)",
      }),
      age_limit: JSON.stringify({
        "Minimum Age": "18 Years",
        "Maximum Age": "30 Years (Post Wise)",
        "Age Relaxation": "As per Govt. Rules",
        "Age as on": "01/01/2024",
      }),
      vacancy_details: JSON.stringify({
        "Total Vacancies": "17727",
        "Group B (Gazetted)": "690",
        "Group B (Non-Gazetted)": "1411",
        "Group C": "15626",
      }),
      important_links: JSON.stringify({
        "Apply Online": "https://ssc.nic.in",
        "Download Notification": "https://ssc.nic.in",
        "Official Website": "https://ssc.nic.in",
      }),
    },
    {
      title: "UPSC Civil Services Prelims 2024 Result Declared",
      category: "latest_results",
      organization: "Union Public Service Commission (UPSC)",
      short_info: "UPSC Civil Services Preliminary Examination 2024 result has been declared. Candidates who qualified can check their result on the official website.",
      post_date: "15/06/2024",
      last_date: "",
      is_new: true,
      status: "active",
      important_dates: JSON.stringify({
        "Prelims Exam Date": "26/05/2024",
        "Result Declared": "15/06/2024",
        "Mains Exam Date": "20/09/2024",
      }),
      important_links: JSON.stringify({
        "Check Result": "https://upsc.gov.in",
        "Official Website": "https://upsc.gov.in",
      }),
    },
    {
      title: "Railway RRB NTPC 2024 Admit Card Released",
      category: "admit_card",
      organization: "Railway Recruitment Board (RRB)",
      short_info: "RRB NTPC 2024 admit card has been released. Candidates can download their hall ticket from the official RRB regional websites.",
      post_date: "10/05/2024",
      last_date: "",
      is_new: true,
      status: "active",
      important_dates: JSON.stringify({
        "Admit Card Release Date": "10/05/2024",
        "CBT 1 Exam Date": "20/05/2024 Onwards",
      }),
      important_links: JSON.stringify({
        "Download Admit Card": "https://indianrailways.gov.in",
        "Official Website": "https://indianrailways.gov.in",
      }),
    },
    {
      title: "SSC MTS 2024 Answer Key Released",
      category: "answer_key",
      organization: "Staff Selection Commission (SSC)",
      short_info: "SSC MTS 2024 Paper 1 answer key has been released. Candidates can check and raise objections if any.",
      post_date: "05/05/2024",
      last_date: "12/05/2024",
      is_new: false,
      status: "active",
      important_dates: JSON.stringify({
        "Answer Key Released": "05/05/2024",
        "Objection Last Date": "12/05/2024",
      }),
      important_links: JSON.stringify({
        "Check Answer Key": "https://ssc.nic.in",
        "Official Website": "https://ssc.nic.in",
      }),
    },
    {
      title: "UPSC IAS 2024 Syllabus & Exam Pattern",
      category: "syllabus",
      organization: "Union Public Service Commission (UPSC)",
      short_info: "Complete syllabus and exam pattern for UPSC IAS (Civil Services) Examination 2024 including Prelims and Mains.",
      post_date: "01/01/2024",
      last_date: "",
      is_new: false,
      status: "active",
      important_links: JSON.stringify({
        "Download Syllabus PDF": "https://upsc.gov.in",
        "Official Website": "https://upsc.gov.in",
      }),
    },
  ];

  for (const post of samplePosts) {
    try {
      await databases.createDocument(DATABASE_ID, COLLECTION_POSTS, sdk.ID.unique(), post);
      console.log(`✔ Sample post created: ${post.title.substring(0, 50)}...`);
    } catch (e) {
      console.error(`✖ Failed to create sample post:`, e.message);
    }
    await new Promise((r) => setTimeout(r, 300));
  }

  console.log("\n=== Setup Complete! ===");
  console.log("Your Appwrite database is ready.");
  console.log("\nNext steps:");
  console.log("1. Update APPWRITE_PROJECT_ID in src/js/appwrite.js");
  console.log("2. Open src/index.html in a browser (or serve via a web server)");
  console.log("3. Login to admin panel at src/admin/index.html with your Appwrite credentials");
}

setup().catch((err) => {
  console.error("\n✖ Setup failed:", err.message);
  process.exit(1);
});
