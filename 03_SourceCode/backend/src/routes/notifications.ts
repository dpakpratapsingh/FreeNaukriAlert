import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Fetch notifications for a specific student
router.get('/:email', async (req: Request, res: Response) => {
  try {
    const student = await prisma.student.findUnique({ where: { email: req.params.email } });
    if (!student) return res.status(404).json({ error: 'Student not found.' });

    const notifications = await prisma.notification.findMany({
      where: { studentId: student.id },
      include: { jobAlert: true },
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json(notifications);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Engine Failure' });
  }
});

// Mark notification as read
router.put('/:id/read', async (req: Request, res: Response) => {
  try {
    const notification = await prisma.notification.update({
      where: { id: req.params.id },
      data: { isRead: true }
    });
    return res.status(200).json(notification);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Engine Failure' });
  }
});

export default router;
