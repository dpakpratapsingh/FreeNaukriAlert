import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Submit 100-Question Check
router.post('/submit', async (req: Request, res: Response) => {
  try {
    const { studentEmail, answers } = req.body;

    if (!studentEmail || !answers) {
      return res.status(400).json({ error: 'Missing assessment data' });
    }

    const student = await prisma.student.findUnique({ where: { email: studentEmail } });
    if (!student) {
      return res.status(404).json({ error: 'Student not found.' });
    }

    // Calculate score (strict logic: correct / total)
    const totalQuestions = answers.length;
    const correctAnswers = answers.filter((a: any) => a.isCorrect).length;
    const rawScore = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

    // Persist Assessment History in Postgres
    await prisma.assessment.create({
      data: {
        score: rawScore,
        studentId: student.id
      }
    });

    // Update the student's global Activity Score Percentage
    // Also, promote to Contributor if score is high enough!
    const newRole = rawScore >= 95 ? 'Contributor' : student.role;

    await prisma.student.update({
      where: { id: student.id },
      data: { 
        activityScore: rawScore,
        role: newRole
      }
    });

    return res.status(200).json({ 
      message: 'Assessment Processed.', 
      score: rawScore,
      role: newRole
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Engine Failure during Assessment' });
  }
});

export default router;
