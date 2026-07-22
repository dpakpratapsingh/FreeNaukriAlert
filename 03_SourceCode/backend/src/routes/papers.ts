import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Fetch all public past papers
router.get('/', async (req: Request, res: Response) => {
  try {
    // Optional filtering
    const { examName, year, shift } = req.query;
    const filter: any = {};
    if (examName) filter.examName = { contains: examName, mode: 'insensitive' };
    if (year) filter.year = parseInt(year as string);
    if (shift) filter.shift = shift;

    const papers = await prisma.pastPaper.findMany({
      where: filter,
      orderBy: { createdAt: 'desc' }
    });
    return res.status(200).json(papers);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Engine Failure' });
  }
});

export default router;
