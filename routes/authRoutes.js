import express from 'express';
import { register, verifyRegister2FA, login, getMe, setupTwoFactor, verifyTwoFactor, onboardingSetup } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/register/verify', verifyRegister2FA);
router.post('/login', login);
router.post('/onboarding-setup', onboardingSetup);
router.get('/me', protect, getMe);
router.post('/2fa/setup', protect, setupTwoFactor);
router.post('/2fa/verify', protect, verifyTwoFactor);

export default router;
