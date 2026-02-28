import 'dotenv/config';
import express from 'express';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import { connectDb } from './db';
import { User, Student } from './models';
import { errorHandler } from './middleware';
import authRoutes from './routes/auth';
import studentsRoutes from './routes/students';
import companiesRoutes from './routes/companies';
import appointmentsRoutes from './routes/appointments';
import messagesRoutes from './routes/messages';
import resourcesRoutes from './routes/resources';

const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

async function main() {
  await connectDb();

  const userCount = await User.countDocuments();
  if (userCount === 0) {
    console.log('No users found, running seed...');
    const { runSeed } = await import('./seed');
    await runSeed();
  }

  const app = express();
  const port = process.env.PORT || 3001;
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

  app.use(cors({ origin: frontendUrl, credentials: true }));
  app.use(express.json());

  app.use('/api/auth', authRoutes);
  app.use('/api/students', studentsRoutes);
  app.use('/api/companies', companiesRoutes);
  app.use('/api/appointments', appointmentsRoutes);
  app.use('/api/messages', messagesRoutes);
  app.use('/api/resources', resourcesRoutes);

  app.use('/uploads', express.static(uploadsDir));

  app.get('/api/health', (_req, res) => res.json({ ok: true }));

  app.use(errorHandler);

  app.listen(port, () => {
    console.log(`Boarding Student API running at http://localhost:${port}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
