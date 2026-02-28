import { Router } from 'express';
import { Message, Student } from '../models';
import { requireAuth } from '../auth';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const payload = requireAuth(req);
    const student = await Student.findOne({ userId: payload.userId });
    if (!student) {
      res.status(404).json({ error: 'Student profile not found' });
      return;
    }
    const sid = student._id.toString();
    const list = await Message.find({
      $or: [{ recipientId: sid }, { senderId: sid }],
    }).sort({ createdAt: 1 });
    res.json(list.map((m: any) => ({
      id: m._id.toString(),
      senderId: m.senderId,
      senderName: m.senderName,
      recipientId: m.recipientId,
      recipientName: m.recipientName,
      content: m.content,
      timestamp: m.createdAt,
      read: Boolean(m.read),
    })));
  } catch (e) {
    next(e);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const payload = requireAuth(req);
    const { recipientId, recipientName, content } = req.body;
    if (!content || !recipientId || !recipientName) {
      res.status(400).json({ error: 'recipientId, recipientName, content required' });
      return;
    }
    const student = await Student.findOne({ userId: payload.userId });
    if (!student) {
      res.status(404).json({ error: 'Student profile not found' });
      return;
    }
    const senderName = `${student.firstName} ${student.lastName}`;
    const msg = await Message.create({
      senderId: student._id.toString(),
      senderName,
      recipientId,
      recipientName,
      content,
      read: false,
    });
    res.status(201).json({
      id: msg._id.toString(),
      senderId: msg.senderId,
      senderName: msg.senderName,
      recipientId: msg.recipientId,
      recipientName: msg.recipientName,
      content: msg.content,
      timestamp: msg.createdAt,
      read: false,
    });
  } catch (e) {
    next(e);
  }
});

export default router;
