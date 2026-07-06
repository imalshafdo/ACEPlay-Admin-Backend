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
import navItemRoutes from './navItemRoutes.js';
import bigWinRoutes from './bigWinRoutes.js';
import popularGameRoutes from './popularGameRoutes.js';
import casinoRoutes from './casinoRoutes.js';
import bannerRoutes from './bannerRoutes.js';
import promotionRoutes from './promotionRoutes.js';
import gameListRoutes from './gameListRoutes.js';
import contentRoutes from './contentRoutes.js';
import countryRoutes from './countryRoutes.js';
import availabilityRoutes from './availabilityRoutes.js';
import gameTypeConfigRoutes from './gameTypeConfigRoutes.js';

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
router.use('/navigation', protect, navItemRoutes);
router.use('/big-wins', protect, bigWinRoutes);
router.use('/popular-games', protect, popularGameRoutes);
router.use('/casinos', protect, casinoRoutes);
router.use('/banners', protect, bannerRoutes);
router.use('/promotions', protect, promotionRoutes);
router.use('/games', protect, gameListRoutes);
router.use('/content', protect, contentRoutes);
router.use('/countries', protect, countryRoutes);
router.use('/availability', protect, availabilityRoutes);
router.use('/game-types', protect, gameTypeConfigRoutes);
router.post('/2fa/setup', protect, setupTwoFactor);
router.post('/2fa/enable', protect, setupTwoFactor);
router.post('/2fa/verify', protect, verifyTwoFactor);
router.post('/2fa/confirm', protect, verifyTwoFactor);

export default router;
