import express from 'express';
import {
  register,
  verifyRegister2FA,
  login,
  getMe,
  setupTwoFactor,
  verifyTwoFactor,
  onboardingSetup,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import siteSettingsRoutes from './siteSettingsRoutes.js';

const router = express.Router();

const logout = (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
};

router.post('/register', register);
router.post('/signup', register);
router.post('/register/verify', verifyRegister2FA);
router.post('/login', login);
router.post('/signin', login);
router.post('/onboarding-setup', onboardingSetup);
router.get('/me', protect, getMe);
router.get('/profile', protect, getMe);
router.post('/logout', protect, logout);
router.use('/site-settings', protect, siteSettingsRoutes);
router.post('/2fa/setup', protect, setupTwoFactor);
router.post('/2fa/enable', protect, setupTwoFactor);
router.post('/2fa/verify', protect, verifyTwoFactor);
router.post('/2fa/confirm', protect, verifyTwoFactor);

export default router;
