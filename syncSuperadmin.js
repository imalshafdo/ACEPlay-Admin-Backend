import mongoose from 'mongoose';
import Admin from './models/Admin.js';
import dotenv from 'dotenv';

dotenv.config();

async function run() {
  const uri = process.env.MONGO_URI;
  const emails = (process.env.SUPERADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  const password = process.env.superadmin_password;

  if (!uri) {
    console.error('❌ MONGO_URI is missing in .env');
    process.exit(1);
  }

  if (emails.length === 0) {
    console.error('❌ SUPERADMIN_EMAILS is missing in .env');
    process.exit(1);
  }

  if (!password) {
    console.error('❌ superadmin_password is blank in .env. Please write a password there first.');
    process.exit(1);
  }

  console.log('🔌 Connecting to MongoDB...');
  await mongoose.connect(uri);

  for (const email of emails) {
    let admin = await Admin.findOne({ email });
    if (admin) {
      admin.password = password;
      admin.requiresPasswordChange = false;
      // Also ensure superadmins are configured with 2FA status or reset if desired.
      await admin.save();
      console.log(`✅ Updated password in database for superadmin: ${email}`);
    } else {
      admin = await Admin.create({
        name: 'Super Admin',
        email,
        password,
        role: 'superadmin',
        requiresPasswordChange: false,
      });
      console.log(`✅ Created new superadmin account in database: ${email}`);
    }
  }

  await mongoose.disconnect();
  console.log('🔌 Disconnected from MongoDB. Sync complete!');
}

run().catch(console.error);
