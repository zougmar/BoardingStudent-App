import { Router } from 'express';
import { Company, CompanyMatch, Student } from '../models';
import { requireAuth } from '../auth';

const router = Router();

router.get('/matches', async (req, res, next) => {
  try {
    const payload = requireAuth(req);
    const student = await Student.findOne({ userId: payload.userId });
    if (!student) {
      res.status(404).json({ error: 'Student profile not found' });
      return;
    }
    const companies = await Company.find();
    const matches = await CompanyMatch.find({ studentId: student._id });
    const matchMap = new Map(matches.map(m => [m.companyId.toString(), m.matchStatus]));
    const list = companies.map(c => ({
      id: c._id.toString(),
      name: c.name,
      industry: c.industry,
      location: c.location,
      logo: c.logo ?? undefined,
      matchScore: c.matchScore,
      matchStatus: matchMap.get(c._id.toString()) || 'pending',
      description: c.description,
      requirements: c.requirements ?? [],
    }));
    res.json(list);
  } catch (e) {
    next(e);
  }
});

router.patch('/:id/match-status', async (req, res, next) => {
  try {
    const payload = requireAuth(req);
    const { id: companyId } = req.params;
    const { status } = req.body;
    if (!['pending', 'matched', 'rejected', 'accepted'].includes(status)) {
      res.status(400).json({ error: 'Invalid status' });
      return;
    }
    const student = await Student.findOne({ userId: payload.userId });
    if (!student) {
      res.status(404).json({ error: 'Student profile not found' });
      return;
    }
    const existing = await CompanyMatch.findOne({
      studentId: student._id,
      companyId,
    });
    if (existing) {
      existing.matchStatus = status;
      await existing.save();
    } else {
      await CompanyMatch.create({
        studentId: student._id,
        companyId,
        matchStatus: status,
      });
    }
    res.status(204).send();
  } catch (e) {
    next(e);
  }
});

export default router;
