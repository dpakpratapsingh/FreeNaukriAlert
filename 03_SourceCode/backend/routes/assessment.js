const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const dbPath = path.join(__dirname, '../data/db.json');
const readDB = () => JSON.parse(fs.readFileSync(dbPath, 'utf8'));
const writeDB = (data) => fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

// The 100-Question Check Logic
router.post('/submit', (req, res) => {
  const { studentEmail, answers } = req.body;
  
  if (!answers || !Array.isArray(answers) || answers.length > 100) {
    return res.status(400).json({ error: 'Assessment must not exceed the 100 question limit.' });
  }

  const db = readDB();
  const studentIndex = db.students.findIndex(s => s.email === studentEmail);
  
  if (studentIndex === -1) {
    return res.status(404).json({ error: 'Student not found.' });
  }

  // ALGORITHM: Calculate Activity Percentage
  // 1. Syllabus Checked by 5 most repetitive questions
  // 2. Examiner Thought Process Check for remaining
  // *Mocking the calculation for now*
  const totalQuestions = answers.length;
  const correctAnswers = answers.filter(a => a.isCorrect).length;
  const activityScore = Math.round((correctAnswers / totalQuestions) * 100) || 0;

  // Update Student Score
  db.students[studentIndex].activityScore = activityScore;
  
  // Upgrade Role logic if score is exceptionally high
  if (activityScore >= 95) {
    db.students[studentIndex].role = 'Contributor'; // The manifestation goal
  }

  const assessmentRecord = {
    id: Date.now().toString(),
    studentEmail,
    score: activityScore,
    timestamp: new Date().toISOString()
  };

  db.assessments.push(assessmentRecord);
  writeDB(db);

  res.json({
    message: 'Assessment Evaluated. No emotional bias applied.',
    activityScore,
    role: db.students[studentIndex].role
  });
});

module.exports = router;
