import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// The Education Hierarchy
const EDUCATION_LEVELS: { [key: string]: number } = {
  '10th': 1,
  '12th': 2,
  'Graduate': 3,
  'Post-Graduate': 4
};

// Post a new Job Alert (Admin/Contributor)
router.post('/post', async (req: Request, res: Response) => {
  try {
    const { title, department, requiredEducation, deadline, applyUrl } = req.body;
    
    if (!title || !department || !requiredEducation || !deadline || !applyUrl) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // 1. Create the Job Alert
    const jobAlert = await prisma.jobAlert.create({
      data: {
        title,
        department,
        requiredEducation,
        deadline: new Date(deadline),
        applyUrl
      }
    });

    // 2. The Matching Engine: Find Eligible Students
    const requiredLevel = EDUCATION_LEVELS[requiredEducation] || 0;
    
    // Fetch all students
    const allStudents = await prisma.student.findMany();
    
    const matchedStudents = allStudents.filter(student => {
      const studentLevel = EDUCATION_LEVELS[student.education] || 0;
      
      // Cascading logic: Student must have EQUAL OR HIGHER education
      const meetsEducation = studentLevel >= requiredLevel;
      
      // Target Job logic: Basic overlap match or broadcast to everyone if they just want "Government Jobs"
      const target = student.targetJob.toLowerCase();
      const dept = department.toLowerCase();
      const matchesTarget = target.includes(dept) || dept.includes(target) || target.includes('govt') || target.includes('any');
                            
      return meetsEducation && matchesTarget;
    });

    // 3. Create Notifications in Bulk
    if (matchedStudents.length > 0) {
      await prisma.notification.createMany({
        data: matchedStudents.map(student => ({
          studentId: student.id,
          jobAlertId: jobAlert.id
        }))
      });
    }

    return res.status(201).json({ 
      message: 'Job Posted and Alerts Sent!', 
      jobAlert, 
      notificationsSent: matchedStudents.length 
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Engine Failure' });
  }
});

// Fetch all public jobs
router.get('/', async (req: Request, res: Response) => {
  try {
    const jobs = await prisma.jobAlert.findMany({ orderBy: { createdAt: 'desc' } });
    return res.status(200).json(jobs);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Engine Failure' });
  }
});

export default router;
