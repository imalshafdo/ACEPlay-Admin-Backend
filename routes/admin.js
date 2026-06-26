import express from 'express';
import { getAuditLogs } from '../controllers/auditLogController.js';
import { requireSuperadmin } from '../middleware/superadminMiddleware.js';
import { resetTwoFactor, listUsers } from '../controllers/authController.js';

const router = express.Router();

router.get('/logs', requireSuperadmin, getAuditLogs);
router.get('/users', requireSuperadmin, listUsers);
router.post('/reset-2fa/:userId', requireSuperadmin, resetTwoFactor);

export default router;
