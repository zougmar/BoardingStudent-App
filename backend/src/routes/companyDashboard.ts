import { Router, Request } from 'express';
import { User, CompanyMatch } from '../models';
import { requireAuth } from '../auth';

const router = Router();

// GET /api/company/matched-students - list students matched with this company
router.get('/matched-students', async (req, res, next) => {
  try {
    const payload = requireAuth(req);
    const user = await User.findById(payload.userId).select('role companyId');
    if (!user || user.role !== 'company' || !user.companyId) {
      res.status(403).json({ error: 'Company account required' });
      return;
    }
    const companyId = user.companyId;
    const matches = await CompanyMatch.find({ companyId })
      .populate('studentId')
      .sort({ updatedAt: -1 });
    const list = matches.map((m: any) => {
      const s = m.studentId;
      if (!s) return null;
      return {
        matchId: m._id.toString(),
        matchStatus: m.matchStatus,
        updatedAt: m.updatedAt,
        student: {
          id: s._id.toString(),
          firstName: s.firstName,
          lastName: s.lastName,
          email: s.email,
          phone: s.phone,
          academicBackground: s.academicBackground || {},
          skills: s.skills || [],
          interests: s.interests || [],
          profileCompletion: s.profileCompletion ?? 0,
          cvUrl: s.cvUrl,
          journeyStatus: s.journeyStatus,
        },
      };
    }).filter(Boolean);
    res.json(list);
  } catch (e) {
    next(e);
  }
});

// PATCH /api/company/matches/:matchId/status - update match status
router.patch('/matches/:matchId/status', async (req, res, next) => {
  try {
    const payload = requireAuth(req);
    const user = await User.findById(payload.userId).select('role companyId');
    if (!user || user.role !== 'company' || !user.companyId) {
      res.status(403).json({ error: 'Company account required' });
      return;
    }
    const { matchId } = req.params;
    const { status } = req.body;
    if (!['pending', 'matched', 'rejected', 'accepted'].includes(status)) {
      res.status(400).json({ error: 'Invalid status' });
      return;
    }
    const match = await CompanyMatch.findOne({
      _id: matchId,
      companyId: user.companyId,
    });
    if (!match) {
      res.status(404).json({ error: 'Match not found' });
      return;
    }
    match.matchStatus = status;
    await match.save();
    res.status(204).send();
  } catch (e) {
    next(e);
  }
});

export default router;
