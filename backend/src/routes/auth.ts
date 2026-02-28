import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { User, Student } from '../models';
import { signToken, requireAuth } from '../auth';

const router = Router();

router.post('/login', async (req, res, next) => {
  try {
    const { email, password, accountType } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password required' });
      return;
    }
    const user = await User.findOne({ email: email.trim().toLowerCase() }).populate('companyId', 'name');
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }
    const valid = bcrypt.compareSync(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }
    const requestedRole = accountType === 'company' ? 'company' : 'student';
    const userRole = user.role || 'student';
    if (userRole !== requestedRole) {
      res.status(401).json({
        error: requestedRole === 'company'
          ? 'No company account found with this email. Use student login or contact support.'
          : 'This email is registered as a company account. Use company login instead.',
      });
      return;
    }
    const token = signToken({ userId: user._id.toString(), email: user.email });
    const company = user.companyId as any;
    res.json({
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        companyId: user.companyId ? (user.companyId as any)._id?.toString() : undefined,
        companyName: company?.name,
      },
    });
  } catch (e) {
    next(e);
  }
});

router.post('/register', async (req, res, next) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    const e = (email || '').trim().toLowerCase();
    const pwd = (password || '').trim();
    const first = (firstName || '').trim();
    const last = (lastName || '').trim();
    if (!e || !pwd || !first || !last) {
      res.status(400).json({ error: 'Email, password, first name and last name required' });
      return;
    }
    if (pwd.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters' });
      return;
    }
    const existing = await User.findOne({ email: e });
    if (existing) {
      res.status(409).json({ error: 'An account with this email already exists' });
      return;
    }
    const passwordHash = bcrypt.hashSync(pwd, 10);
    const user = await User.create({ email: e, passwordHash, firstName: first, lastName: last, role: 'student' });
    await Student.create({
      userId: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      academicBackground: {},
      skills: [],
      interests: [],
      profileCompletion: 0,
      journeyStatus: 'profile',
    });
    const token = signToken({ userId: user._id.toString(), email: user.email });
    res.status(201).json({
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: 'student',
      },
    });
  } catch (e) {
    next(e);
  }
});

router.get('/me', async (req, res, next) => {
  try {
    const payload = requireAuth(req);
    const user = await User.findById(payload.userId).select('email firstName lastName role companyId').populate('companyId', 'name');
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    const company = user.companyId as any;
    res.json({
      id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      companyId: user.companyId ? (user.companyId as any)._id?.toString() : undefined,
      companyName: company?.name,
    });
  } catch (e) {
    next(e);
  }
});

export default router;
