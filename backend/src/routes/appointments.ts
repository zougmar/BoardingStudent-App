import { Router } from 'express';
import { Appointment, Student } from '../models';
import { requireAuth } from '../auth';

const router = Router();

function toApi(doc: any) {
  const d = doc.toObject ? doc.toObject() : doc;
  return {
    id: d._id?.toString() ?? d.id,
    advisorName: d.advisorName,
    advisorEmail: d.advisorEmail,
    date: d.date,
    duration: d.duration,
    type: d.type,
    status: d.status,
    notes: d.notes ?? undefined,
  };
}

router.get('/', async (req, res, next) => {
  try {
    const payload = requireAuth(req);
    const student = await Student.findOne({ userId: payload.userId });
    if (!student) {
      res.status(404).json({ error: 'Student profile not found' });
      return;
    }
    const list = await Appointment.find({ studentId: student._id }).sort({ date: 1 });
    res.json(list.map(toApi));
  } catch (e) {
    next(e);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const payload = requireAuth(req);
    const { advisorName, advisorEmail, date, duration, type, notes } = req.body;
    if (!advisorName || !advisorEmail || !date || !duration || !type) {
      res.status(400).json({ error: 'advisorName, advisorEmail, date, duration, type required' });
      return;
    }
    const student = await Student.findOne({ userId: payload.userId });
    if (!student) {
      res.status(404).json({ error: 'Student profile not found' });
      return;
    }
    const apt = await Appointment.create({
      studentId: student._id,
      advisorName,
      advisorEmail,
      date: new Date(date),
      duration: Number(duration),
      type,
      status: 'scheduled',
      notes: notes || undefined,
    });
    res.status(201).json(toApi(apt));
  } catch (e) {
    next(e);
  }
});

export default router;
