import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import asyncHandler from '../utils/asyncHandler.js';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || 'dev-secret-change-me', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const resolveRole = (email) => {
  const superadminEmails = (process.env.SUPERADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  if (superadminEmails.includes(email.toLowerCase())) return 'superadmin';
  return 'client';
};

const adminPayload = (admin, token) => ({
  _id: admin._id,
  name: admin.name,
  email: admin.email,
  role: admin.role || 'client',
  isTwoFactorEnabled: admin.isTwoFactorEnabled || false,
  token,
});

export const register = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !phone || !password) {
    return res.status(400).json({ success: false, message: 'Name, email, phone, and password are required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
  }

  const exists = await Admin.findOne({ email });
  if (exists) {
    return res.status(400).json({ success: false, message: 'Email already registered' });
  }

  const role = resolveRole(email);

  // Generate 2FA Secret (base32)
  const secret = speakeasy.generateSecret({
    name: `ACEPlay:${email}`,
  });

  // Generate simulated SMS code (6 digits)
  const smsCode = Math.floor(100000 + Math.random() * 900000).toString();
  const smsCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // Expires in 10 minutes

  const admin = await Admin.create({
    name,
    email,
    phone,
    password,
    role,
    tempTwoFactorSecret: secret.base32,
    smsCode,
    smsCodeExpires,
    isTwoFactorEnabled: false
  });

  const qrCodeDataURL = await QRCode.toDataURL(secret.otpauth_url);

  // Print simulated SMS to terminal console
  console.log(`\n========================================\n[SMS Simulation] Sending 2FA setup code to ${phone}:\nCode: ${smsCode}\n========================================\n`);

  res.status(201).json({
    success: true,
    requireSetup: true,
    data: {
      userId: admin._id,
      email: admin.email,
      phone: admin.phone,
      qrCode: qrCodeDataURL,
      secret: secret.base32,
      smsCode: smsCode // Send to frontend for simulated Dev Mode UI testing
    }
  });
});

export const verifyRegister2FA = asyncHandler(async (req, res) => {
  const { userId, token } = req.body;
  if (!userId || !token) {
    return res.status(400).json({ success: false, message: 'User ID and verification token are required' });
  }

  // Explicitly select tempTwoFactorSecret, smsCode, and smsCodeExpires as they are select: false in schema
  const admin = await Admin.findById(userId).select('+twoFactorSecret +tempTwoFactorSecret +smsCode +smsCodeExpires');
  if (!admin) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  let verified = false;

  // 1. Try to verify via TOTP using the temporary secret
  if (admin.tempTwoFactorSecret) {
    verified = speakeasy.totp.verify({
      secret: admin.tempTwoFactorSecret,
      encoding: 'base32',
      token: token.trim(),
    });
  }

  // 2. Try to verify via simulated SMS code
  if (!verified && admin.smsCode && admin.smsCodeExpires) {
    if (admin.smsCode === token.trim() && new Date() < admin.smsCodeExpires) {
      verified = true;
    }
  }

  if (!verified) {
    return res.status(400).json({ success: false, message: 'Invalid or expired 2FA token/SMS code' });
  }

  // Move temporary 2FA secret to active 2FA secret and complete registration
  admin.twoFactorSecret = admin.tempTwoFactorSecret;
  admin.tempTwoFactorSecret = null;
  admin.smsCode = null;
  admin.smsCodeExpires = null;
  admin.isTwoFactorEnabled = true;
  admin.requiresPasswordChange = false;
  await admin.save();

  const jwtToken = signToken(admin._id);

  res.json({
    success: true,
    message: '2FA enabled successfully. Registration complete!',
    data: adminPayload(admin, jwtToken),
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password, twoFactorToken } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  const admin = await Admin.findOne({ email }).select('+password +twoFactorSecret +tempTwoFactorSecret');
  if (!admin || !(await admin.matchPassword(password))) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  if (admin.requiresPasswordChange) {
    let tempSecret = admin.tempTwoFactorSecret;
    if (!tempSecret) {
      const secret = speakeasy.generateSecret({
        name: `ACEPlay:${admin.email}`,
      });
      tempSecret = secret.base32;
      admin.tempTwoFactorSecret = tempSecret;
      await admin.save();
    }
    const otpauth_url = `otpauth://totp/ACEPlay:${admin.email}?secret=${tempSecret}&issuer=ACEPlay`;
    const qrCodeDataURL = await QRCode.toDataURL(otpauth_url);

    return res.json({
      success: true,
      requiresPasswordChange: true,
      userId: admin._id,
      qrCode: qrCodeDataURL,
      secret: tempSecret
    });
  }

  if (admin.isTwoFactorEnabled) {
    if (!twoFactorToken) {
      return res.json({
        success: true,
        require2FA: true,
        message: '2FA verification code required'
      });
    }

    const verified = speakeasy.totp.verify({
      secret: admin.twoFactorSecret,
      encoding: 'base32',
      token: twoFactorToken,
    });

    if (!verified) {
      return res.status(401).json({ success: false, message: 'Invalid 2FA token' });
    }
  }

  const expectedRole = resolveRole(admin.email);
  if (admin.role !== expectedRole) {
    admin.role = expectedRole;
    await admin.save();
  }

  const token = signToken(admin._id);
  res.json({
    success: true,
    data: adminPayload(admin, token),
  });
});

export const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, data: req.admin });
});

