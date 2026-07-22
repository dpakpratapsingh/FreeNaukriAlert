import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Upload a new Past Paper
router.post('/upload-paper', async (req: Request, res: Response) => {
  try {
    const { examName, year, shift, paperType, documentUrl, uploadedBy } = req.body;
    
    if (!examName || !year || !shift || !paperType || !documentUrl || !uploadedBy) {
      return res.status(400).json({ error: 'All fields are required to upload a paper.' });
    }

    const paper = await prisma.pastPaper.create({
      data: {
        examName,
        year: parseInt(year),
        shift,
        paperType,
        documentUrl,
        uploadedBy
      }
    });

    return res.status(201).json({ message: 'Paper uploaded successfully!', paper });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Engine Failure' });
  }
});

// Fetch all papers uploaded by a specific contributor (for Admin dashboard)
router.get('/contributor-papers/:name', async (req: Request, res: Response) => {
  try {
    const papers = await prisma.pastPaper.findMany({
      where: { uploadedBy: req.params.name },
      orderBy: { createdAt: 'desc' }
    });
    return res.status(200).json(papers);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Engine Failure' });
  }
});

export default router;
