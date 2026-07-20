import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const router = Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'fna_super_secret_jwt_key';

// Register a new Student and create JWT token
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, education, targetJob } = req.body;
    
    if (!name || !email || !education || !targetJob) {
      return res.status(400).json({ error: 'All fields are required for the Journey Loop' });
    }

    // Check if student exists
    let student = await prisma.student.findUnique({ where: { email } });
    
    if (!student) {
      student = await prisma.student.create({
        data: { name, email, education, targetJob }
      });
    }

    // Generate token
    const token = jwt.sign({ studentId: student.id, email: student.email }, JWT_SECRET, { expiresIn: '7d' });

    return res.status(200).json({ student, token, message: 'Onboarding complete.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Engine Failure' });
  }
});

// Fetch Student Profile (Used by Dashboard)
router.get('/profile/:email', async (req: Request, res: Response) => {
  try {
    const student = await prisma.student.findUnique({
      where: { email: req.params.email },
      include: { assessments: true } // Bring in their assessment history
    });

    if (!student) return res.status(404).json({ error: 'Student not found in the loop.' });

    return res.status(200).json(student);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Engine Failure' });
  }
});

export default router;
