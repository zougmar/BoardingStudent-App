import 'dotenv/config';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { User, Student, Company, CompanyMatch, Appointment, Message, Resource } from './models';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/boarding-student';

export async function runSeed(): Promise<void> {
  const conn = await mongoose.connect(MONGODB_URI);
  const userCount = await User.countDocuments();
  if (userCount > 0) {
    console.log('Database already seeded, skipping.');
    return;
  }

  const hash1 = bcrypt.hashSync('demo123', 10);
  const hash2 = bcrypt.hashSync('demo123', 10);

  const user1 = await User.create({
    email: 'student@boarding.com',
    passwordHash: hash1,
    firstName: 'Demo',
    lastName: 'Student',
    role: 'student',
  });
  const user2 = await User.create({
    email: 'o.zouglah03@gmail.com',
    passwordHash: hash2,
    firstName: 'Omar',
    lastName: 'Zouglah',
    role: 'student',
  });

  const student1 = await Student.create({
    userId: user1._id,
    firstName: 'Demo',
    lastName: 'Student',
    email: 'student@boarding.com',
    academicBackground: { degree: 'Bachelor', field: 'Computer Science', university: 'University Example', graduationYear: 2024 },
    skills: ['React', 'TypeScript', 'Node.js'],
    interests: ['Web Development', 'AI'],
    profileCompletion: 65,
    journeyStatus: 'matching',
  });
  const student2 = await Student.create({
    userId: user2._id,
    firstName: 'Omar',
    lastName: 'Zouglah',
    email: 'o.zouglah03@gmail.com',
    academicBackground: { degree: 'Bachelor', field: 'Computer Science', university: 'University Example', graduationYear: 2024 },
    skills: ['React', 'TypeScript', 'Node.js'],
    interests: ['Web Development', 'AI'],
    profileCompletion: 65,
    journeyStatus: 'matching',
  });

  const co1 = await Company.create({
    name: 'TechCorp',
    industry: 'Technology',
    location: 'Paris, France',
    matchScore: 92,
    description: 'Leading tech company specializing in web applications',
    requirements: ['React', 'TypeScript', '3+ years experience'],
  });
  const co2 = await Company.create({
    name: 'InnovateLab',
    industry: 'Software',
    location: 'Lyon, France',
    matchScore: 85,
    description: 'Innovative software solutions for businesses',
    requirements: ['JavaScript', 'Node.js', 'Team collaboration'],
  });
  const co3 = await Company.create({
    name: 'DataFlow',
    industry: 'Data Analytics',
    location: 'Marseille, France',
    matchScore: 78,
    description: 'Data analytics and business intelligence',
    requirements: ['Python', 'SQL', 'Data visualization'],
  });

  const hashCompany = bcrypt.hashSync('demo123', 10);
  await User.create([
    { email: 'company@techcorp.com', passwordHash: hashCompany, firstName: 'TechCorp', lastName: 'Admin', role: 'company', companyId: co1._id },
    { email: 'company@innovatelab.com', passwordHash: hashCompany, firstName: 'InnovateLab', lastName: 'Admin', role: 'company', companyId: co2._id },
  ]);

  await CompanyMatch.create([
    { studentId: student1._id, companyId: co1._id, matchStatus: 'matched' },
    { studentId: student1._id, companyId: co2._id, matchStatus: 'pending' },
    { studentId: student1._id, companyId: co3._id, matchStatus: 'pending' },
    { studentId: student2._id, companyId: co1._id, matchStatus: 'pending' },
    { studentId: student2._id, companyId: co2._id, matchStatus: 'pending' },
    { studentId: student2._id, companyId: co3._id, matchStatus: 'pending' },
  ]);

  await Appointment.create({
    studentId: student1._id,
    advisorName: 'Sarah Johnson',
    advisorEmail: 'sarah.johnson@boarding.com',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    duration: 30,
    type: 'consultation',
    status: 'scheduled',
  });

  await Message.create({
    senderId: 'advisor-1',
    senderName: 'Sarah Johnson',
    recipientId: student1._id.toString(),
    recipientName: 'Demo Student',
    content: 'Hello! I noticed your profile is 65% complete. Would you like to schedule a call to discuss your career goals?',
    read: true,
  });

  await Resource.create([
    { title: 'Finding Housing in France', category: 'housing', description: 'Complete guide to finding student accommodation', content: 'Guide content here...' },
    { title: 'French Language Basics', category: 'language', description: 'Essential French phrases for daily life', content: 'Language content here...' },
  ]);

  console.log('Seed completed: users, students, companies, matches, appointments, messages, resources.');
}

if (require.main === module) {
  runSeed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
