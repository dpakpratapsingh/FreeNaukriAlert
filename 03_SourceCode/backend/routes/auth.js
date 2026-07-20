const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const dbPath = path.join(__dirname, '../data/db.json');

// Utility to read/write DB
const readDB = () => JSON.parse(fs.readFileSync(dbPath, 'utf8'));
const writeDB = (data) => fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

// Onboarding: Manual Registration to know Student Requirement
router.post('/register', (req, res) => {
  const { name, email, education, targetJob, choices } = req.body;
  
  if (!name || !email || !education || !targetJob) {
    return res.status(400).json({ error: 'Eligibility data missing. Information must be provided.' });
  }

  const db = readDB();
  
  // Check if student exists
  if (db.students.find(s => s.email === email)) {
    return res.status(400).json({ error: 'Student already in the journey loop.' });
  }

  const newStudent = {
    id: Date.now().toString(),
    name,
    email,
    education,
    targetJob,
    choices: choices || [],
    activityScore: 0,
    role: 'Student', // Can upgrade to Contributor/Employer
    createdAt: new Date().toISOString()
  };

  db.students.push(newStudent);
  writeDB(db);

  // Strictly judging eligibility based on education and target job
  res.status(201).json({
    message: 'Onboarding successful. Eligibility judged.',
    student: newStudent
  });
});

// Fetch Student Profile
router.get('/profile/:email', (req, res) => {
  const db = readDB();
  const student = db.students.find(s => s.email === req.params.email);
  if (!student) return res.status(404).json({ error: 'Student not found.' });
  res.json(student);
});

module.exports = router;
