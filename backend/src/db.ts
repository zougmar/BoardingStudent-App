import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/boarding-student';

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/boarding-student';

export async function connectDb(): Promise<void> {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected');
  } catch (err: any) {
    if (err.code === 8000 || err.message?.includes('authentication failed')) {
      console.error('\n❌ MongoDB Atlas authentication failed. Check:\n' +
        '  1. Username and password in MONGODB_URI are correct (Atlas → Database Access).\n' +
        '  2. If the password has special characters (@ # : / ? etc.), URL-encode it in .env.\n' +
        '     Example: password "p@ss#123" → p%40ss%23123\n' +
        '  3. Database user has "Read and write to any database" (or at least to this DB).\n');
    }
    throw err;
  }
}

export async function disconnectDb(): Promise<void> {
  await mongoose.disconnect();
}
