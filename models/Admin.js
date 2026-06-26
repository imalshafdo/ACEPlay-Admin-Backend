import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6, select: false },
  role: {
    type: String,
    enum: ['client', 'superadmin'],
    default: 'client',
  },
  phone: { type: String, default: '', trim: true },
  twoFactorSecret: { type: String, default: null, select: false },
  tempTwoFactorSecret: { type: String, default: null, select: false },
  smsCode: { type: String, default: null, select: false },
  smsCodeExpires: { type: Date, default: null, select: false },
  isTwoFactorEnabled: { type: Boolean, default: false },
  requiresPasswordChange: { type: Boolean, default: true },
}, { timestamps: true });

adminSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

adminSchema.methods.matchPassword = function matchPassword(entered) {
  return bcrypt.compare(entered, this.password);
};

const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);
export default Admin;