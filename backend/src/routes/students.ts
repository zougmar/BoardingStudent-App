import { Router } from 'express';
import path from 'path';
import multer from 'multer';
import fs from 'fs';
import { Student } from '../models';
import { requireAuth } from '../auth';

const router = Router();

function studentToApi(doc: any) {
  const s = doc.toObject ? doc.toObject() : doc;
  return {
    id: s._id?.toString() ?? s.id,
    firstName: s.firstName,
    lastName: s.lastName,
    email: s.email,
    phone: s.phone ?? undefined,
    avatarUrl: s.avatarUrl ?? undefined,
    academicBackground: s.academicBackground ?? { degree: '', field: '', university: '', graduationYear: undefined },
    skills: s.skills ?? [],
    interests: s.interests ?? [],
    profileCompletion: s.profileCompletion ?? 0,
    cvUrl: s.cvUrl ?? undefined,
    journeyStatus: s.journeyStatus || 'profile',
  };
}

router.get('/me', async (req, res, next) => {
  try {
    const payload = requireAuth(req);
    const student = await Student.findOne({ userId: payload.userId });
    if (!student) {
      res.status(404).json({ error: 'Student profile not found' });
      return;
    }
    res.json(studentToApi(student));
  } catch (e) {
    next(e);
  }
});

router.patch('/me', async (req, res, next) => {
  try {
    const payload = requireAuth(req);
    const student = await Student.findOne({ userId: payload.userId });
    if (!student) {
      res.status(404).json({ error: 'Student profile not found' });
      return;
    }
    const u = req.body;
    if (u.firstName !== undefined) student.firstName = u.firstName;
    if (u.lastName !== undefined) student.lastName = u.lastName;
    if (u.email !== undefined) student.email = u.email;
    if (u.phone !== undefined) student.phone = u.phone;
    if (u.avatarUrl !== undefined) student.avatarUrl = u.avatarUrl;
    if (u.academicBackground !== undefined) student.academicBackground = { ...student.academicBackground, ...u.academicBackground };
    if (u.skills !== undefined) student.skills = Array.isArray(u.skills) ? u.skills : [];
    if (u.interests !== undefined) student.interests = Array.isArray(u.interests) ? u.interests : [];
    if (u.cvUrl !== undefined) student.cvUrl = u.cvUrl;
    if (u.journeyStatus !== undefined) student.journeyStatus = u.journeyStatus;

    let completion = 0;
    if (student.firstName && student.lastName) completion += 10;
    if (student.email) completion += 10;
    const ac = student.academicBackground || {};
    if (ac.degree && ac.field) completion += 20;
    if (ac.university) completion += 10;
    if ((student.skills?.length ?? 0) > 0) completion += 15;
    if ((student.interests?.length ?? 0) > 0) completion += 10;
    if (student.cvUrl) completion += 25;
    student.profileCompletion = Math.min(100, completion);
    await student.save();
    res.json(studentToApi(student));
  } catch (e) {
    next(e);
  }
});

const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => cb(null, `cv-${Date.now()}-${file.originalname || 'file.pdf'}`),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.post('/me/cv', upload.single('cv'), async (req, res, next) => {
  try {
    const payload = requireAuth(req);
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }
    const student = await Student.findOne({ userId: payload.userId });
    if (!student) {
      res.status(404).json({ error: 'Student profile not found' });
      return;
    }
    const baseUrl = process.env.API_URL || 'http://localhost:3001';
    const cvUrl = `${baseUrl}/uploads/${req.file.filename}`;
    student.cvUrl = cvUrl;
    let completion = 0;
    if (student.firstName && student.lastName) completion += 10;
    if (student.email) completion += 10;
    const ac = student.academicBackground || {};
    if (ac.degree && ac.field) completion += 20;
    if (ac.university) completion += 10;
    if ((student.skills?.length ?? 0) > 0) completion += 15;
    if ((student.interests?.length ?? 0) > 0) completion += 10;
    completion += 25;
    student.profileCompletion = Math.min(100, completion);
    await student.save();
    res.json({ cvUrl });
  } catch (e) {
    next(e);
  }
});

export default router;