export const setupTwoFactor = asyncHandler(async (req, res) => {
  const secret = speakeasy.generateSecret({
    name: `ACEPlay:${req.admin.email}`,
  });

  const admin = await Admin.findById(req.admin._id).select('+twoFactorSecret');
  admin.twoFactorSecret = secret.base32;
  admin.isTwoFactorEnabled = false;
  await admin.save();

  const qrCodeDataURL = await QRCode.toDataURL(secret.otpauth_url);

  res.json({
    success: true,
    data: {
      qrCode: qrCodeDataURL,
      secret: secret.base32,
    },
  });
});

export const verifyTwoFactor = asyncHandler(async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ success: false, message: 'Token is required' });
  }

  const admin = await Admin.findById(req.admin._id).select('+twoFactorSecret');
  if (!admin.twoFactorSecret) {
    return res.status(400).json({ success: false, message: '2FA not set up. Please initiate setup first.' });
  }

  const verified = speakeasy.totp.verify({
    secret: admin.twoFactorSecret,
    encoding: 'base32',
    token,
  });

  if (!verified) {
    return res.status(400).json({ success: false, message: 'Invalid 2FA token' });
  }

  admin.isTwoFactorEnabled = true;
  await admin.save();

  res.json({
    success: true,
    message: '2FA enabled successfully',
  });
});

export const resetTwoFactor = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const admin = await Admin.findById(userId);
  if (!admin) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  admin.twoFactorSecret = null;
  admin.isTwoFactorEnabled = false;
  await admin.save();

  res.json({
    success: true,
    message: `2FA reset successfully for user ${admin.email}`
  });
});

export const listUsers = asyncHandler(async (req, res) => {
  const users = await Admin.find({}, '_id name email role isTwoFactorEnabled');
  res.json({
    success: true,
    data: users
  });
});

export const onboardingSetup = asyncHandler(async (req, res) => {
  const { userId, newPassword, twoFactorToken } = req.body;

  if (!userId || !newPassword || !twoFactorToken) {
    return res.status(400).json({
      success: false,
      message: 'User ID, new password, and 2FA token are required'
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters'
    });
  }

  const admin = await Admin.findById(userId).select('+password +twoFactorSecret +tempTwoFactorSecret');
  if (!admin) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  if (!admin.requiresPasswordChange) {
    return res.status(400).json({ success: false, message: 'Onboarding setup has already been completed for this user' });
  }

  if (!admin.tempTwoFactorSecret) {
    return res.status(400).json({ success: false, message: '2FA setup not initiated. Please log in first.' });
  }

  const verified = speakeasy.totp.verify({
    secret: admin.tempTwoFactorSecret,
    encoding: 'base32',
    token: twoFactorToken.trim(),
  });

  if (!verified) {
    return res.status(400).json({ success: false, message: 'Invalid 2FA token' });
  }

  // Update password and activate 2FA
  admin.password = newPassword;
  admin.twoFactorSecret = admin.tempTwoFactorSecret;
  admin.tempTwoFactorSecret = null;
  admin.requiresPasswordChange = false;
  admin.isTwoFactorEnabled = true;

  await admin.save();

  const token = signToken(admin._id);

  res.json({
    success: true,
    message: 'Password and 2FA set up successfully!',
    data: adminPayload(admin, token)
  });
});
